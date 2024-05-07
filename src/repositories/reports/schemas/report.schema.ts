import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { HistoryDataData, HistoryDataSchema } from './history-data.schema';
import { StatusRecords, StatusRecordsSchema } from './status-records.schema';

export type ReportDocument = Report & Document;

@Schema({ versionKey: false })
export class Report {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  refId: string;

  @Prop({ type: Number, required: true })
  reportLong: number;

  @Prop({ type: Number, required: true })
  reportLat: number;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: false })
  inspection: string;

  @Prop({ type: String, required: false })
  inspectionId: string;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Boolean, required: true, default: false })
  isVisible: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  isTransferred: boolean;

  @Prop({ type: Date, required: true, default: Date.now() })
  reportDate: Date;

  @Prop({ type: Array<string>, default: [] })
  officerImageUrls: string[];

  @Prop({ type: Array<string>, default: [] })
  imageUrls: string[];

  @Prop({
    type: [
      {
        type: HistoryDataSchema,
      },
    ],
  })
  @Type(() => HistoryDataData)
  historyData: HistoryDataData[];

  @Prop({
    type: [
      {
        type: StatusRecordsSchema,
      },
    ],
  })
  @Type(() => StatusRecords)
  statusRecords: StatusRecords[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
