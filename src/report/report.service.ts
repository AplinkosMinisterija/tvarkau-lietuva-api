import { Injectable } from '@nestjs/common';
import { CreateReportDto, PublicReportDto, StatusRecordsDto } from './dto';
import { ReportRepository } from '../repositories/reports/report.repository';
import { Report, StatusRecords } from '../repositories/reports/schemas';
import { ReportStatisticsDto } from './dto/report-statistics.dto';
import { ReportCategory } from '../common/dto/report-category';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async getAllVisibleReports(
    category?: ReportCategory,
  ): Promise<PublicReportDto[]> {
    const reports = await this.reportRepository.getVisibleReports(category);
    return reports.map(ReportService.docToPublicReport);
  }

  async getParameter(
    category?: ReportCategory,
  ): Promise<PublicReportDto[]> {
    const reports = await this.reportRepository.getParameter(category);
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

  async getReportStatistics(
    category?: ReportCategory,
  ): Promise<ReportStatisticsDto> {
    const stats = await this.reportRepository.getVisibleStatusCounts(category);
    return ReportService.docToReportStatistics(stats);
  }

  private static docToReportStatistics(e: any): ReportStatisticsDto {
    return new ReportStatisticsDto(
      ReportService.filterStatistics(e, 'gautas'),
      ReportService.filterStatistics(e, 'tiriamas'),
      ReportService.filterStatistics(e, 'išspręsta'),
      ReportService.filterStatistics(e, 'nepasitvirtino'),
    );
  }

  private static filterStatistics(e: any, status: string): number {
    return e.filter((stat: { _id: string }) => stat._id == status).length > 0
      ? e.filter((stat: { _id: string }) => stat._id == status)[0].count ?? 0
      : 0;
  }

  private static docToPublicReport(e: Report): PublicReportDto {
    return new PublicReportDto(
      e.name,
      ReportService.parseReportCategory(e.type),
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

  private static parseReportCategory(value: string): ReportCategory {
    if (Object.values(ReportCategory).includes(value as ReportCategory)) {
      return value as ReportCategory;
    } else {
      throw new Error(`Invalid report category: ${value}`);
    }
  }
}
