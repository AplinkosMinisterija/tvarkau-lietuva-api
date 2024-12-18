import { ApiProperty } from '@nestjs/swagger';

export class GeometryCoordinatesDto {
  @ApiProperty({ format: 'double' })
  latitude: number;

  @ApiProperty({ format: 'double' })
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
