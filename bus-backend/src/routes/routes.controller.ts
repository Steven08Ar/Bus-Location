import { Controller, Get, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }
}

@Controller('stops')
export class StopsController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  listStops() {
    return this.routesService.listStops();
  }
}
