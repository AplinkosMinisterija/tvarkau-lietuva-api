import { ApiProperty } from '@nestjs/swagger';

export class PermitPropertiesDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  issuedFrom: string;

  @ApiProperty()
  issuedTo: string;

  @ApiProperty()
  cadastralNumber: string;

  @ApiProperty({ nullable: true })
  subdivision?: string;

  @ApiProperty({ nullable: true })
  forestryDistrict?: string;

  @ApiProperty({ format: 'double', nullable: true })
  block?: number;

  @ApiProperty({ nullable: true })
  plot?: string;

  @ApiProperty({ format: 'double', nullable: true })
  cuttableArea?: number;

  @ApiProperty({ nullable: true })
  dominantTree?: string;

  @ApiProperty({ nullable: true })
  cuttingType?: string;

  @ApiProperty({ nullable: true })
  reinstatementType?: string;

  constructor(
    type: string,
    issuedFrom: string,
    issuedTo: string,
    cadastralNumber: string,
    subdivision?: string,
    forestryDistrict?: string,
    block?: number,
    plot?: string,
    cuttableArea?: number,
    dominantTree?: string,
    cuttingType?: string,
    reinstatementType?: string,
  ) {
    this.type = type;
    this.issuedFrom = issuedFrom;
    this.issuedTo = issuedTo;
    this.cadastralNumber = cadastralNumber;
    this.subdivision = subdivision;
    this.forestryDistrict = forestryDistrict;
    this.block = block;
    this.plot = plot;
    this.cuttableArea = cuttableArea;
    this.dominantTree = dominantTree;
    this.cuttingType = cuttingType;
    this.reinstatementType = reinstatementType;
  }
}
