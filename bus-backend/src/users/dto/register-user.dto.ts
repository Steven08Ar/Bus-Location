import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    userId: string; // Unique ID chosen by user

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
