import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async create(dto: CreateUserDto) {
    const entity = this.userRepository.create(dto);
    return this.userRepository.save(entity);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  // Public user registration
  async register(dto: RegisterUserDto): Promise<User> {
    // Check if email already exists
    const existingEmail = await this.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if userId already exists
    const existingUserId = await this.findByUserId(dto.userId);
    if (existingUserId) {
      throw new ConflictException('User ID already taken');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(dto.password);

    // Generate QR code from userId
    const qrCode = `QR-${dto.userId}-${uuidv4()}`;

    // Create user
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      userId: dto.userId,
      password: hashedPassword,
      role: UserRole.USER,
      qrCode,
    });

    return this.userRepository.save(user);
  }

  // Admin creates driver
  async createDriver(dto: CreateDriverDto): Promise<User> {
    // Check if email already exists
    const existingEmail = await this.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if driverId already exists
    const existingDriverId = await this.userRepository.findOne({
      where: { driverId: dto.driverId }
    });
    if (existingDriverId) {
      throw new ConflictException('Driver ID already taken');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(dto.password);

    // Create driver
    const driver = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      driverId: dto.driverId,
      password: hashedPassword,
      role: UserRole.DRIVER,
    });

    return this.userRepository.save(driver);
  }

  // Get all users (public passengers)
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { role: UserRole.USER } });
  }

  // Get all drivers
  async findAllDrivers(): Promise<User[]> {
    return this.userRepository.find({ where: { role: UserRole.DRIVER } });
  }

  // Validate password
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
