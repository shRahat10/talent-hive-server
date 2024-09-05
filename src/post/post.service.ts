import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, CreateShareDto, UpdateCommentDto } from '../post-interaction/dto/post-interaction.dto';
import { CommentService, LikeService, SaveService, ShareService } from '../post-interaction/post-interaction.service';
import { Comments, Likes, Saves, Shares } from 'src/post-interaction/post-interaction.schema';

export interface PostWithLikes extends Post {
    isLiked: boolean;
}

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly likeService: LikeService,
        private readonly commentService: CommentService,
        private readonly shareService: ShareService,
        private readonly saveService: SaveService,
    ) { }

    async findAllPost(userId: string): Promise<PostWithLikes[]> {
        const posts = await this.postModel
            .find()
            .populate('userId', '-password -__v')
            .sort({ createdAt: -1, _id: -1 })
            .exec();

        const postWithIsLiked = await Promise.all(
            posts.map(async (post) => {
                const likes = await this.likeService.findLikesByPostId(post._id.toString());
                const isLiked = likes.some(like => like.userId._id.toString() === userId);

                return { ...post.toObject(), isLiked } as PostWithLikes;
            })
        );

        return postWithIsLiked;
    }

    // finds post for rest of the api
    async findOnePost(id: string): Promise<Post> {
        return this.postModel.findById(id).populate('userId', '-password -__v').exec();
    }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const newPost = new this.postModel(createPostDto);
        const savedPost = await newPost.save();
        return await this.postModel.findById(savedPost._id).populate('userId', '-password -__v').exec();
    }

    async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).populate('userId', '-password -__v').exec();
    }

    async deletePost(id: string): Promise<Post> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }

        await this.likeService.deleteLikesByPostId(id);
        await this.commentService.deleteCommentsByPostId(id);

        return this.postModel.findByIdAndDelete(id).exec();
    }

    // Like
    async getLike(id: string): Promise<{ likes: Likes[] }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const likes = await this.likeService.findLikesByPostId(id);
        return { likes };
    }

    async addLike(id: string, createLikeDto: CreateLikeDto): Promise<{ post: Post, like: Likes }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const newLike = await this.likeService.addLike(createLikeDto);
        if (newLike) {
            post.likesCount += 1;
            await post.save();
        }
        return { post, like: newLike };
    }

    async deleteLike(id: string, likeId: string): Promise<{ post: Post, like: Likes }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedLike = await this.likeService.deleteLike(id, likeId);
        if (deletedLike) {
            post.likesCount -= 1;
            await post.save();
        }
        return { post, like: deletedLike };
    }

    // Comment
    async getComment(id: string, skip = 0, limit = 5): Promise<{ comments: Comments[] }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const comments = await this.commentService.findCommentsByPostId(id, skip, limit);
        return { comments };
    }

    async addComment(id: string, createCommentDto: CreateCommentDto): Promise<{ post: Post, comment: Comments }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const newComment = await this.commentService.addComment(createCommentDto);
        if (newComment) {
            post.commentsCount += 1;
            await post.save();
        }
        return { post, comment: newComment };
    }

    async updateComment(id: string, commentId: string, updateCommentDto: UpdateCommentDto): Promise<{ post: Post, comment: Comments }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }

        const updatedComment = await this.commentService.updateComment(commentId, updateCommentDto);
        if (!updatedComment) {
            throw new Error('Comment not found or failed to update');
        }

        return { post, comment: updatedComment };
    }

    async deleteComment(id: string, commentId: string): Promise<{ post: Post, comment: Comments }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedComment = await this.commentService.deleteComment(id, commentId);
        if (deletedComment) {
            post.commentsCount -= 1;
            await post.save();
        }
        return { post, comment: deletedComment };
    }

    // Share
    async getShare(id: string): Promise<{ shares: Shares[] }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const shares = await this.shareService.findSharesByPostId(id);
        return { shares };
    }

    async addShare(id: string, createShareDto: CreateShareDto): Promise<{ post: Post, share: Shares }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const newShare = await this.shareService.addShare(createShareDto);
        if (newShare) {
            post.sharesCount += 1;
            await post.save();
        }
        return { post, share: newShare };
    }

    async deleteShare(id: string, shareId: string): Promise<{ post: Post, share: Shares }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedShare = await this.shareService.deleteShare(shareId, id);
        if (deletedShare) {
            post.sharesCount -= 1;
            await post.save();
        }
        return { post, share: deletedShare };
    }

    // Save
    async getSave(id: string): Promise<{ saves: Saves[] }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const saves = await this.saveService.findSavesByPostId(id);
        return { saves };
    }

    async addSave(id: string, createSaveDto: CreateSaveDto): Promise<{ post: Post, save: Saves }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const newSave = await this.saveService.addSave(createSaveDto);
        if (newSave) {
            await post.save();
        }
        return { post, save: newSave };
    }

    async deleteSave(id: string, saveId: string): Promise<{ post: Post, save: Saves }> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }
        const deletedSave = await this.saveService.deleteSave(saveId, id);
        if (deletedSave) {
            await post.save();
        }
        return { post, save: deletedSave };
    }
}