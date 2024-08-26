import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, Like } from './like-comment.schema';
import { CreateCommentDto, CreateLikeDto } from './dto/like-comment.dto';

// Like service
@Injectable()
export class LikeService {
    constructor(
        @InjectModel(Like.name) private likeModel: Model<Like>,
    ) {}

    async addLike(createLikeDto: CreateLikeDto): Promise<Like> {
        const newLike = new this.likeModel(createLikeDto);
        return newLike.save();
    }

    async removeLike(postId: string, uid: string): Promise<Like> {
        return this.likeModel.findOneAndDelete({ postId, uid }).exec();
    }

    async findLikesByPostId(postId: string): Promise<Like[]> {
        return this.likeModel.find({ postId }).exec();
    }
}

// Comment service
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}

    async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        const newComment = new this.commentModel(createCommentDto);
        return newComment.save();
    }

    async removeComment(postId: string, commentId: string): Promise<Comment> {
        return this.commentModel.findOneAndDelete({ _id: commentId, postId }).exec();
    }

    async findCommentsByPostId(postId: string): Promise<Comment[]> {
        return this.commentModel.find({ postId }).exec();
    }
}
