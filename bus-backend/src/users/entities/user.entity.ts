import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ unique: true, nullable: true })
  userId?: string; // Unique ID chosen by user

  @Column({ unique: true, nullable: true })
  driverId?: string; // Unique driver ID (for drivers only)

  @Column({ nullable: true })
  qrCode?: string; // Auto-generated QR code from userId

  @Column({ nullable: true })
  nfcTagId?: string; // For NFC authentication

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
