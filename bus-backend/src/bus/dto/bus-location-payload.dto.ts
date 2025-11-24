import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class BusLocationPayloadDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsNumber()
  speed?: number;
}
