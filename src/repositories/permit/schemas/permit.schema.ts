import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import {
  PermitProperties,
  PermitPropertiesSchema,
} from './permit-properties.schema';
import { PermitGeometry, PermitGeometrySchema } from './permit-geometry.schema';

export type PermitDocument = Permit & Document;

@Schema({ versionKey: false })
export class Permit {
  @Prop({
    type: PermitGeometrySchema,
  })
  @Type(() => PermitGeometry)
  permitGeometry: PermitGeometry;

  @Prop({
    type: PermitPropertiesSchema,
  })
  @Type(() => PermitProperties)
  permitProperties: PermitProperties;
}

export const PermitSchema = SchemaFactory.createForClass(Permit);
