import { Test, TestingModule } from '@nestjs/testing';
import { LikeService, CommentService, ShareService } from './like-comment-share.service';

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeService],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('ShareService', () => {
  let service: ShareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareService],
    }).compile();

    service = module.get<ShareService>(ShareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
