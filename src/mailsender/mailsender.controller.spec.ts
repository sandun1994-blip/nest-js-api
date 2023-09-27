import { Test, TestingModule } from '@nestjs/testing';
import { MailsenderController } from './mailsender.controller';

describe('MailsenderController', () => {
  let controller: MailsenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailsenderController],
    }).compile();

    controller = module.get<MailsenderController>(MailsenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
