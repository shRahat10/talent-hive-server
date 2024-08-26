import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Comment, Like } from 'src/like-comment/like-comment.schema';

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

    @Prop({ default: Date.now })
    timestamp: Date;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Like' }], default: [] })
    likes: Like[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }], default: [] })
    comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
