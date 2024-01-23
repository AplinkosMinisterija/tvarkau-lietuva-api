import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty()
  accessKey: string;

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }
}
