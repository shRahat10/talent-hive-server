import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/post/post.schema';
import { User } from 'src/user/user.schema';

// Like
@Schema({ timestamps: true })
export class Likes extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Likes);

// Comment
@Schema({ timestamps: true })
export class Comments extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;

    @Prop({ required: true })
    comment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);

// Save
@Schema({ timestamps: true })
export class Saves extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    postId: Types.ObjectId;
}

export const SaveSchema = SchemaFactory.createForClass(Saves);
