import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobPost } from './job-post.schema';
import { CreateJobPostDto, UpdateJobPostDto } from './dto/job-post.dto';

@Injectable()
export class JobPostService {
    constructor(
        @InjectModel(JobPost.name) private jobPostModel: Model<JobPost>,
    ) { }

    async getAllJobPosts(page: number, limit: number): Promise<{ jobPosts: JobPost[], page: number }> {
        const skip = page * limit;

        const jobPosts = await this.jobPostModel
            .find()
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!jobPosts) {
            throw new NotFoundException("Job posts not found");
        }

        return {
            jobPosts: jobPosts,
            page: +page + 1
        };
    }

    async getJobPostsByCompany(companyId: string, page: number, limit: number): Promise<{ jobPosts: JobPost[], page: number }> {
        const skip = page * limit;

        const jobPosts = await this.jobPostModel
            .find({ companyId })
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!jobPosts) {
            throw new NotFoundException(`Job posts for company with ID ${companyId} not found`);
        }

        return {
            jobPosts: jobPosts,
            page: +page + 1
        };
    }

    async createJobPost(createJobPostDto: CreateJobPostDto): Promise<JobPost> {
        const newJobPost = new this.jobPostModel(createJobPostDto);
        return newJobPost.save();
    }

    async updateJobPost(id: string, updateJobPostDto: UpdateJobPostDto): Promise<JobPost> {
        const updatedJobPost = await this.jobPostModel.findByIdAndUpdate(
            id,
            { $set: updateJobPostDto },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedJobPost) {
            throw new NotFoundException(`Job post with ID ${id} not found`);
        }

        return updatedJobPost;
    }

    async deleteJobPost(id: string): Promise<JobPost> {
        const deletedJobPost = await this.jobPostModel.findByIdAndDelete(id).exec();

        if (!deletedJobPost) {
            throw new NotFoundException(`Job post with ID ${id} not found`);
        }

        return deletedJobPost;
    }
}
