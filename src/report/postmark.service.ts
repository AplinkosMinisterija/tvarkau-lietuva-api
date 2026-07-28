import { BadRequestException, Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
import { TemplatedMessage } from 'postmark';
import * as process from 'process';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PostmarkService {
  private client: postmark.ServerClient;

  constructor(private cloudinary: CloudinaryService) {
    this.client = new postmark.ServerClient(process.env['POSTMARK_API_TOKEN']!);
  }

  async sendUserFeedback(
    email: string,
    description: string,
    images?: Array<Express.Multer.File>,
  ): Promise<string> {
    const imageUrls: string[] = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        imageUrls[i] = await this.uploadImageToCloudinary(images[i]);
      }
    }

    const links = [];
    for (let i = 0; i < imageUrls.length; i++) {
      links.push({ url: imageUrls[i] });
    }

    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env['POSTMARK_FEEDBACK_TEMPLATE_ID']),
      From: process.env['ADMIN_EMAIL']!,
      To: process.env['ADMIN_EMAIL'],
      TemplateModel: {
        email: email,
        description: description,
        links: links,
      },
    };
    // DEV MODEconst message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  async sendReceivedReportEmail(
    email: string,
    link: string,
    id: string,
  ): Promise<string> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env['POSTMARK_RECEIVED_REPORT_TEMPLATE_ID']),
      From: process.env['ADMIN_EMAIL']!,
      To: email,
      TemplateModel: {
        link: link,
        id: id,
      },
    };
    // DEV MODEconst message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  async sendInInvestigationReportEmail(
    email: string,
    link: string,
    id: string,
  ): Promise<string> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(
        process.env['POSTMARK_IN_INVESTIGATION_REPORT_TEMPLATE_ID'],
      ),
      From: process.env['ADMIN_EMAIL']!,
      To: email,
      TemplateModel: {
        link: link,
        id: id,
      },
    };
    // DEV MODEconst message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  async sendInvestigatedReportEmail(
    email: string,
    link: string,
    id: string,
  ): Promise<string> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(
        process.env['POSTMARK_INVESTIGATED_REPORT_TEMPLATE_ID'],
      ),
      From: process.env['ADMIN_EMAIL']!,
      To: email,
      TemplateModel: {
        link: link,
        id: id,
      },
    };
    // DEV MODEconst message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  generateReportUrl(refId: string | number, isShortFormat: boolean): string {
    let id = '';
    if (typeof refId === 'number') {
      id = String(refId);
    } else {
      id = refId;
    }
    if (id.length > 8) {
      throw new Error('refId cannot be longer than 8 characters.');
    }
    const paddedZeros = '0'.repeat(8 - id.length);
    const reportName = 'TLP-A' + paddedZeros + id.toUpperCase();
    if (isShortFormat) {
      return reportName;
    } else {
      return 'https://tvarkaulietuva.lt/pranesimas?id=' + reportName;
    }
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
