import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
  providers: [],
})
export class AppModule {}
