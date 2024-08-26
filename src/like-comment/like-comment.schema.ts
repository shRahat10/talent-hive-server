import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Like schema
@Schema()
export class Like extends Document {
    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    uid: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
    postId: MongooseSchema.Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);


// Comment schema
@Schema()
export class Comment extends Document {
    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    comment: string;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
    postId: MongooseSchema.Types.ObjectId;
}


export const CommentSchema = SchemaFactory.createForClass(Comment);
