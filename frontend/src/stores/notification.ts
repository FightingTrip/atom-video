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

      return response;
    } catch (error) {
      console.error('获取通知失败', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // 获取未读通知数量
  async function fetchUnreadCount() {
    try {
      unreadCount.value = await notificationService.getUnreadNotificationCount();
      return unreadCount.value;
    } catch (error) {
      console.error('获取未读通知数量失败', error);
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
  };
});
