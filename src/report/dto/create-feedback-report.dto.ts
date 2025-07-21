import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackReportDto {
  @IsNotEmpty()
  description: string;

  @IsEmail()
  email: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  images?: any[];
}
