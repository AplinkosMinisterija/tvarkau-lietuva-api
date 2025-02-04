import { ApiProperty } from '@nestjs/swagger';
import { GeometryCoordinatesDto } from './geometry-coordinates.dto';

export class PermitGeometryDto {
  @ApiProperty()
  type: string;

  @ApiProperty({ type: [GeometryCoordinatesDto] })
  coordinates: GeometryCoordinatesDto[];

  constructor(type: string, coordinates: GeometryCoordinatesDto[]) {
    this.type = type;
    this.coordinates = coordinates;
  }
}
