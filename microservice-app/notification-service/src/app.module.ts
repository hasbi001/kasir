import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration globally available
      envFilePath: '.env', // Load environment variables from .env file
    }),
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
