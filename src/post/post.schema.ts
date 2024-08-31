import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema()
export class Post extends Document {
    @Prop({ required: true, unique: true, default: () => `p${Date.now()}${Math.floor(100 + Math.random() * 900)}` })
    uid: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

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
