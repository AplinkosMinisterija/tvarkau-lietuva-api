import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatusDistributionItemDto {
  @ApiProperty() status: string;
  @ApiProperty() count: number;
  @ApiProperty() percentage: number;
}

export class CategoryBreakdownItemDto {
  @ApiProperty() category: string;
  @ApiProperty() count: number;
  @ApiProperty() percentage: number;
  @ApiProperty() avgResolutionHours: number;
}

export class RegionBreakdownItemDto {
  @ApiProperty() region: string;
  @ApiProperty() count: number;
  @ApiProperty() percentage: number;
  @ApiProperty() avgResolutionHours: number;
  @ApiProperty({ type: [StatusDistributionItemDto] })
  statusDistribution: StatusDistributionItemDto[];
}

export class MonthlyTrendItemDto {
  @ApiProperty() period: string;
  @ApiProperty() year: number;
  @ApiProperty() month: number;
  @ApiProperty() count: number;
  @ApiProperty() resolved: number;
  @ApiProperty() avgResolutionHours: number;
  @ApiPropertyOptional() countChangePercent?: number;
  @ApiPropertyOptional() resolvedChangePercent?: number;
  @ApiPropertyOptional() resolutionTimeChangePercent?: number;
}

export class SlaPerformanceDto {
  @ApiProperty({ description: 'Reports resolved within 24 h' })
  within24h: number;
  @ApiProperty({ description: 'Reports resolved within 72 h' })
  within72h: number;
  @ApiProperty({ description: 'Reports resolved within 7 days' })
  within7d: number;
  @ApiProperty({ description: 'Reports resolved within 30 days' })
  within30d: number;
  @ApiProperty({ description: 'Reports not yet resolved or over 30 days' })
  over30d: number;
  @ApiProperty() within24hPercent: number;
  @ApiProperty() within72hPercent: number;
  @ApiProperty() within7dPercent: number;
  @ApiProperty() within30dPercent: number;
}

export class ResolutionPerformanceDto {
  @ApiProperty() avgResolutionHours: number;
  @ApiProperty() medianResolutionHours: number;
  @ApiProperty() minResolutionHours: number;
  @ApiProperty() maxResolutionHours: number;
  @ApiProperty({ type: SlaPerformanceDto }) sla: SlaPerformanceDto;
  @ApiProperty({ description: 'Resolved report count used for calculation' })
  resolvedCount: number;
}

export class OverallSummaryDto {
  @ApiProperty() totalReports: number;
  @ApiProperty() resolvedReports: number;
  @ApiProperty() inInvestigationReports: number;
  @ApiProperty() receivedReports: number;
  @ApiProperty() falseReports: number;
  @ApiProperty() resolutionRate: number;
  @ApiProperty() avgResolutionHours: number;
  @ApiProperty() reportsPer30Days: number;
  @ApiProperty() reportsLast7Days: number;
  @ApiProperty() reportsLast30Days: number;
  @ApiProperty() reportsLast90Days: number;
  @ApiPropertyOptional() last30DaysChangePercent?: number;
}

export class ReportCategoryAnalyticsDto {
  @ApiProperty({ type: OverallSummaryDto })
  summary: OverallSummaryDto;

  @ApiProperty({ type: [StatusDistributionItemDto] })
  statusDistribution: StatusDistributionItemDto[];

  @ApiProperty({ type: [CategoryBreakdownItemDto] })
  categoryBreakdown: CategoryBreakdownItemDto[];

  @ApiProperty({ type: [RegionBreakdownItemDto] })
  geographicBreakdown: RegionBreakdownItemDto[];

  @ApiProperty({ type: [MonthlyTrendItemDto] })
  monthlyTrends: MonthlyTrendItemDto[];

  @ApiProperty({ type: ResolutionPerformanceDto })
  resolutionPerformance: ResolutionPerformanceDto;

  @ApiProperty({ description: 'ISO timestamp of when analytics were computed' })
  generatedAt: string;
}
