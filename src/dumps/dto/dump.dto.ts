import { ApiProperty } from '@nestjs/swagger';

export class DumpDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ format: 'double' })
  reportLong: number;

  @ApiProperty({ format: 'double' })
  reportLat: number;

  @ApiProperty({ nullable: true })
  address: string;

  @ApiProperty({ nullable: true })
  phone: string;

  @ApiProperty()
  workingHours: string;

  @ApiProperty()
  moreInformation: string;

  constructor(
    name: string,
    type: string,
    reportLong: number,
    reportLat: number,
    address: string,
    phone: string,
    workingHours: string,
    moreInformation: string,
  ) {
    this.name = name;
    this.type = type;
    this.reportLong = reportLong;
    this.reportLat = reportLat;
    this.address = address;
    this.phone = phone;
    this.workingHours = workingHours;
    this.moreInformation = moreInformation;
  }
}
