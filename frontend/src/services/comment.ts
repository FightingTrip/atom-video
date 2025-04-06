import { http } from '@/utils/http';
import type { Comment, Reply, CommentService } from '@/types';

class CommentServiceImpl implements CommentService {
  async getComments(
    videoId: string,
    page = 1,
    limit = 20
  ): Promise<{
    comments: Comment[];
    hasMore: boolean;
  }> {
    const { data } = await http.get(`/api/videos/${videoId}/comments`, {
      params: { page, limit },
    });
    return data;
  }

  async getReplies(
    commentId: string,
    page = 1,
    limit = 20
  ): Promise<{
    replies: Reply[];
    hasMore: boolean;
  }> {
    const { data } = await http.get(`/api/comments/${commentId}/replies`, {
      params: { page, limit },
    });
    return data;
  }

  async addComment(videoId: string, content: string): Promise<Comment> {
    const { data } = await http.post(`/api/videos/${videoId}/comments`, {
      content,
    });
    return data;
  }

  async addReply(commentId: string, content: string): Promise<Reply> {
    const { data } = await http.post(`/api/comments/${commentId}/replies`, {
      content,
    });
    return data;
  }

  async likeComment(commentId: string): Promise<boolean> {
    const { data } = await http.post(`/api/comments/${commentId}/like`);
    return data;
  }

  async likeReply(replyId: string): Promise<boolean> {
    const { data } = await http.post(`/api/replies/${replyId}/like`);
    return data;
  }
}

export const commentService = new CommentServiceImpl();
