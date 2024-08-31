import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService, CommentService, ShareService, SaveService } from './post-interaction.service';
import { LikeSchema, CommentSchema, ShareSchema, SaveSchema } from './post-interaction.schema';
import { PostInteractionController } from './post-interaction.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Likes', schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: 'Shares', schema: ShareSchema }]),
        MongooseModule.forFeature([{ name: 'Saves', schema: SaveSchema }]),
    ],
    providers: [LikeService, CommentService, ShareService, SaveService],
    exports: [LikeService, CommentService, ShareService, SaveService],
    controllers: [PostInteractionController],
})
export class PostInteractionModule { }
