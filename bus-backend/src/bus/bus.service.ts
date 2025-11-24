import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { BusLocation } from './entities/bus-location.entity';
import { UpdateLocationDto } from './dto/update-location.dto';
import { BusGateway } from './bus.gateway';
import { BusLocationPayload } from './interfaces/location-message.interface';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(BusLocation)
    private readonly locationRepository: Repository<BusLocation>,
    private readonly busGateway: BusGateway,
  ) {}

  validateIncomingMqttData(data: any): data is BusLocationPayload {
    if (!data || typeof data !== 'object') return false;
    const { id, lat, lng } = data as Record<string, unknown>;
    const isValidNumber = (value: unknown) =>
      typeof value === 'number' && Number.isFinite(value);
    return (
      typeof id === 'string' &&
      id.trim() !== '' &&
      isValidNumber(lat) &&
      isValidNumber(lng)
    );
  }

  async saveLocation(dto: UpdateLocationDto | BusLocationPayload): Promise<BusLocation> {
    if (!this.validateIncomingMqttData(dto)) {
      throw new BadRequestException('Invalid location payload');
    }
    const bus = await this.getOrCreateBus(dto.id);
    const location = this.locationRepository.create({
      bus,
      lat: dto.lat,
      lng: dto.lng,
      speed: dto.speed,
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
    });
    const saved = await this.locationRepository.save(location);
    this.busGateway.broadcastLocation({
      id: bus.id,
      lat: saved.lat,
      lng: saved.lng,
      speed: saved.speed,
      timestamp: saved.timestamp,
    });
    return saved;
  }

  async getLiveLocations(): Promise<BusLocation[]> {
    const buses = await this.busRepository.find();
    const latestLocations: BusLocation[] = [];

    for (const bus of buses) {
      const latest = await this.locationRepository.findOne({
        where: { bus: { id: bus.id } },
        order: { timestamp: 'DESC' },
        relations: ['bus'],
      });

      if (latest) {
        latestLocations.push(latest);
      }
    }

    return latestLocations;
  }

  async getHistory(busId: string, limit = 50): Promise<BusLocation[]> {
    const bus = await this.busRepository.findOne({ where: { id: busId } });
    if (!bus) {
      throw new NotFoundException(`Bus ${busId} not found`);
    }

    return this.locationRepository.find({
      where: { bus: { id: bus.id } },
      order: { timestamp: 'DESC' },
      take: limit,
      relations: ['bus'],
    });
  }

  private async getOrCreateBus(busId: string): Promise<Bus> {
    if (!busId) {
      throw new BadRequestException('Bus id cannot be empty');
    }
    const existing = await this.busRepository.findOne({ where: { id: busId } });
    if (existing) {
      return existing;
    }

    const created = this.busRepository.create({ id: busId, name: busId });
    return this.busRepository.save(created);
  }
}
