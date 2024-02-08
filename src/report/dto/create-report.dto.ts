import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { ReportCategory } from '../../common/constants/enums';

export class CreateReportDto {
  @IsNotEmpty()
  name: string;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsEnum(ReportCategory)
  category: ReportCategory;

  @IsEmail()
  email: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
