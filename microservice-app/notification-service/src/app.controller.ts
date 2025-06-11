import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService
  ) {}

  @Get('send-test-email')
  async sendEmail() {
    return this.emailService.sendMail(
      'tujuan@example.com',
      'Hello from NestJS',
      'Ini adalah email yang dikirim dari aplikasi NestJS!'
    );
  }
}
