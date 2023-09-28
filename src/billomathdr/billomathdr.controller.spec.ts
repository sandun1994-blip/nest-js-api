import { Test, TestingModule } from '@nestjs/testing';
import { BillomathdrController } from './billomathdr.controller';

describe('BillomathdrController', () => {
  let controller: BillomathdrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillomathdrController],
    }).compile();

    controller = module.get<BillomathdrController>(BillomathdrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
