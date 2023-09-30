import { Module } from '@nestjs/common';
import { WorkorderlineService } from './workorderline.service';
import { WorkorderlineController } from './workorderline.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [WorkorderlineService],
  controllers: [WorkorderlineController],
  exports: [WorkorderlineService],
  imports: [PrismaModule],
})
export class WorkorderlineModule {}
