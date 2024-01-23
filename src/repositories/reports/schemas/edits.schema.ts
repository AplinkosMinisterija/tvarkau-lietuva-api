import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EditsDocument = EditsData & Document;

@Schema({ versionKey: false })
export class EditsData {
  @Prop({ type: String, required: true })
  field: string;

  @Prop({ type: String, required: true })
  change: string;
}

export const EditsSchema = SchemaFactory.createForClass(EditsData);
