import { Controller, Get } from '@nestjs/common';
import { DumpService } from './dump.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DumpDto } from './dto';

@Controller('dumps')
@ApiTags('dumps')
export class DumpController {
  constructor(private readonly dumpService: DumpService) {}

  @ApiOkResponse({
    description: 'All visible dumps have been successfully found',
    type: [DumpDto],
  })
  @Get()
  getAllVisibleDumps() {
    return this.dumpService.getAllVisibleDumps();
  }
}
