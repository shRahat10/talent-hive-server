import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/post/post.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Likes extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Likes);

@Schema()
export class Comments extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;

    @Prop({ required: true })
    comment: string;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);

@Schema()
export class Shares extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const ShareSchema = SchemaFactory.createForClass(Shares);

@Schema()
export class Saves extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const SaveSchema = SchemaFactory.createForClass(Saves);
