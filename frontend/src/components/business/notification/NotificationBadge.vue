<template>
  <div class="notification-badge-container" v-on-click-outside="closeNotificationPanel">
    <div class="notification-icon" @click="toggleNotificationPanel">
      <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0" :processing="hasNewNotification">
        <n-icon size="24">
          <NotificationsOutline />
        </n-icon>
      </n-badge>
    </div>

    <div v-if="isNotificationPanelOpen" class="notification-panel-container">
      <notification-list />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { NotificationsOutline } from '@vicons/ionicons5';
  import { NIcon, NBadge } from 'naive-ui';
  import { useNotificationStore } from '@/stores/notification';
  import NotificationList from '@/components/business/notification/NotificationList.vue';
  import { vOnClickOutside } from '@vueuse/components';

  const notificationStore = useNotificationStore();
  const isNotificationPanelOpen = ref(false);
  const hasNewNotification = ref(false);

  // 计算未读通知数量
  const unreadCount = computed(() => notificationStore.unreadCount);

  // 获取通知数据
  onMounted(async () => {
    // 初始化通知数据
    await notificationStore.fetchUnreadCount();

    // 创建轮询以定期检查新通知
    startNotificationPolling();
  });

  // 定期检查新通知
  let pollingInterval: number | null = null;

  function startNotificationPolling() {
    // 每分钟检查一次新通知
    pollingInterval = window.setInterval(async () => {
      // 记录旧的未读数量
      const oldCount = notificationStore.unreadCount;

      // 获取新的未读数量
      await notificationStore.fetchUnreadCount();

      // 如果未读数量增加，显示新通知提示
      if (notificationStore.unreadCount > oldCount && oldCount !== 0) {
        hasNewNotification.value = true;
        // 3秒后自动关闭提示
        setTimeout(() => {
          hasNewNotification.value = false;
        }, 3000);
      }
    }, 60000); // 60秒
  }

  // 组件卸载前清除轮询
  onBeforeUnmount(() => {
    if (pollingInterval !== null) {
      clearInterval(pollingInterval);
    }
  });

  // 切换通知面板显示状态
  function toggleNotificationPanel() {
    isNotificationPanelOpen.value = !isNotificationPanelOpen.value;

    // 如果打开面板，加载通知列表
    if (isNotificationPanelOpen.value) {
      notificationStore.fetchNotifications();
    }

    // 停止动画提示
    hasNewNotification.value = false;
  }

  // 关闭通知面板
  function closeNotificationPanel() {
    isNotificationPanelOpen.value = false;
  }
</script>

<style scoped>
  .notification-badge-container {
    position: relative;
  }

  .notification-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .notification-icon:hover {
    background-color: rgba(128, 128, 128, 0.1);
  }

  .notification-panel-container {
    position: absolute;
    top: 44px;
    right: -10px;
    width: 380px;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }

  :deep(.n-badge-sup) {
    padding: 2px 6px;
    font-size: 10px;
  }

  /* 暗色主题适配 */
  :deep(.dark-theme) .notification-panel-container {
    background-color: #1f1f1f;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  }

  :deep(.dark-theme) .notification-icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>