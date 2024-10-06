import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "src/user/user.schema";


@Schema({ timestamps: true })
export class Company extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    employerId: Types.ObjectId;

    @Prop()
    companyName: string;

    @Prop()
    companyEmail: string;

    @Prop()
    companyProfileImage: string;

    @Prop()
    companyCoverImage: string;

    @Prop()
    companyContactNumber: number;

    @Prop()
    companyDescription: string;

    @Prop()
    facebookLink: string;

    @Prop()
    linkedInLink: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
