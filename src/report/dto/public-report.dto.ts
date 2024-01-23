import { ApiProperty } from '@nestjs/swagger';
import { StatusRecordsDto } from './status-records.dto';

export class PublicReportDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

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
    type: string,
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
    this.type = type;
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
