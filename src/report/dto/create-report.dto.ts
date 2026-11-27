import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { ReportCategory } from '../../common/dto/report-category';
import { ToBoolean } from 'src/common/transform/boolean.transform';
import {
  IsReportTextWithinLimit,
  REPORT_TEXT_MAX_LENGTH,
} from '../../common/report-text';

export class CreateReportDto {
  @ApiProperty({
    maxLength: REPORT_TEXT_MAX_LENGTH,
    description: 'Report text, up to 4000 UTF-16 code units including spaces.',
  })
  @IsNotEmpty()
  @IsReportTextWithinLimit()
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

  @IsPhoneNumber('LT')
  @ApiPropertyOptional()
  @IsOptional()
  phoneNumber?: string;
}
