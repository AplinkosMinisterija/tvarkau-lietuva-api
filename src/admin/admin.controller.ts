import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDumpDto,
  FullDumpDto,
  FullReportDto,
  TransferReportDto,
  UpdateDumpDto,
  UpdateReportDto,
} from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { ReportCategory } from '../common/dto/report-category';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOkResponse({
    description: 'All reports have been successfully found',
    type: [FullReportDto],
  })
  @ApiQuery({ name: 'category', enum: ReportCategory, required: false })
  @Get('/reports')
  async getAllReports(
    @Query('isDeleted', ParseBoolPipe) isDeleted: boolean,
    @Query('category', new ParseEnumPipe(ReportCategory, { optional: true }))
    category?: ReportCategory,
  ): Promise<FullReportDto[]> {
    return this.adminService.getAllReports(isDeleted, category);
  }

  @ApiOkResponse({
    description: 'Single full report has been successfully found',
    type: FullReportDto,
  })
  @ApiNotFoundResponse({
    description: 'Report not found',
  })
  @Get('/reports/:refId')
  async getReportById(
    @Param('refId', ParseIntPipe) refId: number,
  ): Promise<FullReportDto> {
    const report = await this.adminService.getReportById(refId);
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  @ApiOkResponse({
    description: 'Single full dump has been successfully found',
    type: FullDumpDto,
  })
  @ApiNotFoundResponse({
    description: 'Dump not found',
  })
  @Get('/dumps/:refId')
  async getDumpById(@Param('refId') refId: string): Promise<FullDumpDto> {
    const dump = await this.adminService.getDumpById(refId);
    if (!dump) throw new NotFoundException('Dump not found');
    return dump;
  }

  @ApiOkResponse({
    description: 'Report has been successfully updated',
    type: FullReportDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 4))
  @Post('/reports')
  async updateReport(
    @Req() req: Request,
    @Body() updateReportDto: UpdateReportDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<FullReportDto | null> {
    // Use strong type for user in the future
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const editorEmail = req.user.email;

    const report: FullReportDto | null = await this.adminService.updateReport(
      updateReportDto,
      images,
      editorEmail,
    );
    if (!report) throw new NotFoundException('Report updating failed');
    return report;
  }

  @ApiOkResponse({
    description: 'Report has been successfully transferred',
    type: TransferReportDto,
  })
  @Post('/reports/transfer')
  async transferReport(
    @Body() transferReportDto: TransferReportDto,
  ): Promise<FullReportDto> {
    const transferReport =
      await this.adminService.transferReport(transferReportDto);
    if (!transferReport)
      throw new InternalServerErrorException('Report transfer unsuccessful');
    return transferReport;
  }

  @ApiOkResponse({
    description: 'All dumps have been successfully found',
    type: [FullDumpDto],
  })
  @Get('/dumps')
  async getAllDumps(): Promise<FullDumpDto[]> {
    return await this.adminService.getAllDumps();
  }

  @ApiOkResponse({
    description: 'Dump has been successfully updated',
    type: FullDumpDto,
  })
  @Post('/dumps')
  async updateDump(
    @Body() updateDumpDto: UpdateDumpDto,
  ): Promise<FullDumpDto | null> {
    const dump: FullDumpDto | null =
      await this.adminService.updateDump(updateDumpDto);
    if (!dump) throw new NotFoundException('Dump updating failed');
    return dump;
  }

  @ApiOkResponse({
    description: 'Dump has been successfully created',
    type: FullDumpDto,
  })
  @Put('/dumps')
  async createDump(@Body() createDumpDto: CreateDumpDto): Promise<FullDumpDto> {
    return await this.adminService.createDump(createDumpDto);
  }
}
