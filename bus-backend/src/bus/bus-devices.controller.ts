import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BusDevicesService } from './bus-devices.service';
import { CreateBusDeviceDto } from './dto/create-bus-device.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { BusDeviceStatus } from './entities/bus-device.entity';

@Controller('bus-devices')
export class BusDevicesController {
    constructor(private readonly busDevicesService: BusDevicesService) { }

    @Post()
    @Auth()
    @Roles(UserRole.ADMIN)
    async create(@Body() dto: CreateBusDeviceDto) {
        return this.busDevicesService.create(dto);
    }

    @Get()
    @Auth()
    @Roles(UserRole.ADMIN, UserRole.DRIVER)
    async findAll() {
        return this.busDevicesService.findAll();
    }

    @Get(':id')
    @Auth()
    @Roles(UserRole.ADMIN, UserRole.DRIVER)
    async findOne(@Param('id') id: string) {
        return this.busDevicesService.findOne(id);
    }

    @Patch(':id/status')
    @Auth()
    @Roles(UserRole.ADMIN)
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: BusDeviceStatus,
    ) {
        return this.busDevicesService.updateStatus(id, status);
    }

    @Delete(':id')
    @Auth()
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        await this.busDevicesService.remove(id);
        return { message: 'Bus device deleted successfully' };
    }
}
