import { Module } from '@nestjs/common';
import { SupplierstockitemsController } from './supplierstockitems.controller';
import { SupplierstockitemsService } from './supplierstockitems.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SupplierstockitemsController],
  providers: [SupplierstockitemsService],
  imports: [PrismaModule],
})
export class SupplierstockitemsModule {}
