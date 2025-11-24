import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import * as mqtt from 'mqtt';
import { MqttService } from './mqtt.service';
import { BusService } from './bus.service';

jest.mock('mqtt', () => ({
  connect: jest.fn(),
}));

describe('MqttService', () => {
  let module: TestingModule;
  let service: MqttService;
  let busService: { saveLocation: jest.Mock; validateIncomingMqttData: jest.Mock };
  let mockClient: mqtt.MqttClient & EventEmitter;

  beforeEach(async () => {
    mockClient = Object.assign(new EventEmitter(), {
      subscribe: jest.fn((topic, cb) => cb && cb(null)),
      end: jest.fn((force?: boolean, opts?: any, cb?: () => void) => cb && cb()),
    }) as unknown as mqtt.MqttClient & EventEmitter;

    (mqtt.connect as jest.Mock).mockReturnValue(mockClient);

    busService = {
      saveLocation: jest.fn(),
      validateIncomingMqttData: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        MqttService,
        { provide: BusService, useValue: busService },
        { provide: ConfigService, useValue: { get: () => 'mqtt://mqtt:1883' } },
      ],
    }).compile();

    service = module.get<MqttService>(MqttService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
    jest.resetAllMocks();
  });

  it('discards invalid messages', async () => {
    busService.validateIncomingMqttData.mockReturnValue(false);
    mockClient.emit('connect');
    mockClient.emit('message', 'bus/location', Buffer.from(JSON.stringify({ lat: 1, lng: 2 })));

    expect(busService.saveLocation).not.toHaveBeenCalled();
  });

  it('saves valid messages converting numeric id to string', async () => {
    busService.validateIncomingMqttData.mockReturnValue(true);
    mockClient.emit('connect');
    mockClient.emit('message', 'bus/location', Buffer.from(JSON.stringify({ id: 1234, lat: 1, lng: 2 })));

    expect(busService.saveLocation).toHaveBeenCalledWith({
      id: '1234',
      lat: 1,
      lng: 2,
      speed: undefined,
      timestamp: expect.any(Date),
    });
  });
});
