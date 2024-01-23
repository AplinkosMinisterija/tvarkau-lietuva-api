import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type DumpDocument = Dump & Document;

@Schema({ versionKey: false })
export class Dump {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true, default: 'dump' })
  type: string;

  @Prop({ type: Number, required: true })
  reportLong: number;

  @Prop({ type: Number, required: true })
  reportLat: number;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Boolean, required: true, default: false })
  isVisible: boolean;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  workingHours: string;

  @Prop({ type: String, required: true })
  moreInformation: string;

  @Prop({ type: Date, required: true, default: Date.now() })
  reportDate: Date;
}

export const DumpSchema = SchemaFactory.createForClass(Dump);
