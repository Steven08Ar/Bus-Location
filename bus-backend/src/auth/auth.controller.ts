import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Public user registration
    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        return this.authService.register(registerDto);
    }

    // Admin login
    @Post('admin/login')
    async adminLogin(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto, UserRole.ADMIN);
    }

    // Driver login
    @Post('driver/login')
    async driverLogin(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto, UserRole.DRIVER);
    }

    // User login
    @Post('user/login')
    async userLogin(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto, UserRole.USER);
    }

    // Get current authenticated user
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user: any) {
        return this.authService.getMe(user.id);
    }

    // Refresh token
    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }
}
