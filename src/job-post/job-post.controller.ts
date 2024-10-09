import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPost } from './job-post.schema';
import { CreateJobPostDto, UpdateJobPostDto } from './dto/job-post.dto';

@Controller('job-post')
export class JobPostController {
    constructor(private readonly jobPostService: JobPostService) { }

    @Get()
    async getAllJobPosts(
        @Query('userId') userId: string,
        @Query('page') page: number = 0,
        @Query('limit') limit: number = 10
    ): Promise<{ jobPosts: JobPost[], page: number }> {
        return this.jobPostService.getAllJobPosts(userId, page, limit);
    }

    @Get(':companyId')
    async getJobPostsByCompany(
        @Param('companyId') companyId: string,
        @Query('page') page: number = 0,
        @Query('limit') limit: number = 10
    ): Promise<{ jobPosts: JobPost[], page: number }> {
        return this.jobPostService.getJobPostsByCompany(companyId, page, limit);
    }

    @Get('details/:jobPostId')
    async getOneJobPost(
        @Param('jobPostId') jobPostId: string
    ): Promise<JobPost> {
        return this.jobPostService.getOneJobPost(jobPostId);
    }

    @Post()
    async createJobPost(@Body() createJobPostDto: CreateJobPostDto): Promise<JobPost> {
        return this.jobPostService.createJobPost(createJobPostDto);
    }

    @Patch(':id')
    async updateJobPost(
        @Param('id') id: string,
        @Body() updateJobPostDto: UpdateJobPostDto
    ): Promise<JobPost> {
        return this.jobPostService.updateJobPost(id, updateJobPostDto);
    }

    @Delete(':id')
    async deleteJobPost(@Param('id') id: string): Promise<JobPost> {
        return this.jobPostService.deleteJobPost(id);
    }
}
