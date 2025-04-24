<template>
  <div class="notification-badge-container" ref="containerRef">
    <div class="notification-icon" @click="toggleNotificationPanel">
      <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0" :processing="hasNewNotification">
        <n-icon size="24">
          <NotificationsOutline />
        </n-icon>
      </n-badge>
    </div>

    <div v-if="isNotificationPanelOpen" class="notification-panel-container">
      <notification-center />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { NotificationsOutline } from '@vicons/ionicons5';
  import { NIcon, NBadge } from 'naive-ui';
  import { useNotificationStore } from '@/stores/notification';
  import NotificationCenter from '@/components/business/notification/NotificationCenter.vue';
  import { onClickOutside } from '@vueuse/core';
  import { useAuthStore } from '@/stores/auth';

  const notificationStore = useNotificationStore();
  const authStore = useAuthStore();
  const isNotificationPanelOpen = ref(false);
  const hasNewNotification = ref(false);
  const containerRef = ref<HTMLElement | null>(null);

  // 使用onClickOutside
  onClickOutside(containerRef, () => {
    closeNotificationPanel();
  });

  // 计算未读通知数量
  const unreadCount = computed(() => notificationStore.unreadCount);

  // 监听自定义事件来关闭通知面板
  onMounted(() => {
    document.addEventListener('close-notification-panel', closeNotificationPanel);

    // 只有在用户已认证的情况下才获取通知
    if (authStore.isAuthenticated) {
      try {
        // 初始化通知数据
        notificationStore.fetchUnreadCount();

        // 创建轮询以定期检查新通知
        startNotificationPolling();
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }
  });

  // 定期检查新通知
  let pollingInterval: number | null = null;

  function startNotificationPolling() {
    // 每分钟检查一次新通知
    pollingInterval = window.setInterval(async () => {
      if (!authStore.isAuthenticated) {
        // 如果用户已登出，停止轮询
        if (pollingInterval !== null) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        return;
      }

      try {
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
      } catch (error) {
        console.error('Failed to check notifications:', error);
      }
    }, 60000); // 60秒
  }

  // 组件卸载前清除轮询和事件监听
  onBeforeUnmount(() => {
    if (pollingInterval !== null) {
      clearInterval(pollingInterval);
    }
    document.removeEventListener('close-notification-panel', closeNotificationPanel);
  });

  // 切换通知面板显示状态
  function toggleNotificationPanel() {
    if (!authStore.isAuthenticated) {
      return;
    }

    isNotificationPanelOpen.value = !isNotificationPanelOpen.value;

    // 如果打开面板，加载通知列表
    if (isNotificationPanelOpen.value) {
      // 刷新通知数据
      notificationStore.initialize().catch(error => {
        console.error('Failed to load notifications:', error);
      });

      // 显示调试信息
      console.log('通知面板已打开，通知数据:', notificationStore.notifications);
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
    transition: all 0.3s ease;
  }

  .notification-icon:hover {
    background-color: var(--hover-color, rgba(128, 128, 128, 0.1));
  }

  .notification-panel-container {
    position: absolute;
    top: 44px;
    right: -120px;
    width: 380px;
    max-height: 80vh;
    background-color: var(--bg-color, #fff);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
    border: 1px solid var(--border-color, #eee);
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :deep(.n-badge-sup) {
    padding: 2px 6px;
    font-size: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* 暗色主题适配 */
  :deep([data-theme="dark"]) .notification-panel-container {
    background-color: var(--bg-color-overlay, #1f1f1f);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    border-color: var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .notification-icon:hover {
    background-color: var(--hover-color-dark, rgba(255, 255, 255, 0.1));
  }

  :deep([data-theme="dark"]) .n-badge-sup {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* 响应式处理 */
  @media (max-width: 768px) {
    .notification-panel-container {
      width: 100vw;
      max-width: 100vw;
      right: -60px;
      top: 48px;
      position: fixed;
      left: 0;
      border-radius: 0;
      animation: slideDownMobile 0.2s ease-out;
    }

    @keyframes slideDownMobile {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>