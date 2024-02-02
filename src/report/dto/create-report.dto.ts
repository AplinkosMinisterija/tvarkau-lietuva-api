import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  name: string;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  type: string;

  @IsEmail()
  email: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
