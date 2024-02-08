import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Category } from '../../common/constants/enums';

export class DumpDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsEnum(Category)
  category: string;

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
    category: string,
    reportLong: number,
    reportLat: number,
    address: string,
    phone: string,
    workingHours: string,
    moreInformation: string,
  ) {
    this.name = name;
    this.category = category;
    this.reportLong = reportLong;
    this.reportLat = reportLat;
    this.address = address;
    this.phone = phone;
    this.workingHours = workingHours;
    this.moreInformation = moreInformation;
  }
}
