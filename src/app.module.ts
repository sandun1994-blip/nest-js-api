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

@Module({
  imports:[ConfigModule.forRoot(), UserModule, PrismaModule, HomeModule, StockrequirementModule, SupplierstockitemsModule, SupplieraccountModule, ReodertoolModule, PurchaseorderModule, PurchaseorderlineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
