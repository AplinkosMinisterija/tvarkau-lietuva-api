import { Injectable } from '@nestjs/common';
import { CreateReportDto, PublicReportDto, StatusRecordsDto } from './dto';
import { ReportRepository } from '../repositories/reports/report.repository';
import { Report, StatusRecords } from '../repositories/reports/schemas';
import { ReportStatisticsDto } from './dto/report-statistics.dto';
import { Category } from '../common/constants/enums';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async getAllVisibleReports(
    category: Category | undefined,
  ): Promise<PublicReportDto[]> {
    const reports = await this.reportRepository.getVisibleReports(category);
    return reports.map(ReportService.docToPublicReport);
  }

  async createReport(
    createReport: CreateReportDto,
    images: Array<Express.Multer.File>,
  ): Promise<PublicReportDto> {
    const report = await this.reportRepository.createReport(
      createReport,
      images,
    );
    return ReportService.docToPublicReport(report);
  }

  async getReportById(refId: number): Promise<PublicReportDto | null> {
    const report = await this.reportRepository.getReportById(refId);
    if (!report) return null;
    return ReportService.docToPublicReport(report);
  }

  async getReportStatistics(category?: Category): Promise<ReportStatisticsDto> {
    const stats = await this.reportRepository.getVisibleStatusCounts(category);
    return ReportService.docToReportStatistics(stats);
  }

  private static docToReportStatistics(e: any): ReportStatisticsDto {
    return new ReportStatisticsDto(
      e.filter((stat: { _id: string }) => stat._id == 'gautas')[0].count ?? 0,
      e.filter((stat: { _id: string }) => stat._id == 'tiriamas')[0].count ?? 0,
      e.filter((stat: { _id: string }) => stat._id == 'ištirtas')[0].count ?? 0,
      e.filter((stat: { _id: string }) => stat._id == 'sutvarkyta')[0].count ??
        0,
      e.filter((stat: { _id: string }) => stat._id == 'nepasitvirtino')[0]
        .count ?? 0,
    );
  }

  private static docToPublicReport(e: Report): PublicReportDto {
    return new PublicReportDto(
      e.name,
      e.type as Category,
      e.refId,
      e.reportLong,
      e.reportLat,
      e.comment,
      e.status,
      e.reportDate,
      e.officerImageUrls,
      e.imageUrls,
      e.statusRecords.map(ReportService.statusRecordsToPublicReport),
    );
  }

  private static statusRecordsToPublicReport(
    e: StatusRecords,
  ): StatusRecordsDto {
    return new StatusRecordsDto(e.status, new Date(e.date));
  }
}
