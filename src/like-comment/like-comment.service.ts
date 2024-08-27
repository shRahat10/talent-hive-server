import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, Likes } from './like-comment.schema';
import { CreateCommentDto, CreateLikeDto } from './dto/like-comment.dto';

@Injectable()
export class LikeService {
    constructor(
        @InjectModel(Likes.name) private likeModel: Model<Likes>,
    ) { }

    async addLike(createLikeDto: CreateLikeDto): Promise<Likes> {
        const newLike = new this.likeModel(createLikeDto);
        return newLike.save();
    }

    async deleteLike(postId: string, uid: string): Promise<Likes | null> {
        return this.likeModel.findOneAndDelete({ postId, uid }).exec();
    }

    async deleteLikesByPostId(postId: string): Promise<void> {
        await this.likeModel.deleteMany({ postId }).exec();
    }

    async findLikesByPostId(postId: string): Promise<Likes[]> {
        return this.likeModel.find({ postId }).exec();
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

    async deleteComment(postId: string, uid: string): Promise<Comments | null> {
        return this.commentModel.findOneAndDelete({ postId, uid }).exec();
    }

    async deleteCommentsByPostId(postId: string): Promise<void> {
        await this.commentModel.deleteMany({ postId }).exec();
    }

    async findCommentsByPostId(postId: string): Promise<Comments[]> {
        return this.commentModel.find({ postId }).exec();
    }
}