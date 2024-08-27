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
        return this.postModel.find()
            .populate({ path: 'likes', model: Likes.name })
            .populate({ path: 'comments', model: Comments.name })
            .exec();
    }

    async findOnePost(uid: string): Promise<Post> {
        return this.postModel.findOne({ uid })
            .populate({ path: 'likes', model: Likes.name })
            .populate({ path: 'comments', model: Comments.name })
            .exec();
    }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const newPost = new this.postModel(createPostDto);
        return newPost.save();
    }

    async updatePost(uid: string, updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postModel.findOneAndUpdate({ uid }, updatePostDto, { new: true }).exec();
    }

    async deletePost(uid: string): Promise<Post> {
        return this.postModel.findOneAndDelete({ uid }).exec();
    }

    async addLike(uid: string, createLikeDto: CreateLikeDto): Promise<Post> {
        const post = await this.findOnePost(uid);
        if (!post) {
            throw new Error('Post not found');
        }
        const newLike = await this.likeService.addLike(createLikeDto);
        if (newLike) {
            post.likes.push(newLike._id.toString());
            post.likesCount += 1;
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
            post.comments.push(newComment._id.toString());
            post.commentsCount += 1;
            await post.save();
        }
        return this.findOnePost(uid);
    }    
}