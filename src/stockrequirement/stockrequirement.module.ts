import { Module } from '@nestjs/common';
import { StockrequirementController } from './stockrequirement.controller';
import { StockrequirementService } from './stockrequirement.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StockrequirementController],
  providers: [StockrequirementService],
  imports: [PrismaModule],
})
export class StockrequirementModule {}
