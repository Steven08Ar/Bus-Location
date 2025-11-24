import axios from 'axios';
import { MapboxService } from './mapbox.service';
import { ConfigService } from '../config/config.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MapboxService', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('returns ETA from directions', async () => {
    const config = { get: () => 'token' } as unknown as ConfigService;
    const service = new MapboxService(config);
    mockedAxios.get.mockResolvedValue({
      data: { routes: [{ duration: 120, distance: 1000, geometry: { coordinates: [] } }] },
    } as any);

    const eta = await service.getETA({ lat: 0, lng: 0 }, { lat: 1, lng: 1 });
    expect(eta).toBe(120);
  });

  it('throws if token missing', async () => {
    const config = { get: () => '' } as unknown as ConfigService;
    const service = new MapboxService(config);
    await expect(service.getETA({ lat: 0, lng: 0 }, { lat: 1, lng: 1 })).rejects.toThrow();
  });
});
