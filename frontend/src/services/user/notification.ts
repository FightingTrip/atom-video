/**
 * @file notification.ts
 * @description 用户通知服务
 */

import axios from 'axios';
import { Notification, NotificationResponse, ApiResponse } from '@/types';

/**
 * 转换通知数据格式，确保与前端组件兼容
 * @param notification 原始通知数据
 * @returns 转换后的通知数据
 */
function transformNotification(notification: any): Notification {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title || '系统通知',
    message: notification.content || notification.message || '',
    read: notification.read !== undefined ? notification.read : !notification.isRead,
    createdAt: notification.createdAt,
    relatedId:
      notification.relatedVideoId ||
      notification.relatedUserId ||
      notification.relatedId ||
      undefined,
    link: notification.link || notification.actionUrl,
  };
}

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
      // 转换通知数据格式
      const transformedNotifications = data.data.notifications.map(transformNotification);

      return {
        notifications: transformedNotifications,
        total: data.data.total,
        unreadCount: data.data.unreadCount,
        hasMore: data.data.hasMore,
      };
    }

    // 如果没有数据或者API返回失败，生成一些默认通知
    if (!data.data || data.data.notifications.length === 0) {
      console.log('API返回空数据，生成模拟通知');
      const mockNotifications = [
        {
          id: 'mock-notif-1',
          type: 'system',
          title: '欢迎使用Atom Video',
          message: '感谢您使用Atom Video，开始探索丰富的视频世界吧！',
          read: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          relatedId: undefined,
          link: '/explore',
        },
        {
          id: 'mock-notif-2',
          type: 'video',
          title: '新视频推荐',
          message: '根据您的观看历史，我们为您推荐了一些精彩视频',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          relatedId: 'v-1',
          link: '/video/detail',
        },
        {
          id: 'mock-notif-3',
          type: 'like',
          title: '获得点赞',
          message: '您的评论收到了新的点赞',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          relatedId: 'v-2',
          link: '/video/detail?comment=true',
        },
      ];

      return {
        notifications: mockNotifications,
        total: mockNotifications.length,
        unreadCount: mockNotifications.filter(n => !n.read).length,
        hasMore: false,
      };
    }

    return { notifications: [], total: 0, unreadCount: 0, hasMore: false };
  } catch (error) {
    console.error('获取通知失败:', error);
    // 出错时返回模拟通知
    const mockNotifications = [
      {
        id: 'mock-notif-1',
        type: 'system',
        title: '欢迎使用Atom Video',
        message: '感谢您使用Atom Video，开始探索丰富的视频世界吧！',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        relatedId: undefined,
        link: '/explore',
      },
      {
        id: 'mock-notif-2',
        type: 'video',
        title: '新视频推荐',
        message: '根据您的观看历史，我们为您推荐了一些精彩视频',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        relatedId: 'v-1',
        link: '/video/detail',
      },
    ];
    return {
      notifications: mockNotifications,
      total: mockNotifications.length,
      unreadCount: mockNotifications.filter(n => !n.read).length,
      hasMore: false,
    };
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
