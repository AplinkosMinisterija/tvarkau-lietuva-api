import { ApiProperty } from '@nestjs/swagger';
import { StatusRecordsDto } from './status-records.dto';
import { ReportCategory } from '../../common/dto/report-category';

export class PublicReportDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  category: ReportCategory;

  @ApiProperty()
  refId: string;

  @ApiProperty({ format: 'double' })
  longitude: number;

  @ApiProperty({ format: 'double' })
  latitude: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reportDate: Date;

  @ApiProperty()
  officerImageUrls: string[];

  @ApiProperty()
  imageUrls: string[];

  @ApiProperty({ type: [StatusRecordsDto] })
  statusRecords: StatusRecordsDto[];

  constructor(
    name: string,
    category: ReportCategory,
    refId: string,
    longitude: number,
    latitude: number,
    comment: string,
    status: string,
    reportDate: Date,
    officerImageUrls: string[],
    imageUrls: string[],
    statusRecords: StatusRecordsDto[],
  ) {
    this.name = name;
    this.category = category;
    this.refId = refId;
    this.longitude = longitude;
    this.latitude = latitude;
    this.comment = comment;
    this.status = status;
    this.reportDate = reportDate;
    this.officerImageUrls = officerImageUrls;
    this.imageUrls = imageUrls;
    this.statusRecords = statusRecords;
  }
}
