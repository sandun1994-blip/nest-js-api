import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { ConfigModule } from '@nestjs/config';
import { StockrequirementModule } from './stockrequirement/stockrequirement.module';
import { SupplierstockitemsModule } from './supplierstockitems/supplierstockitems.module';
import { SupplieraccountModule } from './supplieraccount/supplieraccount.module';
import { ReodertoolModule } from './reodertool/reodertool.module';
import { PurchaseorderModule } from './purchaseorder/purchaseorder.module';
import { PurchaseorderlineModule } from './purchaseorderline/purchaseorderline.module';
import { PdfgenerateModule } from './pdfgenerate/pdfgenerate.module';
import { MailsenderModule } from './mailsender/mailsender.module';
import { BillomatlinesModule } from './billomatlines/billomatlines.module';
import { BillomathdrModule } from './billomathdr/billomathdr.module';
import { WorkorderModule } from './workorder/workorder.module';
import { WorkorderlineModule } from './workorderline/workorderline.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    HomeModule,
    StockrequirementModule,
    SupplierstockitemsModule,
    SupplieraccountModule,
    ReodertoolModule,
    PurchaseorderModule,
    PurchaseorderlineModule,
    PdfgenerateModule,
    MailsenderModule,
    BillomatlinesModule,
    BillomathdrModule,
    WorkorderModule,
    WorkorderlineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
