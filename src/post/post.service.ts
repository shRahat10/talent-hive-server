import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, CreateLikeDto, CreateShareDto } from '../post-interaction/dto/post-interaction.dto';
import { CommentService, LikeService, ShareService } from '../post-interaction/post-interaction.service';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly likeService: LikeService,
        private readonly commentService: CommentService,
        private readonly shareService: ShareService,
    ) { }

    async findAllPost(): Promise<Post[]> {
        return this.postModel.find().populate('userId', '-password -__v').exec();
    }

    async findOnePost(uid: string): Promise<Post> {
        return this.postModel.findOne({ uid }).populate('userId', '-password -__v').exec();
    }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const newPost = new this.postModel(createPostDto);
        return newPost.save();
    }

    async updatePost(uid: string, updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postModel.findOneAndUpdate({ uid }, updatePostDto, { new: true }).exec();
    }

    async deletePost(uid: string): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }

        // Ensure the correct postUid is passed
        await this.likeService.deleteLikesBypostUid(uid);
        await this.commentService.deleteCommentsBypostUid(uid);

        return this.postModel.findOneAndDelete({ uid }).exec();
    }

    // Like
    async addLike(uid: string, createLikeDto: CreateLikeDto): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const newLike = await this.likeService.addLike(createLikeDto);
        if (newLike) {
            post.likesCount += 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }

    async deleteLike(uid: string, likeUid: string): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedLike = await this.likeService.deleteLike(uid, likeUid);
        if (deletedLike) {
            post.likesCount -= 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }

    // Comment
    async addComment(uid: string, createCommentDto: CreateCommentDto): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const newComment = await this.commentService.addComment(createCommentDto);
        if (newComment) {
            post.commentsCount += 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }

    async deleteComment(uid: string, commentUid: string): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedComment = await this.commentService.deleteComment(uid, commentUid);
        if (deletedComment) {
            post.commentsCount -= 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }

    // Share
    async addShare(uid: string, createShareDto: CreateShareDto): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const newShare = await this.shareService.addShare(createShareDto);
        if (newShare) {
            post.sharesCount += 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }

    async deleteShare(uid: string, shareUid: string): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedShare = await this.shareService.deleteShare(shareUid, uid);
        if (deletedShare) {
            post.sharesCount -= 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }
}