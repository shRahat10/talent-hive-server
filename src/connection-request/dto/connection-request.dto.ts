import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateConnectionRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    sender: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    receiver: Types.ObjectId;
}
