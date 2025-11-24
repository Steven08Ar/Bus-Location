import { Injectable, NotFoundException } from '@nestjs/common';
import { MapboxService } from '../mapbox/mapbox.service';
import { RoutesService } from '../routes/routes.service';

@Injectable()
export class EtaService {
  constructor(
    private readonly mapboxService: MapboxService,
    private readonly routesService: RoutesService,
  ) {}

  async getEta(fromStopId: string, toStopId: string) {
    const fromStop = await this.routesService.getStopById(fromStopId);
    const toStop = await this.routesService.getStopById(toStopId);

    if (!fromStop || !toStop) {
      throw new NotFoundException('Route stop not found');
    }

    const etaSeconds = await this.mapboxService.getETA(
      { lat: fromStop.latitude, lng: fromStop.longitude },
      { lat: toStop.latitude, lng: toStop.longitude },
    );
    const distanceMeters = await this.mapboxService.getDistance(
      { lat: fromStop.latitude, lng: fromStop.longitude },
      { lat: toStop.latitude, lng: toStop.longitude },
    );

    return {
      from: fromStopId,
      to: toStopId,
      etaSeconds,
      etaMinutes: Math.round(etaSeconds / 60),
      distanceMeters,
    };
  }
}
