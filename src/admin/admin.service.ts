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
import { FullReportStatisticsDto } from './dto/full-report-statistics.dto';

import {
  ReportCategoryAnalyticsDto,
  OverallSummaryDto,
  StatusDistributionItemDto,
  CategoryBreakdownItemDto,
  RegionBreakdownItemDto,
  MonthlyTrendItemDto,
  ResolutionPerformanceDto,
  SlaPerformanceDto,
} from './dto/report-category-statistics.dto';
import { coordinateToRegion } from '../common/utils/lithuanian-regions.util';

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

  async getFullReportStatistics(
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<FullReportStatisticsDto> {
    const [result] = await this.reportRepository.getFullStatisticsCounts(
      dateFrom,
      dateTo,
    );
    return AdminService.docToFullReportStatistics(result);
  }

  private static filterStatistics(e: any, status: string): number {
    return e.filter((stat: { _id: string }) => stat._id == status).length > 0
      ? (e.filter((stat: { _id: string }) => stat._id == status)[0].count ?? 0)
      : 0;
  }

  private static docToFullReportStatistics(
    result: any,
  ): FullReportStatisticsDto {
    const facetCount = (facet: any[]) => facet[0]?.count ?? 0;
    return new FullReportStatisticsDto(
      facetCount(result.total),
      AdminService.filterStatistics(result.byStatus, 'gautas'),
      AdminService.filterStatistics(result.byStatus, 'tiriamas'),
      AdminService.filterStatistics(result.byStatus, 'išspręsta'),
      AdminService.filterStatistics(result.byStatus, 'nepasitvirtino'),
      facetCount(result.deleted),
      facetCount(result.notVisible),
      facetCount(result.transferred),
    );
  }

  async getReportCategoryAnalytics(
    dateFrom?: string,
    dateTo?: string,
    category?: ReportCategory,
    status?: string,
  ): Promise<ReportCategoryAnalyticsDto> {
    const from = dateFrom ? new Date(dateFrom) : undefined;
    const to = dateTo ? new Date(dateTo) : undefined;

    const reports = await this.reportRepository.getAnalyticsReports(
      from,
      to,
      category,
      status,
    );

    const allReports =
      from || to || category || status
        ? await this.reportRepository.getAnalyticsReports()
        : reports;

    return buildAnalytics(reports as any, allReports as any, from, to);
  }
}

interface ReportLean {
  name: string;
  type: string;
  refId: string;
  reportLong: number;
  reportLat: number;
  status: string;
  isVisible: boolean;
  isDeleted: boolean;
  reportDate: Date;
  statusRecords: Array<{ status: string; date: Date }>;
  [key: string]: any;
}

const RESOLVED_STATUSES = new Set(['išspręsta', 'nepasitvirtino']);
function hoursBetween(a: Date | undefined, b: Date | undefined): number | null {
  if (!a || !b) return null;
  return (b.getTime() - a.getTime()) / 3_600_000;
}

function resolvedAt(report: ReportLean): Date | null {
  const records = (report.statusRecords ?? []) as Array<{
    status: string;
    date: Date;
  }>;
  const hit = records
    .filter((r) => RESOLVED_STATUSES.has(r.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  return hit ? new Date(hit.date) : null;
}

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 10000) / 100; // 2 decimal places
}

