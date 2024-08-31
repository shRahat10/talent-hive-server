import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService, CommentService, ShareService } from './post-interaction.service';
import { LikeSchema, CommentSchema, ShareSchema } from './post-interaction.schema';
import { PostInteractionController } from './post-interaction.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Likes', schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: 'Shares', schema: ShareSchema }]),
    ],
    providers: [LikeService, CommentService, ShareService],
    exports: [LikeService, CommentService, ShareService],
    controllers: [PostInteractionController],
})
export class PostInteractionModule {}
