import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService, CommentService, SaveService } from './post-interaction.service';
import { LikeSchema, CommentSchema, SaveSchema } from './post-interaction.schema';
import { PostInteractionController } from './post-interaction.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Likes', schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: 'Saves', schema: SaveSchema }]),
    ],
    providers: [LikeService, CommentService, SaveService],
    exports: [LikeService, CommentService, SaveService],
    controllers: [PostInteractionController],
})
export class PostInteractionModule { }
