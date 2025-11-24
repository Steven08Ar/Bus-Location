import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DriverShiftsService } from './driver-shifts.service';
import { StartShiftDto } from './dto/start-shift.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('driver-shifts')
export class DriverShiftsController {
    constructor(private readonly shiftsService: DriverShiftsService) { }

    @Post('start')
    @Auth()
    @Roles(UserRole.DRIVER)
    async startShift(
        @CurrentUser() user: any,
        @Body() dto: StartShiftDto,
    ) {
        return this.shiftsService.startShift(user.id, dto);
    }

    @Post('end')
    @Auth()
    @Roles(UserRole.DRIVER)
    async endShift(@CurrentUser() user: any) {
        return this.shiftsService.endShift(user.id);
    }

    @Get('active')
    @Auth()
    @Roles(UserRole.DRIVER)
    async getActiveShift(@CurrentUser() user: any) {
        return this.shiftsService.getActiveShift(user.id);
    }

    @Get('history')
    @Auth()
    @Roles(UserRole.DRIVER)
    async getHistory(@CurrentUser() user: any) {
        return this.shiftsService.getShiftHistory(user.id);
    }

    @Get('all-active')
    @Auth()
    @Roles(UserRole.ADMIN)
    async getAllActiveShifts() {
        return this.shiftsService.getAllActiveShifts();
    }
}
