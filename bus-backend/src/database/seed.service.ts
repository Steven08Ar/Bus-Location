import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const adminEmail = 'admin@system.com';

        // Check if admin already exists
        const existingAdmin = await this.userRepository.findOne({
            where: { email: adminEmail },
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = this.userRepository.create({
            email: adminEmail,
            name: 'System Administrator',
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        await this.userRepository.save(admin);
        console.log('✓ Admin user created successfully');
        console.log('  Email: admin@system.com');
        console.log('  Password: admin123');
    }
}
