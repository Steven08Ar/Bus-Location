import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusGateway } from './bus.gateway';
import { BusService } from './bus.service';
import { BusLocation } from './entities/bus-location.entity';
import { Bus } from './entities/bus.entity';

describe('BusService', () => {
  let service: BusService;
  let busRepo: jest.Mocked<Repository<Bus>>;
  let locationRepo: jest.Mocked<Repository<BusLocation>>;
  let gateway: BusGateway;

  beforeEach(async () => {
    busRepo = createMockRepo<Bus>();
    locationRepo = createMockRepo<BusLocation>();
    gateway = { broadcastLocation: jest.fn() } as unknown as BusGateway;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusService,
        { provide: getRepositoryToken(Bus), useValue: busRepo },
        { provide: getRepositoryToken(BusLocation), useValue: locationRepo },
        { provide: BusGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get<BusService>(BusService);
  });

  it('validates incoming mqtt data', () => {
    expect(service.validateIncomingMqttData({ id: 'U00124355', lat: 2, lng: 3 })).toBe(true);
    expect(service.validateIncomingMqttData({ id: '1', lat: 2, lng: 3 })).toBe(true);
    expect(service.validateIncomingMqttData({ id: null, lat: 2, lng: 3 })).toBe(false);
    expect(service.validateIncomingMqttData({ id: '', lat: 2, lng: 3 })).toBe(false);
    expect(service.validateIncomingMqttData({ id: '1', lat: 'a', lng: 3 })).toBe(false);
  });

  it('throws when saving location with null id', async () => {
    await expect(
      service.saveLocation({ id: null as unknown as string, lat: 1, lng: 2 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when saving location with empty string id', async () => {
    await expect(
      service.saveLocation({ id: '' as unknown as string, lat: 1, lng: 2 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates bus if missing and saves location', async () => {
    busRepo.findOne.mockResolvedValueOnce(null);
    busRepo.create.mockReturnValue({ id: 'U001', name: 'U001' } as Bus);
    busRepo.save.mockResolvedValue({ id: 'U001', name: 'U001' } as Bus);
    const timestamp = new Date();
    locationRepo.create.mockReturnValue({
      id: 'loc-1',
      bus: { id: 'U001' } as Bus,
      lat: 1,
      lng: 2,
      timestamp,
    } as BusLocation);
    locationRepo.save.mockResolvedValue({
      id: 'loc-1',
      bus: { id: 'U001' } as Bus,
      lat: 1,
      lng: 2,
      timestamp,
    } as BusLocation);

    const result = await service.saveLocation({ id: 'U00124355', lat: 1, lng: 2, timestamp });

    expect(busRepo.save).toHaveBeenCalled();
    expect(locationRepo.save).toHaveBeenCalled();
    expect(gateway.broadcastLocation).toHaveBeenCalled();
    expect(result.bus.id).toEqual('U00124355');
  });

  it('returns live locations for buses', async () => {
    busRepo.find.mockResolvedValue([{ id: '1', name: 'Main' } as Bus]);
    locationRepo.findOne.mockResolvedValue({
      id: 'loc-1',
      bus: { id: '1' } as Bus,
      lat: 1,
      lng: 2,
      timestamp: new Date(),
    } as BusLocation);

    const live = await service.getLiveLocations();

    expect(live).toHaveLength(1);
    expect(locationRepo.findOne).toHaveBeenCalled();
  });

  it('throws when history requested for missing bus', async () => {
    busRepo.findOne.mockResolvedValue(null);
    await expect(service.getHistory('999')).rejects.toBeInstanceOf(NotFoundException);
  });
});

function createMockRepo<T>() {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOneOrFail: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}
