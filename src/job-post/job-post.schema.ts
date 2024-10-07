import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from 'src/company/company.schema';
import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class JobPost extends Document {
    @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
    companyId: Types.ObjectId;

    @Prop({ required: true })
    jobTitle: string;

    @Prop({ required: true })
    workplaceType: string;

    @Prop({ required: true })
    jobLocation: string;

    @Prop({ required: true })
    jobType: string;

    @Prop({
        type: {
            description: { type: String, required: true },
            educationalRequirements: { type: [String], required: true },
            experienceRequirements: { type: [String], required: true },
            additionalRequirements: { type: [String], required: true },
        },
        required: true,
    })
    about: {
        description: string;
        educationalRequirements: string[];
        experienceRequirements: string[];
        additionalRequirements: string[];
    };

    @Prop({ type: [{ applicantId: { type: Types.ObjectId, ref: User.name, } }] })
    applicants: { applicantId: Types.ObjectId }[];
}

export const JobPostSchema = SchemaFactory.createForClass(JobPost);
