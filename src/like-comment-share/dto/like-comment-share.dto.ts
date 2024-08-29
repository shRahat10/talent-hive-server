import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
    @IsString()
    @IsNotEmpty()
    userUid: string;

    @IsString()
    @IsNotEmpty()
    postUid: string;
}

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    userUid: string;

    @IsString()
    @IsNotEmpty()
    postUid: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
}

export class CreateShareDto {
    @IsString()
    @IsNotEmpty()
    userUid: string;

    @IsString()
    @IsNotEmpty()
    postUid: string;
}
