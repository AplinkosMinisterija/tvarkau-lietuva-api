import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';

import { EditsData, EditsSchema } from './edits.schema';

export type HistoryDataDocument = HistoryDataData & Document;

@Schema({ versionKey: false })
export class HistoryDataData {
  @Prop({ type: String, required: true })
  user: string;

  @Prop({ type: Date, default: Date.now() })
  date: Date;

  @Prop({
    type: [
      {
        type: EditsSchema,
      },
    ],
  })
  @Type(() => EditsData)
  edits: EditsData[];
}

export const HistoryDataSchema = SchemaFactory.createForClass(HistoryDataData);
