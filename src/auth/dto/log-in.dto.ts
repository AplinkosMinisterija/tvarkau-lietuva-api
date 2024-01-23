import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  accessKey: string;

  constructor(name: string, email: string, accessKey: string) {
    this.name = name;
    this.email = email;
    this.accessKey = accessKey;
  }
}
