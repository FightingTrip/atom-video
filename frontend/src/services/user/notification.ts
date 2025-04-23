/**
 * @file notification.ts
 * @description 用户通知服务
 */

import axios from 'axios';
import { Notification, NotificationResponse, ApiResponse } from '@/types';

/**
 * 获取用户通知列表
 * @param params 查询参数
 * @returns 通知列表及分页信息
 */
export async function getUserNotifications(params: { page?: number; limit?: number } = {}) {
  try {
    const { page = 1, limit = 10 } = params;
    const { data } = await axios.get<ApiResponse<NotificationResponse>>(
      `/api/user/notifications?page=${page}&limit=${limit}`
    );

    if (data.success && data.data) {
      return {
        notifications: data.data.notifications,
        total: data.data.total,
        unreadCount: data.data.unreadCount,
        hasMore: data.data.hasMore,
      };
    }

    return { notifications: [], total: 0, unreadCount: 0, hasMore: false };
  } catch (error) {
    console.error('获取通知失败:', error);
    return { notifications: [], total: 0, unreadCount: 0, hasMore: false };
  }
}

/**
 * 标记通知为已读
 * @param notificationId 通知ID
 * @returns 是否成功
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { data } = await axios.put<ApiResponse>(`/api/user/notifications/${notificationId}/read`);
    return data.success;
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return false;
  }
}

/**
 * 标记所有通知为已读
 * @returns 是否成功
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { data } = await axios.put<ApiResponse>('/api/user/notifications/read-all');
    return data.success;
  } catch (error) {
    console.error('标记所有通知已读失败:', error);
    return false;
  }
}

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const { data } = await axios.get<ApiResponse<{ count: number }>>(
      '/api/user/notifications/unread-count'
    );
    return data.data?.count || 0;
  } catch (error) {
    console.error('获取未读通知数量失败:', error);
    return 0;
  }
}

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};
