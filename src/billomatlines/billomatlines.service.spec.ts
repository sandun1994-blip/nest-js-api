import { Test, TestingModule } from '@nestjs/testing';
import { BillomatlinesService } from './billomatlines.service';

describe('BillomatlinesService', () => {
  let service: BillomatlinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillomatlinesService],
    }).compile();

    service = module.get<BillomatlinesService>(BillomatlinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
