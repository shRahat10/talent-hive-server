import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionRequestService } from './connection-request.service';

describe('ConnectionRequestService', () => {
  let service: ConnectionRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionRequestService],
    }).compile();

    service = module.get<ConnectionRequestService>(ConnectionRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
