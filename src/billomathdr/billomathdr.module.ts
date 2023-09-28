import { Module } from '@nestjs/common';
import { BillomathdrService } from './billomathdr.service';
import { BillomathdrController } from './billomathdr.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [BillomathdrService],
  controllers: [BillomathdrController],
  imports: [PrismaModule],
})
export class BillomathdrModule {}
