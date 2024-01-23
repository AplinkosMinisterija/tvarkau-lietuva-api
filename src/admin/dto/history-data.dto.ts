import { ApiProperty } from '@nestjs/swagger';
import { HistoryEditsDto } from './history-edits.dto';

export class HistoryDataDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ type: [HistoryEditsDto] })
  edits: HistoryEditsDto[];

  constructor(user: string, date: Date, edits: HistoryEditsDto[]) {
    this.user = user;
    this.date = date;
    this.edits = edits;
  }
}
