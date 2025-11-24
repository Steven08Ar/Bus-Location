import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBusDeviceDto {
    @IsNotEmpty()
    @IsString()
    hardwareId: string;

    @IsNotEmpty()
    @IsString()
    busId: string;
}
