import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostModel } from './post.schema';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, CreateShareDto } from '../post-interaction/dto/post-interaction.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // Post api
    @Get()
    async findAll(): Promise<PostModel[]> {
        return this.postService.findAllPost();
    }

    @Get(':uid')
    async findOne(@Param('uid') uid: string): Promise<PostModel> {
        return this.postService.findOnePost(uid);
    }

    @Post()
    async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
        return this.postService.createPost(createPostDto);
    }

    @Put(':uid')
    async update(@Param('uid') uid: string, @Body() updatePostDto: UpdatePostDto): Promise<PostModel> {
        return this.postService.updatePost(uid, updatePostDto);
    }

    @Delete(':uid')
    async delete(@Param('uid') uid: string): Promise<PostModel> {
        return this.postService.deletePost(uid);
    }

    // Like api
    @Post(':uid/like')
    async addLike(@Param('uid') uid: string, @Body() createLikeDto: CreateLikeDto): Promise<PostModel> {
        return this.postService.addLike(uid, createLikeDto);
    }

    @Delete(':uid/like/:likeUid')
    async deleteLike(@Param('uid') uid: string, @Param('likeUid') likeUid: string) {
        return this.postService.deleteLike(uid, likeUid);
    }

    // Comment api
    @Post(':uid/comment')
    async addComment(@Param('uid') uid: string, @Body() createCommentDto: CreateCommentDto): Promise<PostModel> {
        return this.postService.addComment(uid, createCommentDto);
    }

    @Delete(':uid/comment/:commentUid')
    async deleteComment(@Param('uid') uid: string, @Param('commentUid') commentUid: string) {
        return this.postService.deleteComment(uid, commentUid);
    }

    // Share api
    @Post(':uid/share')
    async addShare(@Param('uid') uid: string, @Body() createShareDto: CreateShareDto): Promise<PostModel> {
        return this.postService.addShare(uid, createShareDto);
    }

    @Delete(':uid/share/:shareUid')
    async deleteShare(@Param('uid') uid: string, @Param('shareUid') shareUid: string) {
        return this.postService.deleteShare(uid, shareUid);
    }

    // Save api
    @Post(':uid/save')
    async addSave(@Param('uid') uid: string, @Body() createSaveDto: CreateSaveDto): Promise<PostModel> {
        return this.postService.addSave(uid, createSaveDto);
    }

    @Delete(':uid/save/:saveUid')
    async deleteSave(@Param('uid') uid: string, @Param('saveUid') saveUid: string) {
        return this.postService.deleteSave(uid, saveUid);
    }
}
