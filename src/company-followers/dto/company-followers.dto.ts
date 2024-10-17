import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyFollowerDto {
    @IsNotEmpty()
    @IsString()
    companyId: string;

    @IsArray()
    @IsString({ each: true })
    followerIds: string[];
}

export class UpdateCompanyFollowerDto extends PartialType(CreateCompanyFollowerDto) { }