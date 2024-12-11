import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { ReportService } from "./report.service";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { PublicReportDto } from "./dto";
import { CreateReportDto } from "./dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ReportStatisticsDto } from "./dto/report-statistics.dto";
import { ReportCategory } from "../common/dto/report-category";
import { PostmarkService } from "./postmark.service";
import { MessageSendingResponse } from "postmark/dist/client/models";
import { CreateFeedbackReportDto } from "./dto/create-feedback-report.dto";

@Controller("reports")
@ApiTags("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService, private readonly postmarkService: PostmarkService) {
  }

  @ApiCreatedResponse({
    description: "New Report has been successfully created",
    type: PublicReportDto
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("images", 4))
  @Post()
  createNewReport(
    @Body() createReportDto: CreateReportDto,
    @UploadedFiles() images: Array<Express.Multer.File>
  ) {
    return this.reportService.createReport(createReportDto, images);
  }

  @ApiOkResponse({
    description: "All visible reports have been successfully found",
    type: [PublicReportDto]
  })
  @ApiQuery({ name: "category", enum: ReportCategory, required: false })
  @Get()
  getAllPublicReports(
    @Query("category", new ParseEnumPipe(ReportCategory, { optional: true }))
    category?: ReportCategory
  ): Promise<PublicReportDto[]> {
    return this.reportService.getAllVisibleReports(category);
  }

  @ApiOkResponse({
    description: "All visible reports have been successfully found",
    type: [PublicReportDto]
  })
  @ApiQuery({ name: "category", enum: ReportCategory, required: false })
  @Get("/parameter")
  getChangeParameter(
    @Query("category", new ParseEnumPipe(ReportCategory, { optional: true }))
    category?: ReportCategory
  ): Promise<PublicReportDto[]> {
    return this.reportService.getParameter(category);
  }

  @ApiOkResponse({
    description: "All visible reports have been successfully found",
    type: [PublicReportDto]
  })
  @ApiQuery({ name: "category", enum: ReportCategory, required: false })
  @Get("/invalid")
  getInvalid(
    @Query("category", new ParseEnumPipe(ReportCategory, { optional: true }))
    category?: ReportCategory
  ): Promise<PublicReportDto[]> {
    return this.reportService.getInvalid(category);
  }

  @ApiOkResponse({
    description: "Report statistics have been successfully fetched",
    type: ReportStatisticsDto
  })
  @ApiQuery({ name: "category", enum: ReportCategory, required: false })
  @Get("/statistics")
  getReportStatistics(
    @Query("category", new ParseEnumPipe(ReportCategory, { optional: true }))
    category?: ReportCategory
  ): Promise<ReportStatisticsDto> {
    return this.reportService.getReportStatistics(category);
  }

  @Get("/:refId")
  @ApiOkResponse({
    description: "Report has been successfully found",
    type: PublicReportDto
  })
  @ApiNotFoundResponse({
    description: "Report not found"
  })
  async getReportById(
    @Param("refId", ParseIntPipe) refId: number
  ): Promise<PublicReportDto> {
    const report = await this.reportService.getReportById(refId);
    if (!report) throw new NotFoundException("Report not found");
    return report;
  }

  @ApiOkResponse({
    description: "New feedback report has been successfully found",
    type: String
  })
  @Post("/feedback-report")
  sendFeedbackReport(
    @Body() createFeedbackReportDto: CreateFeedbackReportDto
  ): Promise<String> {
    return this.postmarkService.sendUserFeedback(createFeedbackReportDto.email,
      createFeedbackReportDto.description
    );
  }
}
