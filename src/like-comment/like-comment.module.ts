import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService, CommentService } from './like-comment.service';
import { LikeSchema, CommentSchema } from './like-comment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    ],
    providers: [LikeService, CommentService],
    exports: [LikeService, CommentService],
})
export class LikeCommentModule {}
