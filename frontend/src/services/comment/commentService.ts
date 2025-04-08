import { apiClient, apiRequest } from '@/services/api/client';
import { VideoComment } from '@/models/Video';
import { PaginatedData } from '@/services/api/types';
import { CreateCommentRequest, UpdateCommentRequest, CommentQueryParams } from './types';

export const commentService = {
  // 获取视频评论
  async getVideoComments(
    videoId: string,
    params?: CommentQueryParams
  ): Promise<PaginatedData<VideoComment>> {
    return apiRequest(
      apiClient.get<PaginatedData<VideoComment>>(`/videos/${videoId}/comments`, { params })
    );
  },

  // 获取评论回复
  async getCommentReplies(
    commentId: string,
    params?: CommentQueryParams
  ): Promise<PaginatedData<VideoComment>> {
    return apiRequest(
      apiClient.get<PaginatedData<VideoComment>>(`/comments/${commentId}/replies`, { params })
    );
  },

  // 创建评论
  async createComment(data: CreateCommentRequest): Promise<VideoComment> {
    return apiRequest(apiClient.post<VideoComment>('/comments', data));
  },

  // 更新评论
  async updateComment(id: string, data: UpdateCommentRequest): Promise<VideoComment> {
    return apiRequest(apiClient.put<VideoComment>(`/comments/${id}`, data));
  },

  // 删除评论
  async deleteComment(id: string): Promise<void> {
    return apiRequest(apiClient.delete(`/comments/${id}`));
  },

  // 点赞/取消点赞评论
  async toggleLike(id: string): Promise<{ liked: boolean; likesCount: number }> {
    return apiRequest(
      apiClient.post<{ liked: boolean; likesCount: number }>(`/comments/${id}/like`)
    );
  },

  // 获取用户的评论
  async getUserComments(
    userId: string,
    params?: CommentQueryParams
  ): Promise<PaginatedData<VideoComment>> {
    return apiRequest(
      apiClient.get<PaginatedData<VideoComment>>(`/users/${userId}/comments`, { params })
    );
  },
};
