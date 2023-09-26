import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseorderlineController } from './purchaseorderline.controller';

describe('PurchaseorderlineController', () => {
  let controller: PurchaseorderlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseorderlineController],
    }).compile();

    controller = module.get<PurchaseorderlineController>(PurchaseorderlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
