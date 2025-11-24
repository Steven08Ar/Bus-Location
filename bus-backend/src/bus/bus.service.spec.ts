import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusService } from './bus.service';
import { Bus } from './entities/bus.entity';
import { BusLocation } from './entities/bus-location.entity';
import { BusGateway } from './bus.gateway';

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

  it('creates bus if missing and saves location', async () => {
    busRepo.findOne.mockResolvedValue(null as unknown as Bus);
    busRepo.create.mockReturnValue({ id: 'bus-1', name: 'bus-1' } as Bus);
    busRepo.save.mockResolvedValue({ id: 'bus-1', name: 'bus-1' } as Bus);
    const timestamp = new Date();
    locationRepo.create.mockReturnValue({
      id: 'loc-1',
      bus: { id: 'bus-1' } as Bus,
      lat: 1,
      lng: 2,
      timestamp,
    } as BusLocation);
    locationRepo.save.mockResolvedValue({
      id: 'loc-1',
      bus: { id: 'bus-1' } as Bus,
      lat: 1,
      lng: 2,
      timestamp,
    } as BusLocation);

    const result = await service.saveLocation({ busId: 'bus-1', lat: 1, lng: 2, timestamp });

    expect(busRepo.save).toHaveBeenCalled();
    expect(locationRepo.save).toHaveBeenCalled();
    expect(gateway.broadcastLocation).toHaveBeenCalled();
    expect(result.bus.id).toEqual('bus-1');
  });

  it('returns live locations for buses', async () => {
    busRepo.find.mockResolvedValue([{ id: 'bus-1', name: 'Main' } as Bus]);
    locationRepo.findOne.mockResolvedValue({
      id: 'loc-1',
      bus: { id: 'bus-1' } as Bus,
      lat: 1,
      lng: 2,
      timestamp: new Date(),
    } as BusLocation);

    const live = await service.getLiveLocations();

    expect(live).toHaveLength(1);
    expect(locationRepo.findOne).toHaveBeenCalled();
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
