/**
 * @file subscription.ts
 * @description 订阅相关API服务
 * @author Atom Video Team
 * @date 2025-04-20
 */

import { apiClient, apiRequest } from './client';

export interface Subscription {
  id: string;
  name: string;
  avatar: string;
  subscriberCount?: number;
  isSubscribed: boolean;
}

// 获取用户订阅的频道列表
export const getUserSubscriptions = async (params?: {
  limit?: number;
}): Promise<Subscription[]> => {
  return apiRequest(
    apiClient.get('/api/subscriptions', { params }).then(response => response.data.subscriptions)
  );
};

// 订阅频道
export const subscribeToChannel = async (channelId: string): Promise<void> => {
  return apiRequest(apiClient.post(`/api/subscriptions/${channelId}`).then(() => {}));
};

// 取消订阅频道
export const unsubscribeFromChannel = async (channelId: string): Promise<void> => {
  return apiRequest(apiClient.delete(`/api/subscriptions/${channelId}`).then(() => {}));
};

// 获取推荐频道
export const getRecommendedChannels = async (params?: {
  limit?: number;
}): Promise<Subscription[]> => {
  return apiRequest(
    apiClient.get('/api/channels/recommended', { params }).then(response => response.data.channels)
  );
};
