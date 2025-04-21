/**
 * @file video.ts
 * @description 视频服务，提供视频相关的API调用
 */

import api from '@/utils/api';
import type { Video, ApiResponse, VideoInteraction, Comment } from '@/types';
import { shouldUseMockData } from '@/utils/mockUtils';
import {
  getMockVideo,
  getMockComments,
  getMockRecommendedVideos,
  getMockVideoInteraction,
} from './mockData';

/**
 * 视频服务类
 * 提供视频相关的API调用
 */
class VideoService {
  /**
   * 获取视频列表
   * @param params 查询参数
   */
  async getVideos(
    params: any = {}
  ): Promise<ApiResponse<{ videos: Video[]; total: number; hasMore: boolean }>> {
    try {
      return await api.get('/api/videos', { params });
    } catch (error) {
      console.error('获取视频列表失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const page = params.page || 1;
        const limit = params.limit || 10;

        // 生成一些随机视频
        const videos = Array(limit)
          .fill(0)
          .map((_, i) => getMockVideo(`video-${(page - 1) * limit + i + 1}`));

        return {
          success: true,
          data: {
            videos,
            total: 100, // 假设有100个视频
            hasMore: page * limit < 100,
          },
          message: '使用模拟数据',
        };
      }

      throw error;
    }
  }

  /**
   * 获取视频详情
   * @param id 视频ID
   */
  async getVideoById(id: string): Promise<ApiResponse<Video>> {
    try {
      return await api.get(`/api/videos/${id}`);
    } catch (error) {
      console.error('获取视频详情失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const video = getMockVideo(id);

        return {
          success: true,
          data: video,
          message: '使用模拟数据',
        };
      }

      throw error;
    }
  }

  /**
   * 获取热门视频
   */
  async getTrendingVideos(): Promise<ApiResponse<Video[]>> {
    try {
      return await api.get('/api/videos/trending');
    } catch (error) {
      console.error('获取热门视频失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const videos = Array(10)
          .fill(0)
          .map((_, i) => getMockVideo(`trending-${i + 1}`));

        return {
          success: true,
          data: videos,
          message: '使用模拟数据',
        };
      }

      throw error;
    }
  }

  /**
   * 获取推荐视频
   * @param videoId 当前视频ID
   * @param count 推荐数量
   */
  async getRecommendedVideos(videoId: string, count: number = 5): Promise<ApiResponse<Video[]>> {
    try {
      return await api.get(`/api/videos/${videoId}/recommended`, { params: { count } });
    } catch (error) {
      console.error('获取推荐视频失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const videos = getMockRecommendedVideos(videoId, count);

        return {
          success: true,
          data: videos,
          message: '使用模拟数据',
        };
      }

      throw error;
    }
  }

  /**
   * 获取视频评论
   * @param videoId 视频ID
   * @param params 查询参数
   */
  async getVideoComments(
    videoId: string,
    params: any = {}
  ): Promise<ApiResponse<{ comments: Comment[]; hasMore: boolean }>> {
    try {
      return await api.get(`/api/videos/${videoId}/comments`, { params });
    } catch (error) {
      console.error('获取视频评论失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const comments = getMockComments(videoId);
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedComments = comments.slice(startIndex, endIndex);

        return {
          success: true,
          data: {
            comments: paginatedComments,
            hasMore: endIndex < comments.length,
          },
          message: '使用模拟数据',
        };
      }

      throw error;
    }
  }

  /**
   * 添加评论
   * @param videoId 视频ID
   * @param content 评论内容
   */
  async addComment(videoId: string, content: string): Promise<ApiResponse<Comment>> {
    try {
      return await api.post(`/api/videos/${videoId}/comments`, { content });
    } catch (error) {
      console.error('添加评论失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
          author: {
            id: 'current-user',
            nickname: '当前用户',
            avatar: 'https://i.pravatar.cc/150?u=current',
          },
        };

        return {
          success: true,
          data: newComment,
          message: '评论成功（模拟数据）',
        };
      }

      throw error;
    }
  }

  /**
   * 获取视频互动状态
   * @param videoId 视频ID
   */
  async getVideoInteraction(videoId: string): Promise<ApiResponse<VideoInteraction>> {
    try {
      return await api.get(`/api/videos/${videoId}/interaction`);
    } catch (error) {
      console.error('获取视频互动状态失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        const interaction = getMockVideoInteraction(videoId);

        return {
          success: true,
          data: interaction,
          message: '使用模拟数据',
        };
      }

      throw error;
    }
  }

  /**
   * 点赞视频
   * @param videoId 视频ID
   */
  async likeVideo(videoId: string): Promise<ApiResponse<{ liked: boolean }>> {
    try {
      return await api.post(`/api/videos/${videoId}/like`);
    } catch (error) {
      console.error('点赞视频失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        return {
          success: true,
          data: { liked: true },
          message: '点赞成功（模拟数据）',
        };
      }

      throw error;
    }
  }

  /**
   * 收藏视频
   * @param videoId 视频ID
   */
  async favoriteVideo(videoId: string): Promise<ApiResponse<{ favorited: boolean }>> {
    try {
      return await api.post(`/api/videos/${videoId}/favorite`);
    } catch (error) {
      console.error('收藏视频失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        return {
          success: true,
          data: { favorited: true },
          message: '收藏成功（模拟数据）',
        };
      }

      throw error;
    }
  }

  /**
   * 关注频道
   * @param channelId 频道ID
   */
  async followChannel(channelId: string): Promise<ApiResponse<{ followed: boolean }>> {
    try {
      return await api.post(`/api/users/${channelId}/follow`);
    } catch (error) {
      console.error('关注频道失败:', error);

      // 如果启用了mock数据或处于离线模式，使用模拟数据
      if (shouldUseMockData()) {
        console.log('使用模拟数据');
        return {
          success: true,
          data: { followed: true },
          message: '关注成功（模拟数据）',
        };
      }

      throw error;
    }
  }
}

// 导出视频服务实例
export default new VideoService();
