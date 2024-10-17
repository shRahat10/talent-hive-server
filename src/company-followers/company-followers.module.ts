import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyFollowerSchema } from './company-followers.schema';
import { CompanyFollowersController } from './company-followers.controller';
import { CompanyFollowersService } from './company-followers.service';
import { CompanySchema } from 'src/company/company.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'CompanyFollower', schema: CompanyFollowerSchema }]),
      MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    ],
    controllers: [CompanyFollowersController],
    providers: [CompanyFollowersService],
  })
  export class CompanyFollowersModule { }