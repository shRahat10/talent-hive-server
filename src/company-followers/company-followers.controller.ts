import { Controller, Param, Patch, Post, Body } from '@nestjs/common';
import { CompanyFollowersService } from './company-followers.service';

@Controller('company-followers')
export class CompanyFollowersController {
    constructor(private readonly followersService: CompanyFollowersService) { }

    @Post('follow/:companyId/:userId')
    async followCompany(
        @Param('companyId') companyId: string,
        @Param('userId') userId: string,
    ) {
        return this.followersService.followCompany(companyId, userId);
    }

    @Post('unfollow/:companyId/:userId')
    async unfollowCompany(
        @Param('companyId') companyId: string,
        @Param('userId') userId: string,
    ) {
        return this.followersService.unfollowCompany(companyId, userId);
    }
}
