import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPostSchema } from './job-post.schema';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { UserSchema } from 'src/user/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'JobPost', schema: JobPostSchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [JobPostController],
    providers: [JobPostService],
})
export class JobPostModule { }
