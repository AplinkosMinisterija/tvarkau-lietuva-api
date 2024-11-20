import { Injectable } from "@nestjs/common";
import * as postmark from "postmark";
import { TemplatedMessage } from "postmark";
import * as process from "process";
import { MessageSendingResponse } from "postmark/dist/client/models";

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
      TemplateId: Number(process.env["POSTMARK_TEMPLATE_ID"]),
      From: email,
      To: process.env["ADMIN_EMAIL"],
      TemplateModel: {
        email: email,
        description: description
      }
    };
    return 'Report sent successfully';
  }
}