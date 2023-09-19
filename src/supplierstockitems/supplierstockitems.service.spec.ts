import { Test, TestingModule } from '@nestjs/testing';
import { SupplierstockitemsService } from './supplierstockitems.service';

describe('SupplierstockitemsService', () => {
  let service: SupplierstockitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierstockitemsService],
    }).compile();

    service = module.get<SupplierstockitemsService>(SupplierstockitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
