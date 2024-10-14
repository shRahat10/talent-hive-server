import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Connection extends Document {
    @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], default: [] })
    connectedUserIds: Types.ObjectId[];
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
