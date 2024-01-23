import { ApiProperty } from '@nestjs/swagger';

export class HistoryEditsDto {
  @ApiProperty()
  field: string;

  @ApiProperty()
  change: string;

  constructor(field: string, change: string) {
    this.field = field;
    this.change = change;
  }
}
