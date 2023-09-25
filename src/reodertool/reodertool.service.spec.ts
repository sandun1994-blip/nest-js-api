import { Test, TestingModule } from '@nestjs/testing';
import { ReodertoolService } from './reodertool.service';

describe('ReodertoolService', () => {
  let service: ReodertoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReodertoolService],
    }).compile();

    service = module.get<ReodertoolService>(ReodertoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
