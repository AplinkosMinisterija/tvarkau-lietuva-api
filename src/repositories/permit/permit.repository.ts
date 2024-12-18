import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeometryCoordinates, Permit } from './schemas';
import { PermitDto } from '../../permit/dto';

export class PermitRepository {
  constructor(@InjectModel(Permit.name) private permitModel: Model<Permit>) {}

  async getAllPermits(): Promise<Permit[]> {
    return await this.permitModel.find().exec();
  }

  async createPermit(permit: PermitDto): Promise<Permit> {
    const coordinates: GeometryCoordinates[] = [];

    for (let i = 0; i < permit.permitGeometry.coordinates.length; i++) {
      coordinates[i] = new GeometryCoordinates();
      coordinates[i].latitude = permit.permitGeometry.coordinates[i].latitude;
      coordinates[i].longitude = permit.permitGeometry.coordinates[i].longitude;
    }

    const newPermit = new this.permitModel({
      permitProperties: {
        type: permit.permitProperties.type,
        issuedFrom: permit.permitProperties.issuedFrom,
        issuedTo: permit.permitProperties.issuedTo,
        cadastralNumber: permit.permitProperties.cadastralNumber,
        subdivision: permit.permitProperties.subdivision,
        forestryDistrict: permit.permitProperties.forestryDistrict,
        block: permit.permitProperties.block,
        plot: permit.permitProperties.plot,
        cuttableArea: permit.permitProperties.cuttableArea,
        dominantTree: permit.permitProperties.dominantTree,
        cuttingType: permit.permitProperties.cuttingType,
        reinstatementType: permit.permitProperties.reinstatementType,
      },
      permitGeometry: {
        type: permit.permitGeometry.type,
        coordinates: coordinates,
      },
    });

    return await newPermit.save();
  }
}
