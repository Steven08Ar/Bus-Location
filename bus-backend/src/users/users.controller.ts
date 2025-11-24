import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Auth()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('drivers')
  @Auth()
  @Roles(UserRole.ADMIN)
  createDriver(@Body() dto: CreateDriverDto) {
    return this.usersService.createDriver(dto);
  }

  @Get()
  @Auth()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('drivers')
  @Auth()
  @Roles(UserRole.ADMIN)
  findAllDrivers() {
    return this.usersService.findAllDrivers();
  }

  @Get('public-users')
  @Auth()
  @Roles(UserRole.ADMIN)
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @Auth()
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
