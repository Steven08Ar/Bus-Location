import { Module } from '@nestjs/common';
import { EtaService } from './eta.service';
import { EtaController } from './eta.controller';
import { MapboxModule } from '../mapbox/mapbox.module';
import { RoutesModule } from '../routes/routes.module';

@Module({
  imports: [MapboxModule, RoutesModule],
  controllers: [EtaController],
  providers: [EtaService],
})
export class EtaModule {}
