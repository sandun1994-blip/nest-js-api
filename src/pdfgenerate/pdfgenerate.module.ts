import { Module } from '@nestjs/common';
import { PdfgenerateService } from './pdfgenerate.service';
import { PdfgenerateController } from './pdfgenerate.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailsenderModule } from 'src/mailsender/mailsender.module';

@Module({
  providers: [PdfgenerateService],
  controllers: [PdfgenerateController],
  imports: [PrismaModule, MailsenderModule],
  exports: [PdfgenerateService],
})
export class PdfgenerateModule {}
