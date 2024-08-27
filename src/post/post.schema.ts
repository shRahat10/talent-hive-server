import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    userId: string;

    @Prop()
    content: string;

    @Prop([String])
    media: string[];

    @Prop({ default: new Date() })
    timestamp: Date;

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ default: 0 })
    commentsCount: number;

    @Prop({ default: 0 })
    sharesCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
