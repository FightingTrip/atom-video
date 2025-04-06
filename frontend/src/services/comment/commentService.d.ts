import { VideoComment } from '@/models/Video';
import { PaginatedData } from '@/services/api/types';
import { CreateCommentRequest, UpdateCommentRequest, CommentQueryParams } from './types';
export declare const commentService: {
    getVideoComments(videoId: string, params?: CommentQueryParams): Promise<PaginatedData<VideoComment>>;
    getCommentReplies(commentId: string, params?: CommentQueryParams): Promise<PaginatedData<VideoComment>>;
    createComment(data: CreateCommentRequest): Promise<VideoComment>;
    updateComment(id: string, data: UpdateCommentRequest): Promise<VideoComment>;
    deleteComment(id: string): Promise<void>;
    toggleLike(id: string): Promise<{
        liked: boolean;
        likesCount: number;
    }>;
    getUserComments(userId: string, params?: CommentQueryParams): Promise<PaginatedData<VideoComment>>;
};
