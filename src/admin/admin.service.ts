import { Injectable } from '@nestjs/common';
import { FullReportDto } from './dto';
import { DumpRepository } from '../repositories/dumps/dump.repository';
import { ReportRepository } from '../repositories/reports/report.repository';
import { CreateDumpDto, FullDumpDto, UpdateDumpDto } from './dto';
import {
  EditsData,
  HistoryDataData,
  Report,
  StatusRecords,
} from '../repositories/reports/schemas';
import { HistoryDataDto } from './dto/history-data.dto';
import { HistoryEditsDto } from './dto/history-edits.dto';
import { StatusRecordsDto } from '../report/dto';
import { UpdateReportDto } from './dto';
import { Dump } from '../repositories/dumps/schemas';
import { ReportCategory } from '../common/constants/enums';

@Injectable()
export class AdminService {
  constructor(
    private readonly dumpRepository: DumpRepository,
    private readonly reportRepository: ReportRepository,
  ) {}

  async getAllReports(category?: ReportCategory): Promise<FullReportDto[]> {
    const reports = await this.reportRepository.getAllReports(category);
    return reports.map(AdminService.docToFullReport);
  }

  async getReportById(refId: number): Promise<FullReportDto | null> {
    const report = await this.reportRepository.getReportById(refId);
    if (!report) return null;
    return AdminService.docToFullReport(report);
  }

  async getDumpById(refId: string): Promise<FullDumpDto | null> {
    const dump = await this.dumpRepository.getDumpById(refId);
    if (!dump) return null;
    return AdminService.docToFullDump(dump);
  }

  async getAllDeletedReports(
    category?: ReportCategory,
  ): Promise<FullReportDto[]> {
    const reports = await this.reportRepository.getDeletedReports(category);
    return reports.map(AdminService.docToFullReport);
  }

  async updateReport(
    updateReport: UpdateReportDto,
    images: Array<Express.Multer.File>,
    editorEmail: string,
  ): Promise<FullReportDto | null> {
    const report: Report | null = await this.reportRepository.updateReport(
      updateReport,
      images,
      editorEmail,
    );
    if (!report) return null;
    return AdminService.docToFullReport(report);
  }

  async getAllDumps(): Promise<FullDumpDto[]> {
    const dumps = await this.dumpRepository.getAllDumps();
    return dumps.map(AdminService.docToFullDump);
  }

  async updateDump(updateDump: UpdateDumpDto): Promise<FullDumpDto | null> {
    const dump: Dump | null = await this.dumpRepository.updateDump(updateDump);
    if (!dump) return null;
    return AdminService.docToFullDump(dump);
  }

  async createDump(createDump: CreateDumpDto): Promise<FullDumpDto> {
    const dump = await this.dumpRepository.createDump(createDump);
    return AdminService.docToFullDump(dump);
  }

  private static docToFullDump(dump: Dump): FullDumpDto {
    return new FullDumpDto(
      dump._id.toString(),
      dump.name,
      dump.type,
      dump.reportLong,
      dump.reportLat,
      dump.isVisible,
      dump.address,
      dump.phone,
      dump.workingHours,
      dump.moreInformation,
    );
  }

  private static docToFullReport(report: Report): FullReportDto {
    return new FullReportDto(
      report.refId,
      report.name,
      AdminService.parseReportCategory(report.type),
      report.refId,
      report.reportLong,
      report.reportLat,
      report.email,
      report.isVisible,
      report.isDeleted,
      report.comment,
      report.status,
      report.reportDate,
      report.officerImageUrls,
      report.imageUrls,
      report.historyData.map(AdminService.docToHistoryData),
      report.statusRecords.map(AdminService.docToStatusRecords),
    );
  }

  private static docToHistoryData(
    historyData: HistoryDataData,
  ): HistoryDataDto {
    return new HistoryDataDto(
      historyData.user,
      historyData.date,
      historyData.edits.map(AdminService.docToHistoryEdits),
    );
  }

  private static docToHistoryEdits(edits: EditsData): HistoryEditsDto {
    return new HistoryEditsDto(edits.field, edits.change);
  }

  private static docToStatusRecords(records: StatusRecords): StatusRecordsDto {
    return new StatusRecordsDto(records.status, new Date(records.date));
  }

  private static parseReportCategory(value: string): ReportCategory {
    if (Object.values(ReportCategory).includes(value as ReportCategory)) {
      return value as ReportCategory;
    } else {
      throw new Error(`Invalid report category: ${value}`);
    }
  }
}
