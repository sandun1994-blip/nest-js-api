import { Module } from '@nestjs/common';
import { BillomatlinesService } from './billomatlines.service';
import { BillomatlinesController } from './billomatlines.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [BillomatlinesService],
  controllers: [BillomatlinesController],
  imports: [PrismaModule],
})
export class BillomatlinesModule {}
