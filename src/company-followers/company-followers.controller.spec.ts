import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFollowersController } from './company-followers.controller';

describe('CompanyFollowersController', () => {
  let controller: CompanyFollowersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyFollowersController],
    }).compile();

    controller = module.get<CompanyFollowersController>(CompanyFollowersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
