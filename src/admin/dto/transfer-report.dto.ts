import { ApiProperty } from '@nestjs/swagger';

export class TransferReportDto {
  @ApiProperty()
  refId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'double' })
  longitude: number;

  @ApiProperty({ format: 'double' })
  latitude: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reportDate: Date;

  @ApiProperty()
  email: string;

  constructor(
    name: string,
    refId: string,
    longitude: number,
    latitude: number,
    status: string,
    reportDate: Date,
    email: string,
  ) {
    this.name = name;
    this.refId = refId;
    this.longitude = longitude;
    this.latitude = latitude;
    this.status = status;
    this.reportDate = reportDate;
    this.email = email;
  }
}
