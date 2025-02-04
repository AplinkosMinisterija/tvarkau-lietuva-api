import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GeometryCoordinatesDocument = GeometryCoordinates & Document;

@Schema({ versionKey: false, _id: false })
export class GeometryCoordinates {
  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;
}

export const GeometryCoordinatesSchema =
  SchemaFactory.createForClass(GeometryCoordinates);
