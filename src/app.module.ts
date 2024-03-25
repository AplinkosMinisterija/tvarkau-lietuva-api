import { HttpException, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DumpModule } from './dumps/dump.module';
import { ReportModule } from './report/report.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from './common/common.module';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SentryModule.forRoot({
      dsn: process.env['SENTRY_DSN'],
      enabled: 'SENTRY_DSN' in process.env,
      environment: process.env['NODE_ENV'],
      tracesSampleRate: 1.0,
    }),
    AdminModule,
    DumpModule,
    ReportModule,
    MongooseModule.forRoot(process.env['DATABASE_URL']!),
    AuthModule,
    CloudinaryModule,
    CommonModule,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) =>
                400 >= exception.getStatus(),
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
