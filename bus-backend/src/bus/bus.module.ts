import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { Bus } from './entities/bus.entity';
import { BusLocation } from './entities/bus-location.entity';
import { BusDevice } from './entities/bus-device.entity';
import { BusGateway } from './bus.gateway';
import { MqttService } from './mqtt.service';
import { BusDevicesService } from './bus-devices.service';
import { BusDevicesController } from './bus-devices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bus, BusLocation, BusDevice])],
  controllers: [BusController, BusDevicesController],
  providers: [BusService, BusDevicesService, BusGateway, MqttService],
  exports: [BusService, BusDevicesService],
})
export class BusModule { }
