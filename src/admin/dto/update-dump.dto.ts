import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../common/transform/boolean.transform';

export class UpdateDumpDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  @ToBoolean()
  isVisible: boolean;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  workingHours: string;

  @ApiProperty()
  moreInformation: string;

  constructor(
    _id: string,
    name: string,
    longitude: number,
    latitude: number,
    address: string,
    phone: string,
    workingHours: string,
    moreInformation: string,
  ) {
    this._id = _id;
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.address = address;
    this.phone = phone;
    this.workingHours = workingHours;
    this.moreInformation = moreInformation;
  }
}
