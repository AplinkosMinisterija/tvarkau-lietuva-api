import { ApiProperty } from '@nestjs/swagger';

export class JsonCoordsDto {
  @ApiProperty({ format: 'double' })
  minLat: number;

  @ApiProperty({ format: 'double' })
  maxLat: number;

  @ApiProperty({ format: 'double' })
  minLong: number;

  @ApiProperty({ format: 'double' })
  maxLong: number;

  constructor(
    minLat: number,
    maxLat: number,
    minLong: number,
    maxLong: number,
  ) {
    this.minLat = minLat;
    this.maxLat = maxLat;
    this.minLong = minLong;
    this.maxLong = maxLong;
  }
}
