import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema()
export class Post extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: false })
    sharedPostId: Types.ObjectId;

    @Prop()
    content: string;

    @Prop([String])
    media: string[];

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ default: 0 })
    commentsCount: number;

    @Prop({ default: 0 })
    sharesCount: number;

    @Prop({ default: new Date() })
    createdOn?: Date;

    @Prop({ default: new Date() })
    modifiedOn?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
