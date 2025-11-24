import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDriverDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    driverId: string; // Unique driver ID

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
