import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
    ) { }

    // Find all post
    async findAllPost(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    // Find a post by ID
    async findOnePost(uid: string): Promise<Post> {
        return this.postModel.findOne({ uid }).exec();
    }

    // Create a new post
    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const newPost = new this.postModel(createPostDto);
        return newPost.save();
    }

    // Update a post by ID
    async updatePost(uid: string, updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postModel.findOneAndUpdate({ uid }, updatePostDto, { new: true }).exec();
    }

    // Delete a post by ID
    async deletePost(uid: string): Promise<Post> {
        return this.postModel.findOneAndDelete({ uid }).exec();
    }
}
