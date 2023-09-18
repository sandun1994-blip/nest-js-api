import { Test, TestingModule } from '@nestjs/testing';
import { StockrequirementService } from './stockrequirement.service';

describe('StockrequirementService', () => {
  let service: StockrequirementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockrequirementService],
    }).compile();

    service = module.get<StockrequirementService>(StockrequirementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
