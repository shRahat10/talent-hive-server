import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './company.schema';
import { CompanyService } from './company.service';
import { CompanyFollowerSchema } from 'src/company-followers/company-followers.schema';
import { JobPostSchema } from 'src/job-post/job-post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: 'CompanyFollower', schema: CompanyFollowerSchema }]),
    MongooseModule.forFeature([{ name: 'JobPost', schema: JobPostSchema }]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule { }
