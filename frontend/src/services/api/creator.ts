/**
 * @file creator.ts
 * @description 创作者相关API服务
 * @author Atom Video Team
 * @date 2025-04-20
 */

import { apiClient, apiRequest } from './client';

// 创作者数据类型定义
export interface CreatorStats {
  views: {
    value: number;
    trend: number;
  };
  subscribers: {
    value: number;
    trend: number;
  };
  likes: {
    value: number;
    trend: number;
  };
  comments: {
    value: number;
    trend: number;
  };
  watchTime: {
    value: number;
    trend: number;
  };
  videos: {
    value: number;
    recentCount: number;
  };
}

// 获取创作者统计数据
export const getCreatorStats = async (): Promise<CreatorStats> => {
  return apiRequest(apiClient.get('/api/creator/stats').then(response => response.data));
};

// 获取创作者频道信息
export const getChannelInfo = async (): Promise<any> => {
  return apiRequest(apiClient.get('/api/creator/channel').then(response => response.data));
};

// 获取创作者视频列表
export const getCreatorVideos = async (params?: { page: number; limit: number }): Promise<any> => {
  return apiRequest(
    apiClient.get('/api/creator/videos', { params }).then(response => response.data)
  );
};

// 获取创作者最近评论
export const getRecentComments = async (params?: { limit: number }): Promise<any> => {
  return apiRequest(
    apiClient.get('/api/creator/comments/recent', { params }).then(response => response.data)
  );
};

// 保存频道设置
export const saveChannelSettings = async (data: any): Promise<any> => {
  return apiRequest(
    apiClient.post('/api/creator/channel/settings', data).then(response => response.data)
  );
};

// 保存视频品牌设置
export const saveVideoBrandingSettings = async (data: any): Promise<any> => {
  return apiRequest(
    apiClient.post('/api/creator/branding/settings', data).then(response => response.data)
  );
};
