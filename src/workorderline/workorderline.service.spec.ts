import { Test, TestingModule } from '@nestjs/testing';
import { WorkorderlineService } from './workorderline.service';

describe('WorkorderlineService', () => {
  let service: WorkorderlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkorderlineService],
    }).compile();

    service = module.get<WorkorderlineService>(WorkorderlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
