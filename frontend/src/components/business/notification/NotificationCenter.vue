<template>
  <div class="notification-center">
    <div class="notification-center-header">
      <h3 class="notification-center-title">通知中心</h3>
      <div class="notification-center-actions">
        <n-button text size="small" :disabled="!hasUnread || isMarkingAllRead" @click="handleMarkAllAsRead">
          {{ isMarkingAllRead ? '处理中...' : '全部标为已读' }}
        </n-button>
        <n-button text size="small" @click="goToSettingsPage">
          <template #icon>
            <n-icon>
              <SettingsOutline />
            </n-icon>
          </template>
          通知设置
        </n-button>

        <!-- 开发测试按钮 -->
        <n-button v-if="isDev" text size="small" :loading="isRefreshing" @click="refreshAllNotifications">
          <template #icon>
            <n-icon>
              <RefreshOutline />
            </n-icon>
          </template>
          刷新数据
        </n-button>
      </div>
    </div>

    <n-tabs type="line">
      <n-tab-pane name="all" tab="所有通知">
        <notification-list />
      </n-tab-pane>
      <n-tab-pane name="unread" tab="未读通知">
        <notification-list :filter="'unread'" />
      </n-tab-pane>
    </n-tabs>

    <div class="notification-center-footer">
      <n-button block text @click="goToAllNotifications">
        查看全部通知
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { NButton, NTabs, NTabPane, NIcon } from 'naive-ui';
  import { SettingsOutline, RefreshOutline } from '@vicons/ionicons5';
  import { useNotificationStore } from '@/stores/notification';
  import NotificationList from './NotificationList.vue';

  const router = useRouter();
  const notificationStore = useNotificationStore();
  const isMarkingAllRead = ref(false);
  const isRefreshing = ref(false);
  const isDev = computed(() => import.meta.env.MODE === 'development');

  // 计算是否有未读通知
  const hasUnread = computed(() => notificationStore.hasUnread);

  // 标记所有通知为已读
  async function handleMarkAllAsRead() {
    isMarkingAllRead.value = true;
    try {
      await notificationStore.markAllAsRead();
    } finally {
      isMarkingAllRead.value = false;
    }
  }

  // 前往通知设置页面
  function goToSettingsPage() {
    router.push('/settings/notifications');
    // 关闭通知面板
    const customEvent = new CustomEvent('close-notification-panel');
    document.dispatchEvent(customEvent);
  }

  // 前往所有通知页面
  function goToAllNotifications() {
    router.push('/notifications');
    // 关闭通知面板
    const customEvent = new CustomEvent('close-notification-panel');
    document.dispatchEvent(customEvent);
  }

  // 刷新所有通知数据（开发测试用）
  async function refreshAllNotifications() {
    if (!isDev.value) return;

    isRefreshing.value = true;
    try {
      await notificationStore.refreshNotifications();
    } finally {
      isRefreshing.value = false;
    }
  }
</script>

<style scoped>
  .notification-center {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color, #ffffff);
    color: var(--text-color, #333333);
    max-height: 80vh;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }

  .notification-center-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color, #eee);
    flex-shrink: 0;
    background-color: var(--bg-color-secondary, #f9f9f9);
  }

  .notification-center-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color-primary, #303133);
  }

  .notification-center-actions {
    display: flex;
    gap: 8px;
  }

  /* 确保标签页内容区域能够滚动 */
  :deep(.n-tabs) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :deep(.n-tabs-nav) {
    flex-shrink: 0;
    background-color: var(--bg-color, #ffffff);
    border-bottom: 1px solid var(--border-color, #eee);
  }

  :deep(.n-tabs-tab) {
    padding: 12px 16px;
    transition: color 0.3s, background-color 0.3s;
    font-weight: 500;
  }

  :deep(.n-tabs-tab.n-tabs-tab--active) {
    color: var(--primary-color, #409eff);
  }

  :deep(.n-tabs-tab-wrapper::before) {
    background-color: var(--primary-color, #409eff);
  }

  :deep(.n-tab-pane) {
    height: 100%;
    overflow: auto;
    padding: 0;
    background-color: var(--bg-color, #ffffff);
  }

  :deep(.n-tabs-content) {
    flex: 1;
    overflow: hidden;
  }

  .notification-center-footer {
    padding: 8px 16px;
    border-top: 1px solid var(--border-color, #eee);
    flex-shrink: 0;
    background-color: var(--bg-color-secondary, #f9f9f9);
  }

  /* 深色模式适配 */
  :deep([data-theme="dark"]) .notification-center {
    background-color: var(--bg-color-overlay, #1f1f1f);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .notification-center-header,
  :deep([data-theme="dark"]) .notification-center-footer {
    background-color: var(--bg-color-secondary, #242424);
    border-color: var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .notification-center-title {
    color: var(--text-color-primary, #e5e5e5);
  }

  :deep([data-theme="dark"]) .n-tabs-nav {
    background-color: var(--bg-color-overlay, #1f1f1f);
    border-color: var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .n-tab-pane {
    background-color: var(--bg-color-overlay, #1f1f1f);
  }
</style>