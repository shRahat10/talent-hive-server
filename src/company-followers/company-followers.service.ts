import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/company/company.schema';
import { CompanyFollower } from './company-followers.schema';
import { UpdateCompanyFollowerDto } from './dto/company-followers.dto';

@Injectable()
export class CompanyFollowersService {
    constructor(
        @InjectModel(CompanyFollower.name) private companyFollowerModel: Model<CompanyFollower>,
        @InjectModel(Company.name) private companyModel: Model<Company>,
    ) { }

    async followCompany(companyId: string, userId: string): Promise<{ company: Company; follower: CompanyFollower }> {
        const updateFollowerDto: UpdateCompanyFollowerDto = {
            companyId,
            followerIds: [userId]
        };

        const followerDoc = await this.companyFollowerModel.findOneAndUpdate(
            { companyId: updateFollowerDto.companyId },
            { $addToSet: { followerIds: userId } },
            { new: true, upsert: true }
        ).exec();

        if (!followerDoc) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        const updatedCompany = await this.companyModel.findByIdAndUpdate(
            companyId,
            { $inc: { followers: 1 } },
            { new: true }
        ).exec();

        if (!updatedCompany) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        return { company: updatedCompany, follower: followerDoc };
    }

    async unfollowCompany(companyId: string, userId: string): Promise<{ company: Company; follower: CompanyFollower }> {
        const followerDoc = await this.companyFollowerModel.findOneAndUpdate(
            { companyId },
            { $pull: { followerIds: userId } },
            { new: true }
        ).exec();

        if (!followerDoc) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        const updatedCompany = await this.companyModel.findByIdAndUpdate(
            companyId,
            { $inc: { followers: -1 } },
            { new: true }
        ).exec();

        if (!updatedCompany) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        return { company: updatedCompany, follower: followerDoc };
    }
}
