import { IsString, IsNumber, IsArray, IsOptional, IsNotEmpty, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePostDto {
    @IsString()
    uid: string;

    @IsString()
    userId: string;

    @IsString()
    content: string;

    @IsArray()
    @IsString({ each: true })
    media: string[];

    @IsString()
    timestamp: string;

    @IsOptional()
    @IsNumber()
    likes?: number;

    @IsOptional()
    @IsNumber()
    comments?: number;

    @IsOptional()
    @IsNumber()
    shares?: number;
}


export class UpdatePostDto extends PartialType(CreatePostDto) { }
