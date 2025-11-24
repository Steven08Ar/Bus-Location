import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';

export enum BusDeviceStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    MAINTENANCE = 'maintenance',
}

@Entity('bus_devices')
export class BusDevice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    deviceKey: string; // MQTT authentication key

    @Column({ unique: true })
    hardwareId: string; // Physical device ID

    @Column({
        type: 'enum',
        enum: BusDeviceStatus,
        default: BusDeviceStatus.INACTIVE,
    })
    status: BusDeviceStatus;

    @ManyToOne(() => Bus, { nullable: true })
    @JoinColumn({ name: 'busId' })
    bus: Bus;

    @Column({ nullable: true })
    busId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
