import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostSchema } from './post.schema';
import { PostInteractionModule } from '../post-interaction/post-interaction.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
        PostInteractionModule,
    ],
    controllers: [PostController],
    providers: [PostService],

})
export class PostModule { }
