import { Test, TestingModule } from '@nestjs/testing';
import { BillomatlinesController } from './billomatlines.controller';

describe('BillomatlinesController', () => {
  let controller: BillomatlinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillomatlinesController],
    }).compile();

    controller = module.get<BillomatlinesController>(BillomatlinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
