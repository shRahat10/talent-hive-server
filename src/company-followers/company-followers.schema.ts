import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/user.schema";
import { Company } from "src/company/company.schema";

@Schema({ timestamps: true })
export class CompanyFollower extends Document {
    @Prop({ type: Types.ObjectId, ref: Company.name, required: true, unique: true })
    companyId: Types.ObjectId;

    @Prop([{ type: Types.ObjectId, ref: User.name }])
    followerIds: Types.ObjectId[];
}

export const CompanyFollowerSchema = SchemaFactory.createForClass(CompanyFollower);
