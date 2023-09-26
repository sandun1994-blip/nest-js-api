import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseorderlineService } from './purchaseorderline.service';

describe('PurchaseorderlineService', () => {
  let service: PurchaseorderlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseorderlineService],
    }).compile();

    service = module.get<PurchaseorderlineService>(PurchaseorderlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
