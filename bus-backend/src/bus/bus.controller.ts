import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { BusService } from './bus.service';

@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Get('live')
  getLiveLocations() {
    return this.busService.getLiveLocations();
  }

  @Get('history')
  getHistory(@Query('busId') busId: string, @Query('limit') limit = '50') {
    if (!busId) {
      throw new BadRequestException('busId is required');
    }
    return this.busService.getHistory(busId, Number(limit));
  }
}
