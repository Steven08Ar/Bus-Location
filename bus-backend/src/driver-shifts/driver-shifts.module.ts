import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverShiftsService } from './driver-shifts.service';
import { DriverShiftsController } from './driver-shifts.controller';
import { DriverShift } from './entities/driver-shift.entity';
import { BusDevice } from '../bus/entities/bus-device.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DriverShift, BusDevice])],
    controllers: [DriverShiftsController],
    providers: [DriverShiftsService],
    exports: [DriverShiftsService],
})
export class DriverShiftsModule { }
