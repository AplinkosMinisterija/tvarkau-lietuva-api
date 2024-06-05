import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';
import {
  GeometryCoordinates,
  GeometryCoordinatesSchema,
} from './geometry-coordinates.schema';

export type PermitGeometryDocument = PermitGeometry & Document;

@Schema({ versionKey: false, _id: false })
export class PermitGeometry {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({
    type: [
      {
        type: GeometryCoordinatesSchema,
      },
    ],
  })
  @Type(() => GeometryCoordinates)
  coordinates: GeometryCoordinates[];
}

export const PermitGeometrySchema =
  SchemaFactory.createForClass(PermitGeometry);
