import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { MapboxService } from './mapbox.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MapboxService', () => {
  let service: MapboxService;
  let configService: ConfigService;

  beforeEach(() => {
    mockedAxios.get.mockReset();

    // Mock @nestjs/config ConfigService
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'MAPBOX_TOKEN') return 'test-token';
        return undefined;
      }),
    } as any;

    service = new MapboxService(configService as any);
  });

  it('returns ETA from directions', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { routes: [{ duration: 120, distance: 1000, geometry: { coordinates: [] } }] },
    } as any);

    const eta = await service.getETA({ lat: 0, lng: 0 }, { lat: 1, lng: 1 });
    expect(eta).toBe(120);
  });

  it('throws if token missing', async () => {
    // Override mock to return empty token
    configService.get = jest.fn(() => '');
    service = new MapboxService(configService as any);

    await expect(service.getETA({ lat: 0, lng: 0 }, { lat: 1, lng: 1 })).rejects.toThrow();
  });
});
