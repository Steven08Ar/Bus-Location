import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { RouteStop } from './entities/route-stop.entity';

describe('RoutesService', () => {
  let service: RoutesService;
  let routeRepo: jest.Mocked<Repository<Route>>;
  let stopRepo: jest.Mocked<Repository<RouteStop>>;

  beforeEach(async () => {
    routeRepo = createMockRepo<Route>();
    stopRepo = createMockRepo<RouteStop>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        { provide: getRepositoryToken(Route), useValue: routeRepo },
        { provide: getRepositoryToken(RouteStop), useValue: stopRepo },
      ],
    }).compile();

    service = module.get(RoutesService);
  });

  it('returns all routes', async () => {
    routeRepo.find.mockResolvedValue([{ id: '1', name: 'Route A', stops: [] } as Route]);
    const routes = await service.findAll();
    expect(routes).toHaveLength(1);
    expect(routeRepo.find).toHaveBeenCalledWith({ relations: ['stops'], order: { name: 'ASC', stops: { order: 'ASC' } } });
  });
});

function createMockRepo<T>() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}
