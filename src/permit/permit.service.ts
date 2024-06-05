import { Injectable } from '@nestjs/common';
import { PermitDto } from './dto';
import { PermitRepository } from '../repositories/permit/permit.repository';
import {
  GeometryCoordinates,
  Permit,
  PermitGeometry,
  PermitProperties,
} from '../repositories/permit/schemas';
import { PermitPropertiesDto } from './dto/permit-properties.dto';
import { PermitGeometryDto } from './dto/permit-geometry.dto';
import { GeometryCoordinatesDto } from './dto/geometry-coordinates.dto';

@Injectable()
export class PermitService {
  constructor(private readonly permitRepository: PermitRepository) {}

  async getAllPermits(): Promise<PermitDto[]> {
    const permits = await this.permitRepository.getAllPermits();
    return permits.map(PermitService.docToPermit);
  }

  async createPermit(permit: PermitDto): Promise<PermitDto> {
    const newPermit = await this.permitRepository.createPermit(permit);
    return PermitService.docToPermit(newPermit);
  }

  async createMultiplePermits(permits: PermitDto[]): Promise<PermitDto[]> {
    const convertedPermits = [];
    for (let i = 0; i < permits.length; i++) {
      const newPermit = await this.permitRepository.createPermit(permits[i]);
      convertedPermits[i] = PermitService.docToPermit(newPermit);
    }
    return convertedPermits;
  }

  private static docToPermit(e: Permit): PermitDto {
    return new PermitDto(
      PermitService.docToProperties(e.permitProperties),
      PermitService.docToGeometry(e.permitGeometry),
    );
  }

  private static docToProperties(e: PermitProperties): PermitPropertiesDto {
    return new PermitPropertiesDto(
      e.type,
      e.issuedFrom,
      e.issuedTo,
      e.cadastralNumber,
      e.subdivision,
      e.forestryDistrict,
      e.block,
      e.plot,
      e.cuttableArea,
      e.dominantTree,
      e.cuttingType,
      e.reinstatementType,
    );
  }

  private static docToGeometry(e: PermitGeometry): PermitGeometryDto {
    return new PermitGeometryDto(
      e.type,
      e.coordinates.map(PermitService.coordinatesToGeometry),
    );
  }

  private static coordinatesToGeometry(
    e: GeometryCoordinates,
  ): GeometryCoordinatesDto {
    return new GeometryCoordinatesDto(e.latitude, e.longitude);
  }
}
