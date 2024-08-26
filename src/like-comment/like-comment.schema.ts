import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Like extends Document {
    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    postId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

@Schema()
export class Comment extends Document {
    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    postId: string;

    @Prop({ required: true })
    comment: string;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
