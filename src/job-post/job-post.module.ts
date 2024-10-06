import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPostSchema } from './job-post.schema';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'JobPost', schema: JobPostSchema }]),
    ],
    controllers: [JobPostController],
    providers: [JobPostService],
})
export class JobPostModule { }
