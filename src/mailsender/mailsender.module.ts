import { Module } from '@nestjs/common';
import { MailsenderService } from './mailsender.service';
import { MailsenderController } from './mailsender.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [MailsenderService],
  controllers: [MailsenderController],
  exports: [MailsenderService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.HOST_MAIL,
          pass: process.env.HOST_MAIL_PW,
        },
      },
      defaults: {
        from: `"No Reply" ${process.env.HOST_MAIL}`,
      },
    }),
    PrismaModule,
  ],
})
export class MailsenderModule {}
