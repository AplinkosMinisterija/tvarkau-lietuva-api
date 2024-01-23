import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatusRecordsDocument = StatusRecords & Document;

@Schema({ versionKey: false })
export class StatusRecords {
  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Date, default: Date.now() })
  date: Date;
}

export const StatusRecordsSchema = SchemaFactory.createForClass(StatusRecords);
