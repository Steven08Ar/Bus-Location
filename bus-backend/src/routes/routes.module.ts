import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController, StopsController } from './routes.controller';
import { Route } from './entities/route.entity';
import { RouteStop } from './entities/route-stop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RouteStop])],
  controllers: [RoutesController, StopsController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
