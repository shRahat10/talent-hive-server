import { IsArray, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class ConnectionDto {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    connectedUserIds?: string[];
}
