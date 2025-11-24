import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { RouteStop } from './entities/route-stop.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(RouteStop)
    private readonly stopRepository: Repository<RouteStop>,
  ) {}

  findAll(): Promise<Route[]> {
    return this.routeRepository.find({
      relations: ['stops'],
      order: { name: 'ASC', stops: { order: 'ASC' } },
    });
  }

  findOne(id: string): Promise<Route | null> {
    return this.routeRepository.findOne({
      where: { id },
      relations: ['stops'],
      order: { stops: { order: 'ASC' } },
    });
  }

  getStopById(id: string): Promise<RouteStop | null> {
    return this.stopRepository.findOne({ where: { id }, relations: ['route'] });
  }

  listStops(): Promise<RouteStop[]> {
    return this.stopRepository.find({ order: { order: 'ASC' } });
  }
}