function changePct(current: number, previous: number): number | undefined {
  if (previous === 0) return undefined;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function periodKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export async function buildAnalytics(
  reports: ReportLean[],
  allReports: any, from: Date | undefined, to: Date | undefined): Promise<ReportCategoryAnalyticsDto> {
  const now = new Date();
  const total = reports.length;

  // Resolution times
  const resolutionHoursArr: number[] = [];
  for (const r of reports) {
    const resolvedAtResolution = resolvedAt(r);
    const hoursBetweenResolution = hoursBetween(
      new Date(r.reportDate),
      resolvedAtResolution ?? undefined,
    );
    if (hoursBetweenResolution !== null && hoursBetweenResolution >= 0)
      resolutionHoursArr.push(hoursBetweenResolution);
  }
  resolutionHoursArr.sort((a, b) => a - b);
  const avgResHours = resolutionHoursArr.length
    ? resolutionHoursArr.reduce((s, v) => s + v, 0) / resolutionHoursArr.length
    : 0;
  const medianResHours = median(resolutionHoursArr);
  const minResHours = resolutionHoursArr[0] ?? 0;
  const maxResHours = resolutionHoursArr[resolutionHoursArr.length - 1] ?? 0;

  //SLA groups
  const resolvedReports = reports.filter((r) =>
    RESOLVED_STATUSES.has(r.status),
  );
  let w24 = 0,
    w72 = 0,
    w7d = 0,
    w30d = 0,
    over30 = 0;
  for (const r of resolvedReports) {
    const ra = resolvedAt(r);
    const h = hoursBetween(new Date(r.reportDate), ra ?? undefined);
    if (h === null) {
      over30++;
      continue;
    }
    if (h <= 24) w24++;
    else if (h <= 72) w72++;
    else if (h <= 168) w7d++;
    else if (h <= 720) w30d++;
    else over30++;
  }
  const resolvedCount = resolvedReports.length;

  const sla: SlaPerformanceDto = {
    within24h: w24,
    within72h: w72,
    within7d: w7d,
    within30d: w30d,
    over30d: over30,
    within24hPercent: pct(w24, resolvedCount),
    within72hPercent: pct(w72, resolvedCount),
    within7dPercent: pct(w7d, resolvedCount),
    within30dPercent: pct(w30d, resolvedCount),
  };

  const resolutionPerformance: ResolutionPerformanceDto = {
    avgResolutionHours: Math.round(avgResHours * 100) / 100,
    medianResolutionHours: Math.round(medianResHours * 100) / 100,
    minResolutionHours: Math.round(minResHours * 100) / 100,
    maxResolutionHours: Math.round(maxResHours * 100) / 100,
    sla,
    resolvedCount,
  };

  //Status distribution
  const statusMap = new Map<string, number>();
  for (const r of reports) {
    statusMap.set(r.status, (statusMap.get(r.status) ?? 0) + 1);
  }
  const statusDistribution: StatusDistributionItemDto[] = [
    ...statusMap.entries(),
  ]
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({
      status,
      count,
      percentage: pct(count, total),
    }));

  //Category breakdown
  const catMap = new Map<string, ReportLean[]>();
  for (const r of reports) {
    const list = catMap.get(r.type) ?? [];
    list.push(r);
    catMap.set(r.type, list);
  }
  const categoryBreakdown: CategoryBreakdownItemDto[] = [...catMap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category, reps]) => {
      const hrs: number[] = [];
      for (const r of reps) {
        const ra = resolvedAt(r);
        const h = hoursBetween(new Date(r.reportDate), ra ?? undefined);
        if (h !== null && h >= 0) hrs.push(h);
      }
      const avg = hrs.length ? hrs.reduce((s, v) => s + v, 0) / hrs.length : 0;
      return {
        category,
        count: reps.length,
        percentage: pct(reps.length, total),
        avgResolutionHours: Math.round(avg * 100) / 100,
      };
    });

  //Geographic breakdown
  const regionMap = new Map<string, ReportLean[]>();
  for (const r of reports) {
    const region = coordinateToRegion(r.reportLong, r.reportLat);
    const list = regionMap.get(region) ?? [];
    list.push(r);
    regionMap.set(region, list);
  }
  const geographicBreakdown: RegionBreakdownItemDto[] = [...regionMap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([region, reps]) => {
      const hrs: number[] = [];
      for (const r of reps) {
        const ra = resolvedAt(r);
        const h = hoursBetween(new Date(r.reportDate), ra ?? undefined);
        if (h !== null && h >= 0) hrs.push(h);
      }
      const avg = hrs.length ? hrs.reduce((s, v) => s + v, 0) / hrs.length : 0;

      const regStatusMap = new Map<string, number>();
      for (const r of reps)
        regStatusMap.set(r.status, (regStatusMap.get(r.status) ?? 0) + 1);
      const statusDistribution: StatusDistributionItemDto[] = [
        ...regStatusMap.entries(),
      ].map(([status, count]) => ({
        status,
        count,
        percentage: pct(count, reps.length),
      }));

      return {
        region,
        count: reps.length,
        percentage: pct(reps.length, total),
        avgResolutionHours: Math.round(avg * 100) / 100,
        statusDistribution,
      };
    });

  // Monthly trends
  const monthMap = new Map<string, ReportLean[]>();
  for (const r of reports) {
    const key = periodKey(new Date(r.reportDate));
    const list = monthMap.get(key) ?? [];
    list.push(r);
    monthMap.set(key, list);
  }
  const sortedKeys = [...monthMap.keys()].sort();
  const monthlyTrends: MonthlyTrendItemDto[] = sortedKeys.map((key, idx) => {
    const reps = monthMap.get(key)!;
    const [yr, mo] = key.split('-').map(Number);
    const resolved = reps.filter((r) => RESOLVED_STATUSES.has(r.status)).length;
    const hrs: number[] = [];
    for (const r of reps) {
      const ra = resolvedAt(r);
      const h = hoursBetween(new Date(r.reportDate), ra ?? undefined);
      if (h !== null && h >= 0) hrs.push(h);
    }
    const avgRes = hrs.length ? hrs.reduce((s, v) => s + v, 0) / hrs.length : 0;

    // Compare to prior month
    let countChange: number | undefined;
    let resolvedChange: number | undefined;
    let resTimeChange: number | undefined;
    if (idx > 0) {
      const prevKey = sortedKeys[idx - 1];
      const prevReps = monthMap.get(prevKey)!;
      const prevResolved = prevReps.filter((r) =>
        RESOLVED_STATUSES.has(r.status),
      ).length;
      const prevHrs: number[] = [];
      for (const r of prevReps) {
        const ra = resolvedAt(r);
        const h = hoursBetween(new Date(r.reportDate), ra ?? undefined);
        if (h !== null && h >= 0) prevHrs.push(h);
      }
      const prevAvgRes = prevHrs.length
        ? prevHrs.reduce((s, v) => s + v, 0) / prevHrs.length
        : 0;
      countChange = changePct(reps.length, prevReps.length);
      resolvedChange = changePct(resolved, prevResolved);
      resTimeChange = changePct(avgRes, prevAvgRes);
    }

    return {
      period: key,
      year: yr,
      month: mo,
      count: reps.length,
      resolved,
      avgResolutionHours: Math.round(avgRes * 100) / 100,
      countChangePercent:
        countChange !== undefined
          ? Math.round(countChange * 100) / 100
          : undefined,
      resolvedChangePercent:
        resolvedChange !== undefined
          ? Math.round(resolvedChange * 100) / 100
          : undefined,
      resolutionTimeChangePercent:
        resTimeChange !== undefined
          ? Math.round(resTimeChange * 100) / 100
          : undefined,
    };
  });

  // Overall summary
  const msNow = now.getTime();
  const ms7d = msNow - 7 * 86_400_000;
  const ms30d = msNow - 30 * 86_400_000;
  const ms60d = msNow - 60 * 86_400_000;
  const ms90d = msNow - 90 * 86_400_000;

  const last7 = reports.filter(
    (r) => new Date(r.reportDate).getTime() >= ms7d,
  ).length;
  const last30 = reports.filter(
    (r) => new Date(r.reportDate).getTime() >= ms30d,
  ).length;
  const last90 = reports.filter(
    (r) => new Date(r.reportDate).getTime() >= ms90d,
  ).length;
  const prior30 = reports.filter((r) => {
    const t = new Date(r.reportDate).getTime();
    return t >= ms60d && t < ms30d;
  }).length;

  const inInvestigation = reports.filter((r) => r.status === 'tiriamas').length;
  const received = reports.filter((r) => r.status === 'gautas').length;
  const falseR = reports.filter((r) => r.status === 'nepasitvirtino').length;

  const summary: OverallSummaryDto = {
    totalReports: total,
    resolvedReports: resolvedCount,
    inInvestigationReports: inInvestigation,
    receivedReports: received,
    falseReports: falseR,
    resolutionRate: pct(resolvedCount, total),
    avgResolutionHours: Math.round(avgResHours * 100) / 100,
    reportsPer30Days:
      Math.round((total / Math.max(1, monthlyTrends.length)) * 100) / 100,
    reportsLast7Days: last7,
    reportsLast30Days: last30,
    reportsLast90Days: last90,
    last30DaysChangePercent: changePct(last30, prior30),
  };

  return {
    summary,
    statusDistribution,
    categoryBreakdown,
    geographicBreakdown,
    monthlyTrends,
    resolutionPerformance,
    generatedAt: now.toISOString(),
  };
}
