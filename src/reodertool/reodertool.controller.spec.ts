import { Test, TestingModule } from '@nestjs/testing';
import { ReodertoolController } from './reodertool.controller';

describe('ReodertoolController', () => {
  let controller: ReodertoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReodertoolController],
    }).compile();

    controller = module.get<ReodertoolController>(ReodertoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
