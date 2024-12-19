import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
} from 'class-validator';
import { ReportCategory } from '../../common/dto/report-category';
import { ToBoolean } from 'src/common/transform/boolean.transform';

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

  @ApiProperty()
  @ToBoolean()
  automaticEmailsEnabled: boolean;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
