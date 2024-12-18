import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsBoolean
} from 'class-validator';
import { ReportCategory } from '../../common/dto/report-category';

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

  @IsBoolean()
  automaticEmailsEnabled: boolean;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
