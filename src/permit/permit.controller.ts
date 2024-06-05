import { Body, Controller, Get, ParseArrayPipe, Post } from '@nestjs/common';
import { PermitService } from './permit.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermitDto } from './dto';

@Controller('permits')
@ApiTags('permits')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @ApiCreatedResponse({
    description: 'New Permits have been successfully created',
    type: [PermitDto],
  })
  @Post('/multiple')
  createMultiplePermits(
    @Body(new ParseArrayPipe({ items: PermitDto }))
    createPermits: PermitDto[],
  ): Promise<PermitDto[]> {
    return this.permitService.createMultiplePermits(createPermits);
  }

  @ApiCreatedResponse({
    description: 'New Permit has been successfully created',
    type: PermitDto,
  })
  @Post()
  createNewPermit(@Body() createPermit: PermitDto): Promise<PermitDto> {
    return this.permitService.createPermit(createPermit);
  }

  @ApiOkResponse({
    description: 'All permits have been successfully found',
    type: [PermitDto],
  })
  @Get()
  getAllPermits(): Promise<PermitDto[]> {
    return this.permitService.getAllPermits();
  }
}
