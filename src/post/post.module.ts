import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostSchema } from './post.schema';
import { LikeCommentModule } from '../like-comment/like-comment.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
        LikeCommentModule,
    ],
    controllers: [PostController],
    providers: [PostService],

})
export class PostModule { }
