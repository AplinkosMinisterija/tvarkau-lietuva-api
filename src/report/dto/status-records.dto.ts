import { ApiProperty } from '@nestjs/swagger';

export class StatusRecordsDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  date: Date;

  constructor(status: string, date: Date) {
    this.status = status;
    this.date = date;
  }
}
