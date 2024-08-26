import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, CreateLikeDto } from 'src/like-comment/dto/like-comment.dto';
import { CommentService, LikeService } from 'src/like-comment/like-comment.service';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly likeService: LikeService,
        private readonly commentService: CommentService,
    ) { }

    // Find all posts
    async findAllPost(): Promise<Post[]> {
        return this.postModel.find().populate('likes').populate('comments').exec();
    }

    // Find a post by UID
    async findOnePost(uid: string): Promise<Post> {
        return this.postModel.findOne({ uid }).populate('likes').populate('comments').exec();
    }

    // Create a new post
    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const newPost = new this.postModel(createPostDto);
        return newPost.save();
    }

    // Update a post by UID
    async updatePost(uid: string, updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postModel.findOneAndUpdate({ uid }, updatePostDto, { new: true }).exec();
    }

    // Delete a post by UID
    async deletePost(uid: string): Promise<Post> {
        return this.postModel.findOneAndDelete({ uid }).exec();
    }

    // Add a like to a post
    async addLike(uid: string, createLikeDto: CreateLikeDto): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        await this.likeService.addLike({ ...createLikeDto, postId: post._id.toString() });
        return this.findOnePost(uid);  
    }

    // Add a comment to a post
    async addComment(uid: string, createCommentDto: CreateCommentDto): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        await this.commentService.addComment({ ...createCommentDto, postId: post._id.toString() });
        return this.findOnePost(uid);  
    }
}
