import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
} from 'class-validator';
import { ReportCategory } from '../../common/dto/report-category';

export class CreateFeedbackReportDto {
  @IsNotEmpty()
  description: string;

  @IsEmail()
  email: string;
}
