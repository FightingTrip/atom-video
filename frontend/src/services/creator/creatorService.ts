/**
 * 创作者服务
 *
 * 提供创作者工作区所需的API调用封装
 */

import api from '../api';
import {
  CreatorStats,
  VideoAnalytics,
  CreatorVideo,
  CreatorComment,
  ChannelSettings,
  PaginatedResult,
} from './types';

/**
 * 创作者服务
 */
const creatorService = {
  // 统计数据
  async getCreatorStats(): Promise<CreatorStats> {
    const response = await api.get<{ success: boolean; data: CreatorStats }>('/api/creator/stats');
    return response.data;
  },

  // 视频数据
  async getCreatorVideos(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResult<CreatorVideo>> {
    const response = await api.get<{ success: boolean; data: PaginatedResult<CreatorVideo> }>(
      '/api/creator/videos',
      { params }
    );
    return response.data;
  },

  // 获取单个视频
  async getVideoById(videoId: string): Promise<CreatorVideo> {
    const response = await api.get<{ success: boolean; data: CreatorVideo }>(
      `/api/creator/videos/${videoId}`
    );
    return response.data;
  },

  // 更新视频信息
  async updateVideo(videoId: string, data: Partial<CreatorVideo>): Promise<CreatorVideo> {
    const response = await api.put<{ success: boolean; data: CreatorVideo }>(
      `/api/creator/videos/${videoId}`,
      data
    );
    return response.data;
  },

  // 删除视频
  async deleteVideo(videoId: string): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/api/creator/videos/${videoId}`);
  },

  // 视频分析数据
  async getVideoAnalytics(videoId: string): Promise<VideoAnalytics> {
    const response = await api.get<{ success: boolean; data: VideoAnalytics }>(
      `/api/creator/videos/${videoId}/analytics`
    );
    return response.data;
  },

  // 评论数据
  async getCreatorComments(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    videoId?: string;
  }): Promise<PaginatedResult<CreatorComment>> {
    const response = await api.get<{ success: boolean; data: PaginatedResult<CreatorComment> }>(
      '/api/creator/comments',
      { params }
    );
    return response.data;
  },

  // 回复评论
  async replyToComment(commentId: string, content: string): Promise<CreatorComment> {
    const response = await api.post<{ success: boolean; data: CreatorComment }>(
      `/api/creator/comments/${commentId}/reply`,
      { content }
    );
    return response.data;
  },

  // 删除评论
  async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/api/creator/comments/${commentId}`);
  },

  // 频道设置
  async getChannelSettings(): Promise<ChannelSettings> {
    const response = await api.get<{ success: boolean; data: ChannelSettings }>(
      '/api/creator/channel'
    );
    return response.data;
  },

  // 更新频道设置
  async updateChannelSettings(data: Partial<ChannelSettings>): Promise<ChannelSettings> {
    const response = await api.put<{ success: boolean; data: ChannelSettings }>(
      '/api/creator/channel',
      data
    );
    return response.data;
  },

  // 获取收入数据
  async getRevenueData(period: 'week' | 'month' | 'year'): Promise<{
    data: number[];
    labels: string[];
    total: number;
  }> {
    const response = await api.get<{
      success: boolean;
      data: { data: number[]; labels: string[]; total: number };
    }>('/api/creator/revenue', { params: { period } });
    return response.data;
  },
};

export default creatorService;
