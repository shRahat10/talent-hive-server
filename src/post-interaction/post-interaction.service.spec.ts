import { Test, TestingModule } from '@nestjs/testing';
import { PostInteractionService } from './post-interaction.service';

describe('PostInteractionService', () => {
  let service: PostInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostInteractionService],
    }).compile();

    service = module.get<PostInteractionService>(PostInteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
