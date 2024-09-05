import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema()
export class Likes extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    postId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Likes);

@Schema()
export class Comments extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    postId: string;

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

    @Prop({ required: true })
    postId: string;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const ShareSchema = SchemaFactory.createForClass(Shares);

@Schema()
export class Saves extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    postId: string;

    @Prop({ default: new Date() })
    createdAt: Date;
}

export const SaveSchema = SchemaFactory.createForClass(Saves);
