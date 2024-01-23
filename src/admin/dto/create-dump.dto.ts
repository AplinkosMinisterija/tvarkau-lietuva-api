import { ApiProperty } from '@nestjs/swagger';

export class CreateDumpDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  reportLong: number;

  @ApiProperty()
  reportLat: number;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  workingHours?: string;

  @ApiProperty()
  moreInformation?: string;

  constructor(
    name: string,
    reportLong: number,
    reportLat: number,
    address: string,
    phone: string,
    workingHours: string,
    moreInformation: string,
  ) {
    this.name = name;
    this.reportLong = reportLong;
    this.reportLat = reportLat;
    this.address = address;
    this.phone = phone;
    this.workingHours = workingHours;
    this.moreInformation = moreInformation;
  }
}
