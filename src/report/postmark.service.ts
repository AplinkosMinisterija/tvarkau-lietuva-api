import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
import { CreateReportDto } from './dto';
import { TemplatedMessage } from 'postmark';
import * as process from 'process';

@Injectable()
export class PostmarkService {
  private client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient(process.env['POSTMARK_API_TOKEN']!);
  }

  async sendBarkBeetleReport(
    createReportDto: CreateReportDto,
    images: Array<Express.Multer.File>,
    to: string,
  ) {
    function encodeToBase64(file: Express.Multer.File) {
      return Buffer.from(file.buffer).toString('base64');
    }

    const attachments = [];

    for (let i = 0; i < images.length; i++) {
      const encodedImageContent = encodeToBase64(images[i]);
      attachments.push({
        Name: 'nuotrauka' + i + '.jpg',
        Content: encodedImageContent,
        ContentType: 'image/jpeg',
        ContentID: 'photo' + i,
      });
    }

    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env['POSTMARK_TEMPLATE_ID']),
      From: 'neatsakyti@tvarkaulietuva.lt',
      To: to,
      TemplateModel: {
        description: createReportDto.name,
        longitude: createReportDto.longitude,
        latitude: createReportDto.latitude,
        email: createReportDto.email,
      },
      Attachments: attachments,
    };

    return this.client.sendEmailWithTemplate(templatedMessage);
  }
}
