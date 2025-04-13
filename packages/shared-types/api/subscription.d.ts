/**
 * 订阅API类型定义
 */
import { PaginationParams, PaginationResult } from './index';

/**
 * 获取用户订阅列表请求
 */
export interface GetUserSubscriptionsRequest extends PaginationParams {
  sort?: 'newest' | 'oldest' | 'active';
}

/**
 * 订阅项目
 */
export interface SubscriptionItem {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorName?: string;
  creatorAvatarUrl?: string;
  subscribedAt: string;
  notificationsEnabled: boolean;
  newVideoCount: number;
  latestActivity?: string;
}

/**
 * 获取用户订阅列表响应
 */
export interface GetUserSubscriptionsResponse extends PaginationResult<SubscriptionItem> {}

/**
 * 订阅频道请求
 */
export interface SubscribeRequest {
  creatorId: string;
  notificationsEnabled?: boolean;
}

/**
 * 订阅频道响应
 */
export interface SubscribeResponse {
  id: string;
  creatorId: string;
  subscriberId: string;
  notificationsEnabled: boolean;
  subscribedAt: string;
}

/**
 * 取消订阅请求
 */
export interface UnsubscribeRequest {
  creatorId: string;
}

/**
 * 更新订阅通知设置请求
 */
export interface UpdateSubscriptionNotificationsRequest {
  creatorId: string;
  notificationsEnabled: boolean;
}

/**
 * 检查订阅状态请求
 */
export interface CheckSubscriptionRequest {
  creatorId: string;
}

/**
 * 订阅状态响应
 */
export interface SubscriptionStatusResponse {
  isSubscribed: boolean;
  subscriptionId?: string;
  notificationsEnabled?: boolean;
  subscribedAt?: string;
}

/**
 * 获取订阅者列表请求（创作者视角）
 */
export interface GetSubscribersRequest extends PaginationParams {
  sort?: 'newest' | 'oldest';
  query?: string;
}

/**
 * 订阅者项目
 */
export interface SubscriberItem {
  id: string;
  userId: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  subscribedAt: string;
  notificationsEnabled: boolean;
}

/**
 * 获取订阅者列表响应
 */
export interface GetSubscribersResponse extends PaginationResult<SubscriberItem> {}

/**
 * 订阅统计响应
 */
export interface SubscriptionStatsResponse {
  totalSubscribers: number;
  newSubscribersToday: number;
  newSubscribersThisWeek: number;
  newSubscribersThisMonth: number;
  unsubscribesThisMonth: number;
  topSubscriberSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}
