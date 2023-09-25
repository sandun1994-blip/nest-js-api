import { Module } from '@nestjs/common';
import { PurchaseorderService } from './purchaseorder.service';
import { PurchaseorderController } from './purchaseorder.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PurchaseorderService],
  controllers: [PurchaseorderController],
  imports: [PrismaModule],
  exports: [PurchaseorderService],
})
export class PurchaseorderModule {}
