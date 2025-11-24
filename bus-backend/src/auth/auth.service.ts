import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { JwtPayload, AuthResponse } from './interfaces/auth.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await this.usersService.validatePassword(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async login(loginDto: LoginDto, requiredRole?: UserRole): Promise<AuthResponse> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user has required role
        if (requiredRole && user.role !== requiredRole) {
            throw new UnauthorizedException(`Access denied. ${requiredRole} role required`);
        }

        return this.generateTokens(user);
    }

    async register(registerDto: RegisterUserDto): Promise<AuthResponse> {
        const user = await this.usersService.register(registerDto);
        return this.generateTokens(user);
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            });

            const user = await this.usersService.findOne(payload.sub);

            const newAccessToken = this.jwtService.sign(
                {
                    sub: user.id,
                    email: user.email,
                    role: user.role,
                } as JwtPayload,
                {
                    secret: process.env.JWT_SECRET || 'secret-key',
                    expiresIn: '15m',
                },
            );

            return { access_token: newAccessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private generateTokens(user: User): AuthResponse {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'secret-key',
            expiresIn: '15m',
        });

        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            expiresIn: '7d',
        });

        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async getMe(userId: string): Promise<User> {
        return this.usersService.findOne(userId);
    }
}
