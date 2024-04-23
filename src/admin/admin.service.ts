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
  ): Promise<TransferReportDto> {
    const response: AxiosResponse | null =
      await this.sendTransferRequest(transferReportDto);
    if (response == null) {
      //return null;
    }

    // const name = response.data.displayName;
    // const email = response.data.mail;
    // const payload = { email: email };
    // if (name == null || email == null) {
    //   return null;
    // }

    return transferReportDto;
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

  async sendTransferRequest(
    transferReportDto: TransferReportDto,
  ): Promise<AxiosResponse | null> {
    let returnValue: AxiosResponse | null = null;
    const body = {
      'TL pranešimo ID': transferReportDto.refId,
      Turinys: transferReportDto.name,
      Platuma: transferReportDto.latitude,
      Ilguma: transferReportDto.longitude,
      Statusas: transferReportDto.status,
      'Data ir laikas': transferReportDto.reportDate,
      'Vykdytojo e-mail': transferReportDto.email,
    };
    await axios
      .post(
        'https://prod-90.westeurope.logic.azure.com:443/workflows/d31513e4f45c476b8062580dce0713b0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TPbFkxkCTVAAWPBEPefOkg2eJlbvzA1rW6e933CsId8',
        {
          "TL pranešimo ID": "13223",
          "Turinys": "Testinis pranešimas",
          "Platuma": "54.6872",
          "Ilguma": "25.2797",
          "Statusas":"gautas",
          "Data ir laikas":"2024-04-23T10:35:06.246Z",
          "Vykdytojo e-mail":"justas.tacionis@aad.am.lt"
        },
      )
      .then((response) => {
        console.log('ans');
        console.log(response.status);
        console.log(response.data);
        if (response.status == 200) {
          console.log(response.data);
          returnValue = response;
        } else {
          returnValue = null;
        }
      });
    return returnValue;
  }
}
