import { Injectable } from "@nestjs/common";
import * as postmark from "postmark";
import { TemplatedMessage } from "postmark";
import { MessageSendingResponse } from "postmark/dist/client/models";
import * as process from "process";

@Injectable()
export class PostmarkService {
  private client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient(process.env["POSTMARK_API_TOKEN"]!);
  }

  async sendUserFeedback(
    email: string,
    description: string
  ): Promise<string> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env["POSTMARK_FEEDBACK_TEMPLATE_ID"]),
      From: process.env["ADMIN_EMAIL"]!,
      To: process.env["ADMIN_EMAIL"],
      TemplateModel: {
        email: email,
        description: description
      }
    };
    const message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  async sendReceivedReportEmail(
    email: string,
    link: string,
  ): Promise<String> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env["POSTMARK_RECEIVED_REPORT_TEMPLATE_ID"]),
      From: process.env["ADMIN_EMAIL"]!,
      To: email,
      TemplateModel: {
        link: link,
      }
    };
    const message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  async sendInInvestigationReportEmail(
    email: string,
    link: string,
  ): Promise<String> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env["POSTMARK_IN_INVESTIGATION_REPORT_TEMPLATE_ID"]),
      From: process.env["ADMIN_EMAIL"]!,
      To: email,
      TemplateModel: {
        link: link,
      }
    };
    const message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  async sendInvestigatedReportEmail(
    email: string,
    link: string,
  ): Promise<String> {
    const templatedMessage: TemplatedMessage = {
      TemplateId: Number(process.env["POSTMARK_INVESTIGATED_REPORT_TEMPLATE_ID"]),
      From: process.env["ADMIN_EMAIL"]!,
      To: email,
      TemplateModel: {
        link: link,
      }
    };
    const message = this.client.sendEmailWithTemplate(templatedMessage);
    return 'Successfully sent';
  }

  generateReportUrl(refId: string | number): string {
    let id = '';
    if (typeof refId === 'number') {
      id = String(refId);
    }else{
      id = refId;
    }
    if (id.length > 8) {
      throw new Error('refId cannot be longer than 8 characters.');
    }
    const paddedZeros = '0'.repeat(8 - id.length);
    const reportName = "TLP-A"+paddedZeros+id.toUpperCase();
    return "https://tvarkaulietuva.lt/pranesimas?id="+reportName;
  }
}