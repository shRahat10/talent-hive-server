import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostModel } from './post.schema';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, CreateShareDto, UpdateCommentDto } from '../post-interaction/dto/post-interaction.dto';
import { Comments, Likes, Saves, Shares } from 'src/post-interaction/post-interaction.schema';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // Post api
    @Get()
    async findAll(@Query('userId') userId: string): Promise<PostModel[]> {
        return this.postService.findAllPost(userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PostModel> {
        return this.postService.findOnePost(id);
    }

    @Post()
    async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
        return this.postService.createPost(createPostDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostModel> {
        return this.postService.updatePost(id, updatePostDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<PostModel> {
        return this.postService.deletePost(id);
    }

    // Like api
    @Get(':id/like')
    async getLike(@Param('id') id: string): Promise<{ likes: Likes[] }> {
        return this.postService.getLike(id);
    }

    @Post(':id/like')
    async addLike(@Param('id') id: string, @Body() createLikeDto: CreateLikeDto): Promise<{ post: PostModel, like: Likes }> {
        return this.postService.addLike(id, createLikeDto);
    }

    @Delete(':id/like/:likeId')
    async deleteLike(@Param('id') id: string, @Param('likeId') likeId: string): Promise<{ post: PostModel, like: Likes }> {
        return this.postService.deleteLike(id, likeId);
    }

    // Comment api
    @Get(':id/comment')
    async getComment(
        @Param('id') id: string,
        @Query('skip') skip: number,
        @Query('limit') limit: number
    ): Promise<{ comments: Comments[] }> {
        return this.postService.getComment(id, skip, limit);
    }

    @Post(':id/comment')
    async addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto): Promise<{ post: PostModel, comment: Comments }> {
        return this.postService.addComment(id, createCommentDto);
    }

    @Patch(':id/comment/:commentId')
    async updateComment(@Param('id') id: string, @Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto): Promise<{ post: PostModel, comment: Comments }> {
        return this.postService.updateComment(id, commentId, updateCommentDto);
    }

    @Delete(':id/comment/:commentId')
    async deleteComment(@Param('id') id: string, @Param('commentId') commentId: string): Promise<{ post: PostModel, comment: Comments }> {
        return this.postService.deleteComment(id, commentId);
    }

    // Share api
    @Get(':id/share')
    async getShare(@Param('id') id: string): Promise<{ shares: Shares[] }> {
        return this.postService.getShare(id);
    }

    @Post(':id/share')
    async addShare(@Param('id') id: string, @Body() createShareDto: CreateShareDto): Promise<{ post: PostModel, share: Shares }> {
        return this.postService.addShare(id, createShareDto);
    }

    @Delete(':id/share/:shareId')
    async deleteShare(@Param('id') id: string, @Param('shareId') shareId: string): Promise<{ post: PostModel, share: Shares }> {
        return this.postService.deleteShare(id, shareId);
    }

    // Save api
    @Get(':id/save')
    async getSave(@Param('id') id: string): Promise<{ saves: Saves[] }> {
        return this.postService.getSave(id);
    }

    @Post(':id/save')
    async addSave(@Param('id') id: string, @Body() createSaveDto: CreateSaveDto): Promise<{ post: PostModel, save: Saves }> {
        return this.postService.addSave(id, createSaveDto);
    }

    @Delete(':id/save/:saveId')
    async deleteSave(@Param('id') id: string, @Param('saveId') saveId: string): Promise<{ post: PostModel, save: Saves }> {
        return this.postService.deleteSave(id, saveId);
    }
}
