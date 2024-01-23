import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck(): string {
    return 'Tvarkau Lietuvą API is running';
  }
}
