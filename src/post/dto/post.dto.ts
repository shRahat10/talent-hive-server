import { IsString, IsArray, IsOptional, ValidateNested, IsDate, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto, CreateLikeDto } from 'src/post-interaction/dto/post-interaction.dto';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsString()
    sharedPostId: string;

    @IsString()
    content: string;

    @IsOptional()
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
}


export class UpdatePostDto extends PartialType(CreatePostDto) { }
