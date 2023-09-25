import { Module } from '@nestjs/common';
import { SupplieraccountService } from './supplieraccount.service';
import { SupplieraccountController } from './supplieraccount.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SupplieraccountService],
  controllers: [SupplieraccountController],
  imports:[PrismaModule]
})
export class SupplieraccountModule {}
