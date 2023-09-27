import { Module } from '@nestjs/common';
import { ReodertoolService } from './reodertool.service';
import { ReodertoolController } from './reodertool.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PurchaseorderModule } from 'src/purchaseorder/purchaseorder.module';
import { PurchaseorderlineModule } from 'src/purchaseorderline/purchaseorderline.module';
import { PdfgenerateModule } from 'src/pdfgenerate/pdfgenerate.module';
import { StockrequirementModule } from 'src/stockrequirement/stockrequirement.module';

@Module({
  providers: [ReodertoolService],
  controllers: [ReodertoolController],
  imports: [
    PrismaModule,
    PurchaseorderModule,
    PurchaseorderlineModule,
    PdfgenerateModule,
    StockrequirementModule
  ],
  exports: [ReodertoolService],
})
export class ReodertoolModule {}
