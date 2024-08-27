import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService, CommentService } from './like-comment.service';
import { LikeSchema, CommentSchema } from './like-comment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Likes', schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
    ],
    providers: [LikeService, CommentService],
    exports: [LikeService, CommentService],
})
export class LikeCommentModule { }
