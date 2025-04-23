<template>
  <div class="notification-container">
    <div class="notification-header">
      <h3>我的通知</h3>
      <div class="header-actions">
        <n-button text size="small" :disabled="!hasUnread || isMarkingAllRead" @click="handleMarkAllAsRead">
          {{ isMarkingAllRead ? '标记中...' : '全部标为已读' }}
        </n-button>
      </div>
    </div>

    <div v-if="loading && !notifications.length" class="notification-loading">
      <n-skeleton text :repeat="3" />
    </div>

    <div v-else-if="!notifications.length" class="empty-notification">
      <n-empty description="暂无通知" />
    </div>

    <n-scrollbar v-else style="max-height: 400px">
      <transition-group name="notification-list" tag="div" class="notification-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item"
          :class="{ unread: !notification.read }">
          <div class="notification-icon" :class="getNotificationTypeClass(notification.type)">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
          <div class="notification-actions">
            <n-button v-if="!notification.read" text size="small" :loading="markingReadIds.includes(notification.id)"
              @click="handleMarkAsRead(notification.id)">
              标为已读
            </n-button>
          </div>
        </div>
      </transition-group>
    </n-scrollbar>

    <div v-if="hasMoreNotifications && !loading" class="load-more">
      <n-button text @click="handleLoadMore">加载更多</n-button>
    </div>

    <div v-if="loading && notifications.length" class="notification-loading-more">
      <n-skeleton text :repeat="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useNotificationStore } from '@/stores/notification';
  import { formatDistanceToNow } from 'date-fns';
  import { zhCN } from 'date-fns/locale';
  import type { Notification } from '@/types';

  const notificationStore = useNotificationStore();
  const markingReadIds = ref<string[]>([]);
  const isMarkingAllRead = ref(false);

  // 从store中获取状态
  const notifications = computed(() => notificationStore.notifications);
  const loading = computed(() => notificationStore.loading);
  const hasUnread = computed(() => notificationStore.hasUnread);
  const hasMoreNotifications = computed(() => notificationStore.hasMoreNotifications);

  // 初始化
  onMounted(async () => {
    await notificationStore.initialize();
  });

  // 根据通知类型获取图标
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'comment':
        return 'el-icon-chat-dot-round';
      case 'like':
        return 'el-icon-star-on';
      case 'subscribe':
        return 'el-icon-video-camera';
      case 'system':
        return 'el-icon-bell';
      default:
        return 'el-icon-message';
    }
  }

  // 根据通知类型获取样式类
  function getNotificationTypeClass(type: string) {
    switch (type) {
      case 'comment':
        return 'icon-comment';
      case 'like':
        return 'icon-like';
      case 'subscribe':
        return 'icon-subscribe';
      case 'system':
        return 'icon-system';
      default:
        return '';
    }
  }

  // 格式化时间
  function formatTime(date: string | Date) {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: zhCN });
    } catch (e) {
      return '未知时间';
    }
  }

  // 标记单个通知为已读
  async function handleMarkAsRead(id: string) {
    markingReadIds.value.push(id);
    try {
      await notificationStore.markAsRead(id);
    } finally {
      markingReadIds.value = markingReadIds.value.filter(item => item !== id);
    }
  }

  // 标记所有通知为已读
  async function handleMarkAllAsRead() {
    isMarkingAllRead.value = true;
    try {
      await notificationStore.markAllAsRead();
    } finally {
      isMarkingAllRead.value = false;
    }
  }

  // 加载更多通知
  async function handleLoadMore() {
    await notificationStore.loadMoreNotifications();
  }
</script>

<style scoped>
  .notification-container {
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .notification-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .notification-list {
    padding: 8px 0;
  }

  .notification-item {
    display: flex;
    padding: 12px 16px;
    border-bottom: 1px solid #f5f7fa;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  .notification-item:hover {
    background-color: #f5f7fa;
  }

  .notification-item.unread {
    background-color: #f0f9ff;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    flex-shrink: 0;
    background-color: #e6e6e6;
  }

  .notification-icon.icon-comment {
    background-color: #ecf5ff;
    color: #409eff;
  }

  .notification-icon.icon-like {
    background-color: #fef0f0;
    color: #f56c6c;
  }

  .notification-icon.icon-subscribe {
    background-color: #f0f9eb;
    color: #67c23a;
  }

  .notification-icon.icon-system {
    background-color: #fdf6ec;
    color: #e6a23c;
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-title {
    font-weight: 500;
    margin-bottom: 4px;
    color: #303133;
  }

  .notification-message {
    font-size: 14px;
    color: #606266;
    margin-bottom: 4px;
    word-break: break-word;
  }

  .notification-time {
    font-size: 12px;
    color: #909399;
  }

  .notification-actions {
    display: flex;
    align-items: center;
    margin-left: 12px;
  }

  .notification-loading,
  .empty-notification,
  .notification-loading-more {
    padding: 16px;
  }

  .load-more {
    text-align: center;
    padding: 8px 0;
  }

  .notification-list-enter-active,
  .notification-list-leave-active {
    transition: all 0.3s ease;
  }

  .notification-list-enter-from,
  .notification-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>