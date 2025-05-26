import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schemas';
import { CreateReportDto } from '../../report/dto';
import { UpdateReportDto } from '../../admin/dto';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { BadRequestException } from '@nestjs/common';
import { HistoryDataDto } from '../../admin/dto/history-data.dto';
import { HistoryEditsDto } from '../../admin/dto/history-edits.dto';
import { ReportCategory } from '../../common/dto/report-category';
import { PostmarkService } from 'src/report/postmark.service';

export class ReportRepository {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    private cloudinary: CloudinaryService,
    private readonly postmarkService: PostmarkService,
  ) {}

  getVisibleReports(category?: ReportCategory): Promise<Report[]> {
    const query: any = { isVisible: true, isDeleted: false };

    if (category) {
      query.type = { $eq: category };
    }

    return this.reportModel.find(query).sort({ reportDate: -1 }).exec();
  }

  getAllReports(
    isDeleted: boolean,
    category?: ReportCategory,
  ): Promise<Report[]> {
    const query: any = { isDeleted: isDeleted };

    if (category) {
      query.type = { $eq: category };
    }

    return this.reportModel.find(query).sort({ reportDate: -1 }).exec();
  }

  async getReportById(refId: number): Promise<Report | null> {
    return await this.reportModel.findOne({ refId: { $eq: refId } }).exec();
  }

  getVisibleStatusCounts(category?: ReportCategory): Promise<any[]> {
    const query: any = {
      isDeleted: false,
      isVisible: true,
    };

    if (category) {
      query.type = { $eq: category };
    }

    return this.reportModel
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: '$status',
            count: {
              $sum: 1,
            },
          },
        },
      ])
      .exec();
  }

  async createReport(
    createReport: CreateReportDto,
    images: Array<Express.Multer.File>,
  ): Promise<Report> {
    const imageUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      imageUrls[i] = await this.uploadImageToCloudinary(images[i]);
    }
    const reports = await this.reportModel.find().exec();
    const reportCount = reports.length;
    if(reports != null && createReport.automaticEmailsEnabled != false) {
      await this.postmarkService.sendReceivedReportEmail(createReport.email, this.postmarkService.generateReportUrl(reportCount + 1));
    }
    const newReport = new this.reportModel({
      name: createReport.name,
      type: createReport.category,
      refId: reportCount + 1,
      comment: ' ',
      reportLong: createReport.longitude,
      reportLat: createReport.latitude,
      email: createReport.email,
      status: 'gautas',
      reportDate: Date.now(),
      isVisible: false,
      isDeleted: false,
      imageUrls: imageUrls,
      officerImageUrls: [],
      emailFeedbackStage: 1,
      automaticEmailsEnabled: createReport.automaticEmailsEnabled,
      historyData: [
        {
          user: createReport.email,
          date: Date.now(),
          edits: [
            {
              field: 'status',
              change: 'gautas',
            },
            {
              field: 'emailFeedbackStage',
              change: '1',
            },
          ],
        },
      ],
      statusRecords: [
        {
          status: 'gautas',
          date: Date.now(),
        },
      ],
    });

    return await newReport.save();
  }

  async updateReport(
    updateReport: UpdateReportDto,
    images: Array<Express.Multer.File>,
    editorEmail: string,
  ): Promise<Report | null> {
    const officerImageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      officerImageUrls[i] = await this.uploadImageToCloudinary(images[i]);
    }

    const report = await this.reportModel
      .findOne({ refId: { $eq: updateReport.refId } })
      .exec();

    if (report != null) {
      const historyEntry: HistoryDataDto = {
        user: editorEmail,
        date: new Date(),
        edits: [],
      };
      if (updateReport.name != report.name) {
        historyEntry.edits.push(new HistoryEditsDto('name', updateReport.name));
      }
      if (updateReport.category != report.type && updateReport.category != null) {
        historyEntry.edits.push(new HistoryEditsDto('category', updateReport.category));
      }
      if (updateReport.longitude != report.reportLong) {
        historyEntry.edits.push(
          new HistoryEditsDto('reportLong', updateReport.longitude.toString()),
        );
      }
      if (updateReport.latitude != report.reportLat) {
        historyEntry.edits.push(
          new HistoryEditsDto('reportLat', updateReport.latitude.toString()),
        );
      }
      if (updateReport.comment != report.comment) {
        historyEntry.edits.push(
          new HistoryEditsDto('comment', updateReport.comment),
        );
      }
      if (updateReport.isVisible != report.isVisible) {
        if (updateReport.isVisible) {
          historyEntry.edits.push(new HistoryEditsDto('isVisible', 'true'));
        } else {
          historyEntry.edits.push(new HistoryEditsDto('isVisible', 'false'));
        }
      }
      if (updateReport.isDeleted != report.isDeleted) {
        if (updateReport.isDeleted) {
          historyEntry.edits.push(new HistoryEditsDto('isDeleted', 'true'));
        } else {
          historyEntry.edits.push(new HistoryEditsDto('isDeleted', 'false'));
        }
      }
      if (officerImageUrls.length != 0) {
        historyEntry.edits.push(
          new HistoryEditsDto(
            'officerImages',
            officerImageUrls.length.toString(),
          ),
        );
      }

      if(updateReport.category == 'kita'){
        await this.reportModel.updateOne(
          {
            refId: { $eq: updateReport.refId },
          },
          {
            $set: {
              emailFeedbackStage: 0,
              automaticEmailsEnabled: false,
            }
          },
        );
      }

      if (updateReport.status != report.status) {
        for (let i = 0; i < report.statusRecords.length; i++) {
          if (report.statusRecords[i].status == updateReport.status) {
            await this.reportModel.updateOne(
              { refId: updateReport.refId },
              { $pull: { statusRecords: { status: updateReport.status } } },
            );
          }
        }

        if(updateReport.status == 'tiriamas' && report.emailFeedbackStage < 2 && report.automaticEmailsEnabled && updateReport.category != 'kita'){
          await this.postmarkService.sendInInvestigationReportEmail(report.email, this.postmarkService.generateReportUrl(updateReport.refId));
          await this.reportModel.updateOne(
            {
              refId: { $eq: updateReport.refId },
            },
            {
              $push: {
                statusRecords: {
                  status: updateReport.status,
                  date: new Date(),
                },
              },
              $set: {
                emailFeedbackStage: 2,
              }
            },
          );
          historyEntry.edits.push(
            new HistoryEditsDto('emailFeedbackStage', '2'),
          );
        }else if((updateReport.status == 'išspręsta' || updateReport.status == 'nepasitvirtino') && report.emailFeedbackStage < 3 && report.automaticEmailsEnabled && updateReport.category != 'kita'){
          await this.postmarkService.sendInvestigatedReportEmail(report.email, this.postmarkService.generateReportUrl(updateReport.refId));
          await this.reportModel.updateOne(
            {
              refId: { $eq: updateReport.refId },
            },
            {
              $push: {
                statusRecords: {
                  status: updateReport.status,
                  date: new Date(),
                },
              },
              $set: {
                emailFeedbackStage: 3,
              }
            },
          );
          historyEntry.edits.push(
            new HistoryEditsDto('emailFeedbackStage', '3'),
          );
        }else {
          await this.reportModel.updateOne(
            {
              refId: { $eq: updateReport.refId },
            },
            {
              $push: {
                statusRecords: {
                  status: updateReport.status,
                  date: new Date(),
                },
              },
            },
          );
        }

        historyEntry.edits.push(
          new HistoryEditsDto('status', updateReport.status),
        );
      }
      if (historyEntry.edits.length != 0) {
        await this.reportModel.findOneAndUpdate(
          {
            refId: updateReport.refId,
          },
          {
            $push: {
              historyData: historyEntry,
            },
          },
        );
      }
    }


    let updatedReport = null;
    if (report != null) {
      updatedReport = await this.reportModel
        .findOneAndUpdate(
          {
            refId: { $eq: updateReport.refId },
          },
          {
            $set: {
              name: updateReport.name,
              reportLong: updateReport.longitude,
              reportLat: updateReport.latitude,
              type: updateReport.category,
              status: updateReport.status,
              isVisible: updateReport.isVisible,
              isDeleted: updateReport.isDeleted,
              comment: updateReport.comment,
              imageUrls: updateReport.imageUrls,
              officerImageUrls:
                officerImageUrls.length == 0
                  ? report.officerImageUrls
                  : officerImageUrls,
            },
          },
        )
        .exec();
    }

    return updatedReport;
  }

  async updateTransferReport(
    refId: string,
    inspection: string,
    inspectionId: string,
    editorEmail: string,
  ): Promise<Report | null> {
    const report = await this.reportModel
      .findOne({ refId: { $eq: refId } })
      .exec();

    if (report != null) {
      const historyEntry: HistoryDataDto = {
        user: editorEmail,
        date: new Date(),
        edits: [],
      };

      historyEntry.edits.push(new HistoryEditsDto('inspection', inspection));
      historyEntry.edits.push(
        new HistoryEditsDto('inspectionId', inspectionId),
      );
      historyEntry.edits.push(new HistoryEditsDto('isTransferred', 'true'));
      if (historyEntry.edits.length != 0) {
        await this.reportModel.findOneAndUpdate(
          {
            refId: { $eq: refId },
          },
          {
            $push: {
              historyData: historyEntry,
            },
          },
        );
      }
    }

    let updatedReport = null;
    if (report != null) {
      updatedReport = await this.reportModel
        .findOneAndUpdate(
          {
            refId: { $eq: refId },
          },
          {
            $set: {
              inspection: inspection,
              inspectionId: inspectionId,
              isTransferred: true,
            },
          },
          {
            returnNewDocument: true,
          }
        )
        .exec();
    }

    return updatedReport;
  }

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    const upload = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    if (upload != undefined) {
      return upload.secure_url;
    } else {
      throw new BadRequestException('Invalid file type');
    }
  }
}
