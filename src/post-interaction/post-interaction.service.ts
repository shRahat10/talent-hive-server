import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, Likes, Saves, Shares } from './post-interaction.schema';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, CreateShareDto } from './dto/post-interaction.dto';

@Injectable()
export class LikeService {
    constructor(
        @InjectModel(Likes.name) private likeModel: Model<Likes>,
    ) { }

    async addLike(createLikeDto: CreateLikeDto): Promise<Likes> {
        const newLike = new this.likeModel(createLikeDto);
        return newLike.save();
    }

    async deleteLike(postUid: string, uid: string): Promise<Likes | null> {
        return this.likeModel.findOneAndDelete({ postUid, uid }).exec();
    }

    async deleteLikesBypostUid(postUid: string): Promise<void> {
        await this.likeModel.deleteMany({ postUid }).exec();
    }

    async findLikesBypostUid(postUid: string): Promise<Likes[]> {
        return this.likeModel.find({ postUid }).exec();
    }
}

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comments.name) private commentModel: Model<Comments>,
    ) { }

    async addComment(createCommentDto: CreateCommentDto): Promise<Comments> {
        const newComment = new this.commentModel(createCommentDto);
        return newComment.save();
    }

    async deleteComment(postUid: string, uid: string): Promise<Comments | null> {
        return this.commentModel.findOneAndDelete({ postUid, uid }).exec();
    }

    async deleteCommentsBypostUid(postUid: string): Promise<void> {
        await this.commentModel.deleteMany({ postUid }).exec();
    }

    async findCommentsBypostUid(postUid: string): Promise<Comments[]> {
        return this.commentModel.find({ postUid }).exec();
    }
}

@Injectable()
export class ShareService {
    constructor(
        @InjectModel(Shares.name) private shareModel: Model<Shares>,
    ) { }

    async addShare(createShareDto: CreateShareDto): Promise<Shares> {
        const newShare = new this.shareModel(createShareDto);
        return newShare.save();
    }

    async deleteShare(uid: string, postUid: string): Promise<Shares | null> {
        return this.shareModel.findOneAndDelete({ uid, postUid }).exec();
    }

    async findSharesBypostUid(postUid: string): Promise<Shares[]> {
        return this.shareModel.find({ postUid }).exec();
    }
}

@Injectable()
export class SaveService {
    constructor(
        @InjectModel(Saves.name) private saveModel: Model<Saves>,
    ) { }

    async addSave(createSaveDto: CreateSaveDto): Promise<Saves> {
        const newSave = new this.saveModel(createSaveDto);
        return newSave.save();
    }

    async deleteSave(uid: string, postUid: string): Promise<Saves | null> {
        return this.saveModel.findOneAndDelete({ uid, postUid }).exec();
    }

    async findSavesBypostUid(postUid: string): Promise<Saves[]> {
        return this.saveModel.find({ postUid }).exec();
    }
}