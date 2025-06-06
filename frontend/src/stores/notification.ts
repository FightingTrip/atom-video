/**
 * @file notification.ts
 * @description 通知状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Notification } from '@/types';
import notificationService from '@/services/user/notification';

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const totalNotifications = ref(0);
  const currentPage = ref(1);
  const hasMoreNotifications = ref(false);

  // 计算属性
  const hasUnread = computed(() => unreadCount.value > 0);

  // 获取通知列表
  async function fetchNotifications(page = 1, limit = 10) {
    loading.value = true;
    try {
      const response = await notificationService.getUserNotifications({
        page,
        limit,
      });

      if (page === 1) {
        notifications.value = response.notifications;
      } else {
        notifications.value = [...notifications.value, ...response.notifications];
      }

      totalNotifications.value = response.total;
      currentPage.value = page;
      hasMoreNotifications.value = response.hasMore;

      // 确保通知列表永远不为空
      if (notifications.value.length === 0) {
        // 添加一个默认通知
        const defaultNotification: Notification = {
          id: 'default-notif-1',
          type: 'system',
          title: '欢迎使用Atom Video',
          message: '感谢您使用Atom Video，开始探索丰富的视频世界吧！',
          read: false,
          createdAt: new Date().toISOString(),
        };
        notifications.value = [defaultNotification];
        totalNotifications.value = 1;
        unreadCount.value = 1;
      }

      return response;
    } catch (error) {
      console.error('获取通知失败', error);
      
      // 确保出错时也添加一个默认通知
      if (notifications.value.length === 0) {
        const defaultNotification: Notification = {
          id: 'default-notif-2',
          type: 'system',
          title: '欢迎使用Atom Video',
          message: '感谢您使用Atom Video，开始探索丰富的视频世界吧！',
          read: false,
          createdAt: new Date().toISOString(),
        };
        notifications.value = [defaultNotification];
        totalNotifications.value = 1;
        unreadCount.value = 1;
      }
      
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // 获取未读通知数量
  async function fetchUnreadCount() {
    try {
      const count = await notificationService.getUnreadNotificationCount();
      unreadCount.value = count;
      return count;
    } catch (error) {
      console.error('获取未读通知数量失败', error);
      // 出错时，设置为0而不是抛出异常
      unreadCount.value = 0;
      return 0;
    }
  }

  // 标记通知为已读
  async function markAsRead(notificationId: string) {
    try {
      const success = await notificationService.markNotificationAsRead(notificationId);

      if (success) {
        // 更新本地状态
        const notification = notifications.value.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }

      return success;
    } catch (error) {
      console.error('标记通知为已读失败', error);
      throw error;
    }
  }

  // 标记所有通知为已读
  async function markAllAsRead() {
    try {
      const success = await notificationService.markAllNotificationsAsRead();

      if (success) {
        // 更新本地状态
        notifications.value.forEach(notification => {
          notification.read = true;
        });
        unreadCount.value = 0;
      }

      return success;
    } catch (error) {
      console.error('标记所有通知为已读失败', error);
      throw error;
    }
  }

  // 加载更多通知
  async function loadMoreNotifications() {
    if (hasMoreNotifications.value && !loading.value) {
      return fetchNotifications(currentPage.value + 1);
    }
    return null;
  }

  // 初始化通知状态
  async function initialize() {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }

  // 强制刷新所有通知数据（用于开发测试）
  async function refreshNotifications() {
    // 清空现有数据
    notifications.value = [];
    unreadCount.value = 0;
    currentPage.value = 1;

    // 重新加载数据
    return await initialize();
  }

  return {
    // 状态
    notifications,
    unreadCount,
    loading,
    totalNotifications,
    hasMoreNotifications,

    // 计算属性
    hasUnread,

    // 方法
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    loadMoreNotifications,
    initialize,
    refreshNotifications,
  };
});
