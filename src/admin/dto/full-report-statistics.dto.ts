import { ApiProperty } from '@nestjs/swagger';

export class FullReportStatisticsDto {
  @ApiProperty({ type: 'integer' })
  totalReceivedReports: number;
  @ApiProperty({ type: 'integer' })
  totalSentReports: number;
  @ApiProperty({ type: 'integer' })
  totalInInvestigationReports: number;
  @ApiProperty({ type: 'integer' })
  totalInvestigatedReports: number;
  @ApiProperty({ type: 'integer' })
  totalFalseReports: number;
  @ApiProperty({ type: 'integer' })
  totalDeletedReports: number;
  @ApiProperty({ type: 'integer' })
  totalNotVisibleReports: number;
  @ApiProperty({ type: 'integer' })
  totalTransferredReports: number;

  constructor(
    totalReceivedReports: number,
    totalSentReports: number,
    totalInInvestigationReports: number,
    totalInvestigatedReports: number,
    totalFalseReports: number,
    totalDeletedReports: number,
    totalNotVisibleReports: number,
    totalTransferredReports: number,
  ) {
    this.totalReceivedReports = totalReceivedReports;
    this.totalSentReports = totalSentReports;
    this.totalInInvestigationReports = totalInInvestigationReports;
    this.totalInvestigatedReports = totalInvestigatedReports;
    this.totalFalseReports = totalFalseReports;
    this.totalDeletedReports = totalDeletedReports;
    this.totalNotVisibleReports = totalNotVisibleReports;
    this.totalTransferredReports = totalTransferredReports;
  }
}
