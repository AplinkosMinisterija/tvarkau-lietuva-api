import { ApiProperty } from '@nestjs/swagger';
import {
  IsReportTextWithinLimit,
  REPORT_TEXT_MAX_LENGTH,
} from '../../common/report-text';

export class TransferReportDto {
  @ApiProperty()
  refId: string;

  @ApiProperty({
    maxLength: REPORT_TEXT_MAX_LENGTH,
    description: 'Report text, up to 4000 UTF-16 code units including spaces.',
  })
  @IsReportTextWithinLimit()
  name: string;

  @ApiProperty({ format: 'double' })
  longitude: number;

  @ApiProperty({ format: 'double' })
  latitude: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reportDate: Date;

  @ApiProperty({ nullable: true })
  email?: string;

  @ApiProperty()
  severityCategory: string;

  constructor(
    name: string,
    refId: string,
    longitude: number,
    latitude: number,
    status: string,
    reportDate: Date,
    email: string,
    severityCategory: string,
  ) {
    this.name = name;
    this.refId = refId;
    this.longitude = longitude;
    this.latitude = latitude;
    this.status = status;
    this.reportDate = reportDate;
    this.email = email;
    this.severityCategory = severityCategory;
  }
}
