import { Test, TestingModule } from '@nestjs/testing';
import { PostInteractionController } from './post-interaction.controller';

describe('PostInteractionController', () => {
  let controller: PostInteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostInteractionController],
    }).compile();

    controller = module.get<PostInteractionController>(PostInteractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
