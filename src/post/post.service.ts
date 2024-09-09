import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { CreateCommentDto, CreateLikeDto, CreateSaveDto, UpdateCommentDto } from '../post-interaction/dto/post-interaction.dto';
import { CommentService, LikeService, SaveService } from '../post-interaction/post-interaction.service';
import { Comments, Likes, Saves } from 'src/post-interaction/post-interaction.schema';

export interface PostWithInteractions extends Post {
    isLiked: boolean;
    likeId?: string;
    isSaved: boolean;
    saveId?: string;
}

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly likeService: LikeService,
        private readonly commentService: CommentService,
        private readonly saveService: SaveService,
    ) { }

    async findAllPost(userId: string, page: number, limit: number): Promise<PostWithInteractions[]> {
        const skip = page * limit;

        const posts = await this.postModel
            .find()
            .populate('userId', '-password -__v')
            .populate({
                path: 'sharedPostId',
                model: Post.name,
                populate: { path: 'userId', select: '-password -__v' }
            })
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        // TODO: use aggregate
        const postWithIsLikedAndSaved = await Promise.all(
            posts.map(async (post) => {
                // isLiked
                const likes = await this.likeService.findLikesByPostId(post._id.toString());
                const userLike = likes.find(like => like.userId._id.toString() === userId);
                const isLiked = !!userLike;
                const likeId = isLiked ? userLike._id.toString() : null;

                // isSaved
                const saves = await this.saveService.findSavesByPostId(post._id.toString());
                const userSave = saves.find(save => save.userId._id.toString() === userId);
                const isSaved = !!userSave;
                const saveId = isSaved ? userSave._id.toString() : null;

                return { ...post.toObject(), isLiked, likeId, isSaved, saveId } as PostWithInteractions;
            })
        );

        return postWithIsLikedAndSaved;
    }

    async findPostByPostAndUser(id: string, userId: string): Promise<PostWithInteractions> {
        const post = await this.postModel
            .findById(id)
            .populate('userId', '-password -__v')
            .populate({
                path: 'sharedPostId',
                model: Post.name,
                populate: { path: 'userId', select: '-password -__v' }
            })
            .exec();

        if (!post) {
            throw new Error("Post not found");
        }

        // isLiked
        const likes = await this.likeService.findLikesByPostId(post._id.toString());
        const userLike = likes.find(like => like.userId._id.toString() === userId);
        const isLiked = !!userLike;
        const likeId = isLiked ? userLike._id.toString() : null;

        // isSaved
        const saves = await this.saveService.findSavesByPostId(post._id.toString());
        const userSave = saves.find(save => save.userId._id.toString() === userId);
        const isSaved = !!userSave;
        const saveId = isSaved ? userSave._id.toString() : null;

        return { ...post.toObject(), isLiked, likeId, isSaved, saveId } as PostWithInteractions;
    }

    // finds post for rest of the api
    async findOnePost(id: string): Promise<Post> {
        return this.postModel
            .findById(id)
            .populate('userId', '-password -__v')
            .populate({
                path: 'sharedPostId',
                model: Post.name,
                populate: { path: 'userId', select: '-password -__v' }
            })
            .exec();
    }

    async findPostShares(postId: string, excludeIds: string[]): Promise<Post[]> {
        return this.postModel
            .find({ sharedPostId: postId, _id: { $nin: excludeIds } })
            .populate('userId', '-password -__v')
            .populate({
                path: 'sharedPostId',
                model: Post.name,
                populate: { path: 'userId', select: '-password -__v' }
            })
            .exec();
    }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const { sharedPostId } = createPostDto;

        const newPost = new this.postModel(createPostDto);
        const savedPost = await newPost.save();

        if (sharedPostId) {
            await this.postModel.findByIdAndUpdate(sharedPostId, { $inc: { sharesCount: 1 } })
        }

        return await this.postModel
            .findById(savedPost._id)
            .populate('userId', '-password -__v')
            .populate({
                path: 'sharedPostId',
                populate: { path: 'userId', select: '-password -__v' }
            })
            .exec();
    }

    async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate('userId', '-password -__v')
            .exec();
    }

    async deletePost(id: string): Promise<Post> {
        const post = await this.findOnePost(id);
        if (!post) {
            throw new Error('Post not found');
        }

        if (post.sharedPostId) {
            await this.postModel.findByIdAndUpdate(post.sharedPostId, { $inc: { sharesCount: -1 } }).exec();
        }

        await this.likeService.deleteLikesByPostId(id);
        await this.commentService.deleteCommentsByPostId(id);

        return this.postModel
            .findByIdAndDelete(id)
            .populate({
                path: 'sharedPostId',
                populate: { path: 'userId', select: '-password -__v' }
            })
            .exec();
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
        const deletedSave = await this.saveService.deleteSave(id, saveId);
        if (deletedSave) {
            await post.save();
        }
        return { post, save: deletedSave };
    }
}
