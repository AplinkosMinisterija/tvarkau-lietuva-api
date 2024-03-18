import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller()
@ApiExcludeController()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get('/healthcheck')
  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([async () => this.mongoose.pingCheck('mongoose')]);
  }
}
