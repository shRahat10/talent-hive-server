import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionRequestController } from './connection-request.controller';

describe('ConnectionRequestController', () => {
  let controller: ConnectionRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionRequestController],
    }).compile();

    controller = module.get<ConnectionRequestController>(ConnectionRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
