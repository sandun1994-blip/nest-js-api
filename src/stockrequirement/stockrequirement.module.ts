import { Module } from '@nestjs/common';
import { StockrequirementController } from './stockrequirement.controller';
import { StockrequirementService } from './stockrequirement.service';

@Module({
  controllers: [StockrequirementController],
  providers: [StockrequirementService]
})
export class StockrequirementModule {}
