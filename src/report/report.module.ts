import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportRepository } from '../repositories/reports/report.repository';
import { Report, ReportSchema } from '../repositories/reports/schemas';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PostmarkService } from './postmark.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    CloudinaryModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository, PostmarkService],
})
export class ReportModule {}
