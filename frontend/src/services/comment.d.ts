import type { Comment, Reply, CommentService } from '@/types';
declare class CommentServiceImpl implements CommentService {
    getComments(videoId: string, page?: number, limit?: number): Promise<{
        comments: Comment[];
        hasMore: boolean;
    }>;
    getReplies(commentId: string, page?: number, limit?: number): Promise<{
        replies: Reply[];
        hasMore: boolean;
    }>;
    addComment(videoId: string, content: string): Promise<Comment>;
    addReply(commentId: string, content: string): Promise<Reply>;
    likeComment(commentId: string): Promise<boolean>;
    likeReply(replyId: string): Promise<boolean>;
}
export declare const commentService: CommentServiceImpl;
export {};
