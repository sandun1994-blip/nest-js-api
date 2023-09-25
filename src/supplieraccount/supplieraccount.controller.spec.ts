import { Test, TestingModule } from '@nestjs/testing';
import { SupplieraccountController } from './supplieraccount.controller';

describe('SupplieraccountController', () => {
  let controller: SupplieraccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplieraccountController],
    }).compile();

    controller = module.get<SupplieraccountController>(SupplieraccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
