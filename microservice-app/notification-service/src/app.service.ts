import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EmailService } from './email/email.service';

@Injectable()
export class AppService {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('order_created')
  handleConfirmation(data: any) {
    console.log('Sending notification:', data);
    // kirim notifikasi email/SMS
    return this.emailService.sendMail(
      data.email,
      'Order Confirmation',
      'Order Anda telah dibuat dengan sukses! ID Pesanan: ' + data.orderId
    );
  }
}
