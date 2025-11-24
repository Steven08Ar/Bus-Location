import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverShift, ShiftStatus } from './entities/driver-shift.entity';
import { BusDevice } from '../bus/entities/bus-device.entity';
import { StartShiftDto } from './dto/start-shift.dto';

@Injectable()
export class DriverShiftsService {
    constructor(
        @InjectRepository(DriverShift)
        private readonly shiftRepository: Repository<DriverShift>,
        @InjectRepository(BusDevice)
        private readonly busDeviceRepository: Repository<BusDevice>,
    ) { }

    async startShift(driverId: string, dto: StartShiftDto): Promise<DriverShift> {
        // Check if driver has an active shift
        const existingShift = await this.shiftRepository.findOne({
            where: { driverId, status: ShiftStatus.ACTIVE },
        });

        if (existingShift) {
            throw new ConflictException('Driver already has an active shift');
        }

        // Check if bus device exists
        const busDevice = await this.busDeviceRepository.findOne({
            where: { id: dto.busDeviceId },
        });

        if (!busDevice) {
            throw new NotFoundException('Bus device not found');
        }

        // Check if another driver is using this bus
        const busInUse = await this.shiftRepository.findOne({
            where: { busDeviceId: dto.busDeviceId, status: ShiftStatus.ACTIVE },
        });

        if (busInUse) {
            throw new ConflictException('This bus is currently assigned to another driver');
        }

        // Create shift
        const shift = this.shiftRepository.create({
            driverId,
            busDeviceId: dto.busDeviceId,
            startTime: new Date(),
            status: ShiftStatus.ACTIVE,
        });

        return this.shiftRepository.save(shift);
    }

    async endShift(driverId: string): Promise<DriverShift> {
        const activeShift = await this.shiftRepository.findOne({
            where: { driverId, status: ShiftStatus.ACTIVE },
        });

        if (!activeShift) {
            throw new NotFoundException('No active shift found');
        }

        activeShift.endTime = new Date();
        activeShift.status = ShiftStatus.ENDED;

        return this.shiftRepository.save(activeShift);
    }

    async getActiveShift(driverId: string): Promise<DriverShift | null> {
        return this.shiftRepository.findOne({
            where: { driverId, status: ShiftStatus.ACTIVE },
            relations: ['busDevice', 'busDevice.bus'],
        });
    }

    async getAllActiveShifts(): Promise<DriverShift[]> {
        return this.shiftRepository.find({
            where: { status: ShiftStatus.ACTIVE },
            relations: ['driver', 'busDevice', 'busDevice.bus'],
        });
    }

    async getShiftHistory(driverId: string): Promise<DriverShift[]> {
        return this.shiftRepository.find({
            where: { driverId },
            relations: ['busDevice', 'busDevice.bus'],
            order: { startTime: 'DESC' },
        });
    }
}
