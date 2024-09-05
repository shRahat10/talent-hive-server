import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, Likes, Saves, Shares } from './post-interaction.schema';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, CreateShareDto, UpdateCommentDto } from './dto/post-interaction.dto';

// Like
@Injectable()
export class LikeService {
    constructor(
        @InjectModel(Likes.name) private likeModel: Model<Likes>,
    ) { }

    async addLike(createLikeDto: CreateLikeDto): Promise<Likes> {
        const { userId, postId } = createLikeDto;
        const existingLike = await this.likeModel.findOne({ userId, postId }).exec();
        if (existingLike) {
            throw new Error('User has already liked this post');
        }

        const newLike = new this.likeModel(createLikeDto);
        const savedLike = await newLike.save();
        return this.likeModel.findById(savedLike._id).populate('userId', '-password -__v').exec();
    }

    async deleteLike(id: string, postId: string): Promise<Likes | null> {
        return this.likeModel.findByIdAndDelete(id, { postId }).exec();
    }

    async deleteLikesByPostId(postId: string): Promise<void> {
        await this.likeModel.deleteMany({ postId }).exec();
    }

    async findLikesByPostId(postId: string): Promise<Likes[]> {
        return this.likeModel.find({ postId }).populate('userId', '-password -__v').exec();
    }    
}

// Comment
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comments.name) private commentModel: Model<Comments>,
    ) { }

    async addComment(createCommentDto: CreateCommentDto): Promise<Comments> {
        const newComment = new this.commentModel(createCommentDto);
        const savedComment = await newComment.save();
        return this.commentModel.findById(savedComment._id).populate('userId', '-password -__v').exec();
    }

    async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<Comments | null> {
        return this.commentModel.findByIdAndUpdate(id, { $set: updateCommentDto }, { new: true }).populate('userId', '-password -__v').exec();
    }

    async deleteComment(postId: string, id: string): Promise<Comments | null> {
        return this.commentModel.findByIdAndDelete(id, { postId }).exec();
    }

    async deleteCommentsByPostId(postId: string): Promise<void> {
        await this.commentModel.deleteMany({ postId }).exec();
    }

    async findCommentsByPostId(postId: string, skip = 0, limit = 5): Promise<Comments[]> {
        return this.commentModel.find({ postId })
            .populate('userId', '-password -__v')
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
}

// Share
@Injectable()
export class ShareService {
    constructor(
        @InjectModel(Shares.name) private shareModel: Model<Shares>,
    ) { }

    async addShare(createShareDto: CreateShareDto): Promise<Shares> {
        const newShare = new this.shareModel(createShareDto);
        const savedShare = await newShare.save();
        return this.shareModel.findById(savedShare._id).populate('userId', '-password -__v').exec();
    }

    async deleteShare(id: string, postId: string): Promise<Shares | null> {
        return this.shareModel.findByIdAndDelete(id, { postId }).exec();
    }

    async findSharesByPostId(postId: string): Promise<Shares[]> {
        return this.shareModel.find({ postId }).populate('userId', '-password -__v').exec();
    }
}

// Save
@Injectable()
export class SaveService {
    constructor(
        @InjectModel(Saves.name) private saveModel: Model<Saves>,
    ) { }

    async addSave(createSaveDto: CreateSaveDto): Promise<Saves> {
        const newSave = new this.saveModel(createSaveDto);
        const savedSave = await newSave.save();
        return this.saveModel.findById(savedSave._id).populate('userId', '-password -__v').exec();
    }

    async deleteSave(id: string, postId: string): Promise<Saves | null> {
        return this.saveModel.findByIdAndDelete(id, { postId }).exec();
    }

    async findSavesByPostId(postId: string): Promise<Saves[]> {
        return this.saveModel.find({ postId }).populate('userId', '-password -__v').exec();
    }
}