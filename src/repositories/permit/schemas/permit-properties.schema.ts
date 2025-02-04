import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermitPropertiesDocument = PermitProperties & Document;

@Schema({ versionKey: false, _id: false })
export class PermitProperties {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  issuedFrom: string;

  @Prop({ type: String, required: true })
  issuedTo: string;

  @Prop({ type: String, required: true })
  cadastralNumber: string;

  @Prop({ type: String, required: false, default: null })
  subdivision: string;

  @Prop({ type: String, required: false, default: null })
  forestryDistrict: string;

  @Prop({ type: Number, required: false, default: null })
  block: number;

  @Prop({ type: String, required: false, default: null })
  plot: string;

  @Prop({ type: Number, required: false, default: null })
  cuttableArea: number;

  @Prop({ type: String, required: false, default: null })
  dominantTree: string;

  @Prop({ type: String, required: false, default: null })
  cuttingType: string;

  @Prop({ type: String, required: false, default: null })
  reinstatementType: string;
}

export const PermitPropertiesSchema =
  SchemaFactory.createForClass(PermitProperties);
