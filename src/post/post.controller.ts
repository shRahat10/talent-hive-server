import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostModel } from './post.schema';
import { CreateCommentDto, CreateLikeDto, CreateShareDto } from '../post-interaction/dto/post-interaction.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // Get all posts
    @Get()
    async findAll(): Promise<PostModel[]> {
        return this.postService.findAllPost();
    }

    // Get a post by UID
    @Get(':uid')
    async findOne(@Param('uid') uid: string): Promise<PostModel> {
        return this.postService.findOnePost(uid);
    }

    // Create a new post
    @Post()
    async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
        return this.postService.createPost(createPostDto);
    }

    // Update a post by UID
    @Put(':uid')
    async update(@Param('uid') uid: string, @Body() updatePostDto: UpdatePostDto): Promise<PostModel> {
        return this.postService.updatePost(uid, updatePostDto);
    }

    // Delete a post by UID
    @Delete(':uid')
    async delete(@Param('uid') uid: string): Promise<PostModel> {
        return this.postService.deletePost(uid);
    }

    // Add a like to a post
    @Post(':uid/like')
    async addLike(@Param('uid') uid: string, @Body() createLikeDto: CreateLikeDto): Promise<PostModel> {
        return this.postService.addLike(uid, createLikeDto);
    }

    // Delete a like on a post
    @Delete(':uid/like/:likeUid')
    async deleteLike(@Param('uid') uid: string, @Param('likeUid') likeUid: string) {
        return this.postService.deleteLike(uid, likeUid);
    }

    // Add a comment to a post
    @Post(':uid/comment')
    async addComment(@Param('uid') uid: string, @Body() createCommentDto: CreateCommentDto): Promise<PostModel> {
        return this.postService.addComment(uid, createCommentDto);
    }

    // Delete a comment on a post
    @Delete(':uid/comment/:commentUid')
    async deleteComment(@Param('uid') uid: string, @Param('commentUid') commentUid: string) {
        return this.postService.deleteComment(uid, commentUid);
    }

    // Share post
    @Post(':uid/share')
    async addShare(@Param('uid') uid: string, @Body() createShareDto: CreateShareDto): Promise<PostModel> {
        return this.postService.addShare(uid, createShareDto);
    }

    // Delete share post
    @Delete(':uid/share/:shareUid')
    async deleteShare(@Param('uid') uid: string, @Param('shareUid') shareUid: string) {
        return this.postService.deleteShare(uid, shareUid);
    }
}
