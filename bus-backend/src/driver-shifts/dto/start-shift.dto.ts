import { IsNotEmpty, IsUUID } from 'class-validator';

export class StartShiftDto {
    @IsNotEmpty()
    @IsUUID()
    busDeviceId: string;
}
