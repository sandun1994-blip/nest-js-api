import { Test, TestingModule } from '@nestjs/testing';
import { StockrequirementController } from './stockrequirement.controller';

describe('StockrequirementController', () => {
  let controller: StockrequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockrequirementController],
    }).compile();

    controller = module.get<StockrequirementController>(StockrequirementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
