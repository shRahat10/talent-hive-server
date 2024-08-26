import { IsString, IsArray, IsOptional, ValidateNested, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto, CreateLikeDto } from 'src/like-comment/dto/like-comment.dto';

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

    @IsOptional()
    @IsDate()
    timestamp?: Date;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateLikeDto)
    @IsArray()
    likes?: CreateLikeDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateCommentDto)
    @IsArray()
    comments?: CreateCommentDto[];

    @IsOptional()
    @IsNumber()
    shares?: number;
}


export class UpdatePostDto extends PartialType(CreatePostDto) { }
