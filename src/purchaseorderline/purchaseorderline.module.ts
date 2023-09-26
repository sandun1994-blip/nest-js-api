import { Module } from '@nestjs/common';
import { PurchaseorderlineService } from './purchaseorderline.service';
import { PurchaseorderlineController } from './purchaseorderline.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PurchaseorderlineService],
  controllers: [PurchaseorderlineController],
  imports: [PrismaModule],
  exports: [PurchaseorderlineService],
})
export class PurchaseorderlineModule {}
