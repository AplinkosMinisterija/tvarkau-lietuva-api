import { Injectable } from '@nestjs/common';
import { FullReportDto, TransferReportDto } from './dto';
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
import { ReportCategory } from '../common/dto/report-category';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AdminService {
  constructor(
    private readonly dumpRepository: DumpRepository,
    private readonly reportRepository: ReportRepository,
  ) {}

  async getAllReports(
    isDeleted: boolean,
    category?: ReportCategory,
  ): Promise<FullReportDto[]> {
    const reports = await this.reportRepository.getAllReports(
      isDeleted,
      category,
    );
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

  async transferReport(
    transferReportDto: TransferReportDto,
  ): Promise<FullReportDto | null> {
    const response: AxiosResponse | null =
      await this.sendTransferRequest(transferReportDto);
    if (response == null) {
      return null;
    }

    const inspection = response.data[Object.keys(response.data)[0]];
    const inspectionId = response.data[Object.keys(response.data)[1]];

    const report: Report | null =
      await this.reportRepository.updateTransferReport(
        transferReportDto.refId,
        inspection,
        inspectionId,
        transferReportDto.email,
      );
    if (!report) return null;

    return AdminService.docToFullReport(report);
  }

  private static docToFullDump(dump: Dump): FullDumpDto {
    return new FullDumpDto(
      dump._id.toString(),
      dump.name,
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
      report.inspection,
      report.inspectionId,
      report.isVisible,
      report.isDeleted,
      report.isTransferred,
      report.comment,
      report.status,
      report.reportDate,
      report.officerImageUrls,
      report.imageUrls,
      report.historyData.map(AdminService.docToHistoryData),
      report.statusRecords.map(AdminService.docToStatusRecords),
      report.emailFeedbackStage,
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

  private async sendTransferRequest(
    transferReportDto: TransferReportDto,
  ): Promise<AxiosResponse | null> {
    let returnValue = null;
    const data = JSON.stringify({
      'TL pranešimo ID': transferReportDto.refId,
      Turinys: transferReportDto.name,
      Platuma: transferReportDto.latitude.toString(),
      Ilguma: transferReportDto.longitude.toString(),
      Statusas: transferReportDto.status,
      'Data ir laikas': transferReportDto.reportDate.toString(),
      'Vykdytojo e-mail': transferReportDto.email,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env['AADIS_URL'],
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        if (response.status == 200) {
          returnValue = response;
        } else {
          returnValue = null;
        }
      })
      .catch((error) => {
        console.log(error);
        returnValue = null;
      });
    return returnValue;
  }
}
