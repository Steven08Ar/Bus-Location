import axios from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { handleServiceError } from '../utils/error-handler';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface MapboxRoute {
  distance: number;
  duration: number;
  geometry?: { coordinates: number[][] };
}

interface MapboxResponse {
  routes: MapboxRoute[];
}

@Injectable()
export class MapboxService {
  constructor(private readonly configService: ConfigService) { }

  private get token(): string {
    const token = this.configService.get('MAPBOX_TOKEN');
    if (!token) {
      throw new BadRequestException('Mapbox token is not configured');
    }
    return token;
  }

  async getRouteCoordinates(start: Coordinates, end: Coordinates): Promise<number[][]> {
    const data = await this.fetchDirections(start, end);
    return data.routes[0]?.geometry?.coordinates ?? [];
  }

  async getETA(start: Coordinates, end: Coordinates): Promise<number> {
    const data = await this.fetchDirections(start, end);
    const duration = data.routes[0]?.duration ?? 0;
    return Math.round(duration);
  }

  async getDistance(start: Coordinates, end: Coordinates): Promise<number> {
    const data = await this.fetchDirections(start, end);
    return data.routes[0]?.distance ?? 0;
  }

  private async fetchDirections(start: Coordinates, end: Coordinates): Promise<MapboxResponse> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?access_token=${this.token}&geometries=geojson&overview=full`;
    try {
      const response = await axios.get<MapboxResponse>(url);
      if (!response.data.routes?.length) {
        throw new BadRequestException('No route available for provided coordinates');
      }
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Mapbox API');
    }
  }
}
