import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, Allow } from 'class-validator';

// Like
export class CreateLikeDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;
}

// Comment
export class CreateCommentDto {
    @Allow()
    _id?: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
}
export class UpdateCommentDto extends PartialType(CreateCommentDto) { }

// Share
// export class CreateShareDto {
//     @IsString()
//     @IsNotEmpty()
//     userId: string;

//     @IsString()
//     @IsNotEmpty()
//     postId: string;

//     @IsString()
//     content: string;
// }

// Save
export class CreateSaveDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;
}
