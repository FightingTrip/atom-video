import api, { isMockMode } from './api';
import {
  getMockVideo,
  getMockComments,
  getMockVideoInteraction,
  getMockRecommendedVideos,
  createMockResponse,
  mockDelay,
} from './mockData';
import type { Video, ApiResponse, VideoInteraction } from '@/types';

/**
 * 视频服务
 * 根据环境变量自动选择使用真实API或模拟数据
 */
export const videoService = {
  /**
   * 获取视频详情
   */
  getVideoById: async (videoId: string): Promise<ApiResponse<Video>> => {
    if (isMockMode) {
      // 在mock模式下返回模拟数据，并增加一定的延迟以模拟网络请求
      try {
        await mockDelay(500);
        return createMockResponse(getMockVideo(videoId));
      } catch (error) {
        console.error('获取模拟视频失败:', error);
        // 即使模拟数据出错也尝试返回基本的视频对象
        return createMockResponse(getMockVideo(videoId));
      }
    }

    // 真实API调用
    try {
      return await api.get(`/videos/${videoId}`);
    } catch (error) {
      console.error('获取视频详情失败:', error);
      // 在真实API失败时，如果配置允许，仍然使用模拟数据作为回退
      return createMockResponse(getMockVideo(videoId), false, '获取视频失败，使用备用数据');
    }
  },

  /**
   * 获取视频评论
   */
  getVideoComments: async (videoId: string, params: any): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      await mockDelay(300);
      return createMockResponse({
        comments: getMockComments(videoId),
        totalPages: 2,
        currentPage: params.page || 1,
      });
    }

    try {
      return await api.get(`/videos/${videoId}/comments`, params);
    } catch (error) {
      console.error('获取视频评论失败:', error);
      return createMockResponse(
        {
          comments: getMockComments(videoId),
          totalPages: 2,
          currentPage: params.page || 1,
        },
        false,
        '获取评论失败，使用备用数据'
      );
    }
  },

  /**
   * 获取视频交互状态
   */
  getVideoInteraction: async (videoId: string): Promise<ApiResponse<VideoInteraction>> => {
    if (isMockMode) {
      await mockDelay(200);
      return createMockResponse(getMockVideoInteraction(videoId));
    }

    try {
      return await api.get(`/videos/${videoId}/interaction`);
    } catch (error) {
      console.error('获取视频交互状态失败:', error);
      return createMockResponse(
        getMockVideoInteraction(videoId),
        false,
        '获取交互状态失败，使用备用数据'
      );
    }
  },

  /**
   * 点赞/取消点赞视频
   */
  likeVideo: async (videoId: string, action: string): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      await mockDelay(200);
      return createMockResponse({ success: true });
    }

    try {
      return await api.post(`/videos/${videoId}/like`, { action });
    } catch (error) {
      console.error('点赞操作失败:', error);
      return createMockResponse(null, false, '点赞操作失败，请检查网络连接');
    }
  },

  /**
   * 收藏/取消收藏视频
   */
  favoriteVideo: async (videoId: string, action: string): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      await mockDelay(200);
      return createMockResponse({ success: true });
    }

    try {
      return await api.post(`/videos/${videoId}/favorite`, { action });
    } catch (error) {
      console.error('收藏操作失败:', error);
      return createMockResponse(null, false, '收藏操作失败，请检查网络连接');
    }
  },

  /**
   * 订阅/取消订阅作者
   */
  subscribeAuthor: async (authorId: string, action: string): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      await mockDelay(200);
      return createMockResponse({ success: true });
    }

    try {
      return await api.post(`/authors/${authorId}/subscribe`, { action });
    } catch (error) {
      console.error('订阅操作失败:', error);
      return createMockResponse(null, false, '订阅操作失败，请检查网络连接');
    }
  },

  /**
   * 添加评论
   */
  addComment: async (videoId: string, content: string): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      await mockDelay(300);
      return createMockResponse({ success: true });
    }

    try {
      return await api.post(`/videos/${videoId}/comments`, { content });
    } catch (error) {
      console.error('评论发表失败:', error);
      return createMockResponse(null, false, '评论发表失败，请检查网络连接');
    }
  },

  /**
   * 获取推荐视频
   */
  getRecommendedVideos: async (
    videoId: string,
    limit: number = 5
  ): Promise<ApiResponse<Video[]>> => {
    if (isMockMode) {
      try {
        await mockDelay(400);
        return createMockResponse(getMockRecommendedVideos(videoId, limit));
      } catch (error) {
        console.error('获取模拟推荐视频失败:', error);
        // 即使出错也尝试返回基本的推荐视频数据
        return createMockResponse(getMockRecommendedVideos(videoId, limit));
      }
    }

    try {
      return await api.get(`/videos/${videoId}/recommended`, { params: { limit } });
    } catch (error) {
      console.error('获取推荐视频失败:', error);
      // 使用模拟数据作为备用
      return createMockResponse(
        getMockRecommendedVideos(videoId, limit),
        false,
        '获取推荐视频失败，使用备用数据'
      );
    }
  },

  /**
   * 更新视频播放次数
   */
  updateVideoViews: async (videoId: string): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      await mockDelay(100);
      return createMockResponse({ success: true });
    }

    try {
      return await api.post(`/videos/${videoId}/views`);
    } catch (error) {
      console.error('更新视频播放量失败:', error);
      return createMockResponse(null, false, '更新播放量失败');
    }
  },
};
