import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bus } from '../src/bus/entities/bus.entity';
import { BusLocation } from '../src/bus/entities/bus-location.entity';
import { Route } from '../src/routes/entities/route.entity';
import { RouteStop } from '../src/routes/entities/route-stop.entity';
import { User } from '../src/users/entities/user.entity';
import { BusModule } from '../src/bus/bus.module';
import { RoutesModule } from '../src/routes/routes.module';
import { UsersModule } from '../src/users/users.module';
import { EtaModule } from '../src/eta/eta.module';
import { MapboxService } from '../src/mapbox/mapbox.service';
import { MqttService } from '../src/bus/mqtt.service';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Bus, BusLocation, Route, RouteStop, User],
          synchronize: true,
        }),
        BusModule,
        RoutesModule,
        UsersModule,
        EtaModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(MapboxService)
      .useValue({
        getETA: jest.fn().mockResolvedValue(120),
        getDistance: jest.fn().mockResolvedValue(1000),
        getRouteCoordinates: jest.fn().mockResolvedValue([]),
      })
      .overrideProvider(MqttService)
      .useValue({ onModuleInit: jest.fn(), onModuleDestroy: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // seed data
    const busRepo = moduleRef.get<any>(getRepositoryToken(Bus));
    const locRepo = moduleRef.get<any>(getRepositoryToken(BusLocation));
    const stopRepo = moduleRef.get<any>(getRepositoryToken(RouteStop));
    const routeRepo = moduleRef.get<any>(getRepositoryToken(Route));
    const userRepo = moduleRef.get<any>(getRepositoryToken(User));

    const route = await routeRepo.save(routeRepo.create({ name: 'Route A', description: 'Test route' }));
    const stopA = await stopRepo.save(
      stopRepo.create({ name: 'Stop A', latitude: 0, longitude: 0, order: 1, route }),
    );
    await stopRepo.save(stopA);

    const bus = await busRepo.save(busRepo.create({ id: 'U00124355', name: 'Bus 1', route }));
    await locRepo.save(
      locRepo.create({ bus, lat: 10, lng: 20, speed: 30, timestamp: new Date('2024-01-01T00:00:00Z') }),
    );

    await userRepo.save(userRepo.create({ email: 'test@example.com', name: 'Test User', password: 'secret123' }));
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok', service: 'bus-backend' });
  });

  it('GET /bus/live', async () => {
    const res = await request(app.getHttpServer()).get('/bus/live').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('lat');
    expect(res.body[0]).toHaveProperty('lng');
  });

  it('GET /bus/history', async () => {
    const res = await request(app.getHttpServer()).get('/bus/history?busId=U00124355').expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].bus.id).toBe('U00124355');
  });

  it('POST /users', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'new@example.com', name: 'New User', password: 'password123' })
      .expect(201);
    expect(res.body.email).toBe('new@example.com');
  });

  it('POST /bus/location accepts alphanumeric id and appears in live', async () => {
    await request(app.getHttpServer())
      .post('/bus/location')
      .send({ id: 'BUS-10', lat: 5, lng: 6 })
      .expect(201);

    const live = await request(app.getHttpServer()).get('/bus/live').expect(200);
    const found = live.body.find((l: any) => l.bus.id === 'BUS-10');
    expect(found).toBeDefined();
    expect(found.lat).toBe(5);
    expect(found.lng).toBe(6);
  });

  it('POST /bus/location converts numeric id to string transparently', async () => {
    await request(app.getHttpServer())
      .post('/bus/location')
      .send({ id: '1234', lat: 1, lng: 2 })
      .expect(201);

    const res = await request(app.getHttpServer()).get('/bus/history?busId=1234').expect(200);
    expect(res.body[0].bus.id).toBe('1234');
  });
});
