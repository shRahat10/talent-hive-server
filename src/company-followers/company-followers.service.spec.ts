import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFollowersService } from './company-followers.service';

describe('CompanyFollowersService', () => {
  let service: CompanyFollowersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyFollowersService],
    }).compile();

    service = module.get<CompanyFollowersService>(CompanyFollowersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
