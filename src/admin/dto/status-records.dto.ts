import { ApiProperty } from '@nestjs/swagger';

export class StatusRecordsDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  date: Date;
}
