import { PartialType } from "@nestjs/mapped-types";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    employerId: string;

    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    companyEmail: string;

    @IsOptional()
    @IsString()
    companyProfileImage: string;

    @IsOptional()
    @IsString()
    companyCoverImage: string;

    @IsOptional()
    @IsNumber()
    companyContactNumber: number;

    @IsOptional()
    @IsString()
    companyDescription: string;

    @IsOptional()
    @IsString()
    facebookLink: string;

    @IsOptional()
    @IsString()
    linkedInLink: string;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}


export class UpdateCompanyDto extends PartialType(CreateCompanyDto) { }