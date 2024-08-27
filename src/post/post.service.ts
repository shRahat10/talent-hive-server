import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, CreateLikeDto } from '../like-comment/dto/like-comment.dto';
import { CommentService, LikeService } from '../like-comment/like-comment.service';
import { Comments, Likes } from 'src/like-comment/like-comment.schema';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly likeService: LikeService,
        private readonly commentService: CommentService,
    ) { }

    async findAllPost(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async findOnePost(uid: string): Promise<Post> {
        return this.postModel.findOne({ uid }).exec();
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

        await this.likeService.deleteLikesByPostId(post._id.toString());

        await this.commentService.deleteCommentsByPostId(post._id.toString());

        return this.postModel.findOneAndDelete({ uid }).exec();
    }


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
        const deletedLike = await this.likeService.deleteLike(post._id.toString(), likeUid);
        if (deletedLike) {
            post.likesCount -= 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }

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
        const deletedComment = await this.commentService.deleteComment(post._id.toString(), commentUid);
        if (deletedComment) {
            post.commentsCount -= 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }
}