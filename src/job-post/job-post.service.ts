import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobPost } from './job-post.schema';
import { CreateJobPostDto, UpdateJobPostDto } from './dto/job-post.dto';
import * as natural from 'natural';
import { User } from 'src/user/user.schema';

@Injectable()
export class JobPostService {
    constructor(
        @InjectModel(JobPost.name) private jobPostModel: Model<JobPost>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    // async getAllJobPosts(userId: string, page: number, limit: number): Promise<{ jobPosts: JobPost[], page: number }> {
    //     const skip = page * limit;

    //     const jobPosts = await this.jobPostModel
    //         .find()
    //         .populate({
    //             path: 'companyId',
    //             model: 'Company',
    //         })
    //         .populate({
    //             path: 'applicants.applicantId',
    //             model: 'User',
    //         })
    //         .sort({ updatedAt: -1, _id: -1 })
    //         .skip(skip)
    //         .limit(limit)
    //         .exec();

    //     if (!jobPosts) {
    //         throw new NotFoundException("Job posts not found");
    //     }

    //     return {
    //         jobPosts: jobPosts,
    //         page: +page + 1
    //     };
    // }

    async getAllJobPosts(userId: string, page: number, limit: number): Promise<{ jobPosts: JobPost[], page: number }> {
        const skip = page * limit;

        const currentUser = await this.userModel.findById(userId).select('designation about').exec();

        if (!currentUser) {
            throw new NotFoundException('Logged-in user not found');
        }

        const { designation, about: userAbout } = currentUser;

        const jobPosts = await this.jobPostModel
            .find()
            .populate({
                path: 'companyId',
                model: 'Company',
            })
            .populate({
                path: 'applicants.applicantId',
                model: 'User',
            })
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!jobPosts || jobPosts.length === 0) {
            throw new NotFoundException("Job posts not found");
        }

        if (designation || userAbout) {
            const natural = require('natural');

            const jobPostsWithSimilarity = jobPosts.map(jobPost => {
                const { jobTitle, about } = jobPost;
                const jobDescription = about.description;

                let similarity = 0;

                if (designation && jobTitle) {
                    similarity += natural.JaroWinklerDistance(jobTitle, designation);
                }

                if (userAbout && jobDescription) {
                    similarity += natural.JaroWinklerDistance(jobDescription, userAbout);
                }

                return { jobPost, similarity };
            });

            jobPostsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

            const sortedJobPosts = jobPostsWithSimilarity.map(item => item.jobPost);

            return {
                jobPosts: sortedJobPosts,
                page: +page + 1
            };
        }

        return {
            jobPosts,
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
