import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BusDevice } from '../../bus/entities/bus-device.entity';

export enum ShiftStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
}

@Entity('driver_shifts')
export class DriverShift {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'driverId' })
    driver: User;

    @Column()
    driverId: string;

    @ManyToOne(() => BusDevice)
    @JoinColumn({ name: 'busDeviceId' })
    busDevice: BusDevice;

    @Column()
    busDeviceId: string;

    @Column()
    startTime: Date;

    @Column({ nullable: true })
    endTime: Date;

    @Column({
        type: 'enum',
        enum: ShiftStatus,
        default: ShiftStatus.ACTIVE,
    })
    status: ShiftStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
