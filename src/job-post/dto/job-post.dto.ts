import { IsString, IsArray, IsOptional, IsNotEmpty, ValidateNested, IsMongoId, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class AboutDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    educationalRequirements: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    experienceRequirements: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    additionalRequirements: string[];
}

class ApplicantDto {
    @IsMongoId()
    @IsNotEmpty()
    applicantId: string;
}

export class CreateJobPostDto {
    @IsMongoId()
    @IsNotEmpty()
    companyId: string;

    @IsString()
    @IsNotEmpty()
    jobTitle: string;

    @IsString()
    @IsNotEmpty()
    position: string;

    @IsString()
    @IsNotEmpty()
    workplaceType: string;

    @IsString()
    @IsNotEmpty()
    jobLocation: string;

    @IsString()
    @IsNotEmpty()
    jobType: string;

    @ValidateNested()
    @Type(() => AboutDto)
    @IsNotEmpty()
    about: AboutDto;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ApplicantDto)
    @IsArray()
    applicants?: ApplicantDto[];

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}

export class UpdateJobPostDto extends PartialType(CreateJobPostDto) { }
