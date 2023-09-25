import { Module } from '@nestjs/common';
import { ReodertoolService } from './reodertool.service';
import { ReodertoolController } from './reodertool.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PurchaseorderModule } from 'src/purchaseorder/purchaseorder.module';

@Module({
  providers: [ReodertoolService],
  controllers: [ReodertoolController],
  imports: [PrismaModule, PurchaseorderModule],
})
export class ReodertoolModule {}