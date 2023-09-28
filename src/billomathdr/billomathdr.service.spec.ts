import { Test, TestingModule } from '@nestjs/testing';
import { BillomathdrService } from './billomathdr.service';

describe('BillomathdrService', () => {
  let service: BillomathdrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillomathdrService],
    }).compile();

    service = module.get<BillomathdrService>(BillomathdrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
