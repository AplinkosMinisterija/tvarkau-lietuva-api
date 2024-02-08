import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../common/transform/boolean.transform';

export class FullDumpDto {
  @ApiProperty()
  refId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ format: 'double' })
  longitude: number;

  @ApiProperty({ format: 'double' })
  latitude: number;

  @ApiProperty()
  @ToBoolean()
  isVisible: boolean;

  @ApiProperty({ nullable: true })
  address?: string;

  @ApiProperty({ nullable: true })
  phone?: string;

  @ApiProperty()
  workingHours: string;

  @ApiProperty()
  moreInformation: string;

  constructor(
    refId: string,
    name: string,
    category: string,
    longitude: number,
    latitude: number,
    isVisible: boolean,
    address: string,
    phone: string,
    workingHours: string,
    moreInformation: string,
  ) {
    this.refId = refId;
    this.name = name;
    this.category = category;
    this.longitude = longitude;
    this.latitude = latitude;
    this.isVisible = isVisible;
    this.address = address;
    this.phone = phone;
    this.workingHours = workingHours;
    this.moreInformation = moreInformation;
  }
}
