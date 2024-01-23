import { ApiProperty } from '@nestjs/swagger';
import { HistoryDataDto } from './history-data.dto';
import { StatusRecordsDto } from './status-records.dto';
import { ToBoolean } from '../../common/transform/boolean.transform';

export class FullReportDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  refId: string;

  @ApiProperty({ format: 'double' })
  longitude: number;

  @ApiProperty({ format: 'double' })
  latitude: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @ToBoolean()
  isVisible: boolean;

  @ApiProperty()
  @ToBoolean()
  isDeleted: boolean;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reportDate: Date;

  @ApiProperty()
  officerImageUrls: string[];

  @ApiProperty()
  imageUrls: string[];

  @ApiProperty({ type: [HistoryDataDto] })
  historyData: HistoryDataDto[];

  @ApiProperty({ type: [StatusRecordsDto] })
  statusRecords: StatusRecordsDto[];

  constructor(
    _id: string,
    name: string,
    type: string,
    refId: string,
    longitude: number,
    latitude: number,
    email: string,
    isVisible: boolean,
    isDeleted: boolean,
    comment: string,
    status: string,
    reportDate: Date,
    officerImageUrls: string[],
    imageUrls: string[],
    historyData: HistoryDataDto[],
    statusRecords: StatusRecordsDto[],
  ) {
    this._id = _id;
    this.name = name;
    this.type = type;
    this.refId = refId;
    this.longitude = longitude;
    this.latitude = latitude;
    this.email = email;
    this.isVisible = isVisible;
    this.isDeleted = isDeleted;
    this.comment = comment;
    this.status = status;
    this.reportDate = reportDate;
    this.officerImageUrls = officerImageUrls;
    this.imageUrls = imageUrls;
    this.historyData = historyData;
    this.statusRecords = statusRecords;
  }
}
