import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { Bus } from './entities/bus.entity';
import { BusLocation } from './entities/bus-location.entity';
import { BusGateway } from './bus.gateway';
import { MqttService } from './mqtt.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Bus, BusLocation])],
  controllers: [BusController],
  providers: [BusService, BusGateway, MqttService],
  exports: [BusService],
})
export class BusModule {}
