import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
    @Prop({ required: true, unique: true })
    uid: string;

    @Prop()
    userId: string;

    @Prop()
    content: string;

    @Prop({ type: [String], default: [] })
    media: string[];

    @Prop()
    timestamp: string;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ default: 0 })
    comments: number;

    @Prop({ default: 0 })
    shares: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
