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
  ): Promise<String> {

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
}