import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReportService } from './report.service';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicReportDto } from './dto';
import { CreateReportDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReportStatisticsDto } from './dto/report-statistics.dto';

@Controller('reports')
@ApiTags('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiCreatedResponse({
    description: 'New Report has been successfully created',
    type: PublicReportDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 4))
  @Post()
  createNewReport(
    @Body() createReportDto: CreateReportDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.reportService.createReport(createReportDto, images);
  }

  @ApiOkResponse({
    description: 'All visible reports have been successfully found',
    type: [PublicReportDto],
  })
  @Get()
  getAllPublicReports(): Promise<PublicReportDto[]> {
    return this.reportService.getAllVisibleReports();
  }

  @ApiOkResponse({
    description: 'Report statistics have been successfully fetched',
    type: ReportStatisticsDto,
  })
  @Get('/statistics')
  getReportStatistics(): Promise<ReportStatisticsDto> {
    return this.reportService.getReportStatistics();
  }

  @Get('/:refId')
  @ApiOkResponse({
    description: 'Report has been successfully found',
    type: PublicReportDto,
  })
  @ApiNotFoundResponse({
    description: 'Report not found',
  })
  async getReportById(
    @Param('refId', ParseIntPipe) refId: number,
  ): Promise<PublicReportDto> {
    const report = await this.reportService.getReportById(refId);
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }
}