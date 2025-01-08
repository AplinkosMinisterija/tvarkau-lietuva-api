import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from '../repositories/reports/schemas';
import { Dump, DumpSchema } from '../repositories/dumps/schemas';
import { ReportRepository } from '../repositories/reports/report.repository';
import { DumpRepository } from '../repositories/dumps/dump.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PostmarkService } from 'src/report/postmark.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([{ name: Dump.name, schema: DumpSchema }]),
    CloudinaryModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, ReportRepository, DumpRepository, PostmarkService],
})
export class AdminModule {}
