import { Test, TestingModule } from '@nestjs/testing';
import { SupplierstockitemsController } from './supplierstockitems.controller';

describe('SupplierstockitemsController', () => {
  let controller: SupplierstockitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierstockitemsController],
    }).compile();

    controller = module.get<SupplierstockitemsController>(SupplierstockitemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
