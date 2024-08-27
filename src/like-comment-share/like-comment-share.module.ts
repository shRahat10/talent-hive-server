import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService, CommentService, ShareService } from './like-comment-share.service';
import { LikeSchema, CommentSchema, ShareSchema } from './like-comment-share.schema';
import { LikeCommentController } from './like-comment.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Likes', schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: 'Shares', schema: ShareSchema }]),
    ],
    providers: [LikeService, CommentService, ShareService],
    exports: [LikeService, CommentService, ShareService],
    controllers: [LikeCommentController],
})
export class LikeCommentModule { }
