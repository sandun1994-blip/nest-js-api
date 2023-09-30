import { Test, TestingModule } from '@nestjs/testing';
import { WorkorderlineController } from './workorderline.controller';

describe('WorkorderlineController', () => {
  let controller: WorkorderlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkorderlineController],
    }).compile();

    controller = module.get<WorkorderlineController>(WorkorderlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
