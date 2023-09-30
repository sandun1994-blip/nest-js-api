import { Module } from '@nestjs/common';
import { WorkorderService } from './workorder.service';
import { WorkorderController } from './workorder.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [WorkorderService],
  controllers: [WorkorderController],
  exports: [WorkorderService],
  imports: [PrismaModule],
})
export class WorkorderModule {}
