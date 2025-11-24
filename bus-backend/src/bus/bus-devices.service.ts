import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusDevice, BusDeviceStatus } from './entities/bus-device.entity';
import { CreateBusDeviceDto } from './dto/create-bus-device.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class BusDevicesService {
    constructor(
        @InjectRepository(BusDevice)
        private readonly busDeviceRepository: Repository<BusDevice>,
    ) { }

    async create(dto: CreateBusDeviceDto): Promise<BusDevice> {
        // Check if hardware ID already exists
        const existing = await this.busDeviceRepository.findOne({
            where: { hardwareId: dto.hardwareId },
        });

        if (existing) {
            throw new ConflictException('Hardware ID already registered');
        }

        // Generate device key for MQTT authentication
        const deviceKey = crypto.randomBytes(32).toString('hex');

        const device = this.busDeviceRepository.create({
            hardwareId: dto.hardwareId,
            deviceKey,
            busId: dto.busId,
            status: BusDeviceStatus.ACTIVE,
        });

        return this.busDeviceRepository.save(device);
    }

    async findAll(): Promise<BusDevice[]> {
        return this.busDeviceRepository.find({ relations: ['bus'] });
    }

    async findOne(id: string): Promise<BusDevice> {
        const device = await this.busDeviceRepository.findOne({
            where: { id },
            relations: ['bus'],
        });

        if (!device) {
            throw new NotFoundException('Bus device not found');
        }

        return device;
    }

    async validateDeviceKey(deviceKey: string): Promise<BusDevice | null> {
        return this.busDeviceRepository.findOne({
            where: { deviceKey },
            relations: ['bus'],
        });
    }

    async updateStatus(id: string, status: BusDeviceStatus): Promise<BusDevice> {
        const device = await this.findOne(id);
        device.status = status;
        return this.busDeviceRepository.save(device);
    }

    async remove(id: string): Promise<void> {
        const device = await this.findOne(id);
        await this.busDeviceRepository.remove(device);
    }
}
