import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ConnectionRequest extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    sender: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
    receiver: Types.ObjectId;

    @Prop({ required: true, enum: ['pending'], default: 'pending' })
    status: string;
}

export const ConnectionRequestSchema = SchemaFactory.createForClass(ConnectionRequest);
