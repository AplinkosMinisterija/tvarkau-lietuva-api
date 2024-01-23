import { ApiProperty } from '@nestjs/swagger';

export class ReportStatisticsDto {
  @ApiProperty({ type: 'integer' })
  totalSentReports: number;
  @ApiProperty({ type: 'integer' })
  totalInInvestigationReports: number;
  @ApiProperty({ type: 'integer' })
  totalInvestigatedReports: number;
  @ApiProperty({ type: 'integer' })
  totalCleanedReports: number;
  @ApiProperty({ type: 'integer' })
  totalFalseReports: number;

  constructor(
    totalSentReports: number,
    totalInInvestigationReports: number,
    totalInvestigatedReports: number,
    totalCleanedReports: number,
    totalFalseReports: number,
  ) {
    this.totalSentReports = totalSentReports;
    this.totalInInvestigationReports = totalInInvestigationReports;
    this.totalInvestigatedReports = totalInvestigatedReports;
    this.totalCleanedReports = totalCleanedReports;
    this.totalFalseReports = totalFalseReports;
  }
}
