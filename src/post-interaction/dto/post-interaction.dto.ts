import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postUid: string;
}

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

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
    userId: string;

    @IsString()
    @IsNotEmpty()
    postUid: string;
}

export class CreateSaveDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postUid: string;
}
