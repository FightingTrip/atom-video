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
        console.log('[VideoService] 使用模拟模式获取视频:', videoId);
        await mockDelay(500);
        return createMockResponse(getMockVideo(videoId));
      } catch (error) {
        console.error('[VideoService] 获取模拟视频失败:', error);
        // 即使模拟数据出错也尝试返回基本的视频对象
        return createMockResponse(getMockVideo(videoId));
      }
    }

    // 真实API调用
    try {
      console.log('[VideoService] 从API获取视频:', videoId);
      const response = await api.get(`/videos/${videoId}`);
      console.log('[VideoService] API返回视频数据:', response.success);
      return response;
    } catch (error) {
      console.error('[VideoService] 获取视频详情失败:', error);

      // 检查是否是网络错误
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes('Network Error') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CONNECTION_REFUSED'));

      if (isNetworkError) {
        console.warn('[VideoService] 检测到网络错误，切换到模拟数据');
        // 使用模拟数据并告知用户
        return createMockResponse(getMockVideo(videoId), false, '网络连接问题，显示离线内容');
      }

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
      console.log('[VideoService] 模拟模式更新播放量:', videoId);
      await mockDelay(100);
      return createMockResponse({ success: true });
    }

    try {
      console.log('[VideoService] 更新视频播放量:', videoId);
      // 设置更短的超时，因为这是非关键请求
      const response = await api.post(`/videos/${videoId}/views`, null, {
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return response;
    } catch (error) {
      // 由于这不是关键操作，我们可以静默处理错误，不影响主要体验
      console.warn('[VideoService] 更新视频播放量失败:', error);
      // 返回成功响应，允许用户继续使用
      return createMockResponse({ success: true, silent: true }, true, '');
    }
  },

  /**
   * 保存观看历史记录
   */
  saveWatchHistory: async (videoId: string, progress: number): Promise<ApiResponse<any>> => {
    if (isMockMode) {
      console.log('[VideoService] 模拟模式保存观看历史:', videoId, progress);
      await mockDelay(100);
      return createMockResponse({ success: true });
    }

    try {
      console.log('[VideoService] 保存观看历史:', videoId, progress);
      // 设置更短的超时，因为这是非关键请求
      const response = await api.post(
        `/history/watch/${videoId}`,
        { progress },
        {
          timeout: 5000,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }
      );
      return response;
    } catch (error) {
      // 由于这不是关键操作，我们可以静默处理错误，不影响主要体验
      console.warn('[VideoService] 保存观看历史失败:', error);
      // 返回成功响应，允许用户继续使用
      return createMockResponse({ success: true, silent: true }, true, '');
    }
  },
};
