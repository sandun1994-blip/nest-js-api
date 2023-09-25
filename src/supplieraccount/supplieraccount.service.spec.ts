import { Test, TestingModule } from '@nestjs/testing';
import { SupplieraccountService } from './supplieraccount.service';

describe('SupplieraccountService', () => {
  let service: SupplieraccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplieraccountService],
    }).compile();

    service = module.get<SupplieraccountService>(SupplieraccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
