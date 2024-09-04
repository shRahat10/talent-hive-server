import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostModel } from './post.schema';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, CreateShareDto } from '../post-interaction/dto/post-interaction.dto';
import { Comments, Likes, Saves, Shares } from 'src/post-interaction/post-interaction.schema';

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
    @Get(':uid/like')
    async getLike(@Param('uid') uid: string): Promise<{ likes: Likes[] }> {
        return this.postService.getLike(uid);
    }

    @Post(':uid/like')
    async addLike(@Param('uid') uid: string, @Body() createLikeDto: CreateLikeDto): Promise<{ like: Likes }> {
        return this.postService.addLike(uid, createLikeDto);
    }

    @Delete(':uid/like/:likeUid')
    async deleteLike(@Param('uid') uid: string, @Param('likeUid') likeUid: string): Promise<{ like: Likes }> {
        return this.postService.deleteLike(uid, likeUid);
    }

    // Comment api
    @Get(':uid/comment')
    async getComment(
        @Param('uid') uid: string,
        @Query('skip') skip: number,
        @Query('limit') limit: number
    ): Promise<{ comments: Comments[] }> {
        return this.postService.getComment(uid, skip, limit);
    }

    @Post(':uid/comment')
    async addComment(@Param('uid') uid: string, @Body() createCommentDto: CreateCommentDto): Promise<{ comment: Comments }> {
        return this.postService.addComment(uid, createCommentDto);
    }

    @Delete(':uid/comment/:commentUid')
    async deleteComment(@Param('uid') uid: string, @Param('commentUid') commentUid: string): Promise<{ comment: Comments }> {
        return this.postService.deleteComment(uid, commentUid);
    }

    // Share api
    @Get(':uid/share')
    async getShare(@Param('uid') uid: string): Promise<{ shares: Shares[] }> {
        return this.postService.getShare(uid);
    }

    @Post(':uid/share')
    async addShare(@Param('uid') uid: string, @Body() createShareDto: CreateShareDto): Promise<{ share: Shares }> {
        return this.postService.addShare(uid, createShareDto);
    }

    @Delete(':uid/share/:shareUid')
    async deleteShare(@Param('uid') uid: string, @Param('shareUid') shareUid: string): Promise<{ share: Shares }> {
        return this.postService.deleteShare(uid, shareUid);
    }

    // Save api
    @Get(':uid/save')
    async getSave(@Param('uid') uid: string): Promise<{ saves: Saves[] }> {
        return this.postService.getSave(uid);
    }

    @Post(':uid/save')
    async addSave(@Param('uid') uid: string, @Body() createSaveDto: CreateSaveDto): Promise<{ save: Saves }> {
        return this.postService.addSave(uid, createSaveDto);
    }

    @Delete(':uid/save/:saveUid')
    async deleteSave(@Param('uid') uid: string, @Param('saveUid') saveUid: string): Promise<{ save: Saves }> {
        return this.postService.deleteSave(uid, saveUid);
    }
}
