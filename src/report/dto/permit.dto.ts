import { ApiProperty } from '@nestjs/swagger';
import { PermitPropertiesDto } from './permit-properties.dto';
import { PermitGeometryDto } from './permit-geometry.dto';

export class PermitDto {
  @ApiProperty({ type: PermitPropertiesDto })
  permitProperties: PermitPropertiesDto;

  @ApiProperty({ type: PermitGeometryDto })
  permitGeometry: PermitGeometryDto;

  constructor(
    permitProperties: PermitPropertiesDto,
    permitGeometry: PermitGeometryDto,
  ) {
    this.permitProperties = permitProperties;
    this.permitGeometry = permitGeometry;
  }
}
