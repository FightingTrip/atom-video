<template>
  <div class="notifications-page">
    <div class="page-header">
      <h1 class="page-title">通知中心</h1>
      <div class="page-actions" v-if="hasUnread">
        <n-button @click="handleMarkAllAsRead" :loading="isMarkingAllRead">
          全部标为已读
        </n-button>
      </div>
    </div>

    <n-tabs type="line" animated>
      <n-tab-pane name="all" tab="所有通知">
        <div class="notification-container">
          <n-card>
            <notification-list :limit="20" />
          </n-card>
        </div>
      </n-tab-pane>
      <n-tab-pane name="unread" tab="未读通知">
        <div class="notification-container">
          <n-card>
            <notification-list filter="unread" :limit="20" />
          </n-card>
        </div>
      </n-tab-pane>
      <n-tab-pane name="settings" tab="通知设置">
        <div class="notification-settings-container">
          <n-card>
            <n-space vertical size="large">
              <h3>互动通知</h3>
              <n-space vertical>
                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">点赞</div>
                    <div class="notification-description">当有人点赞你的视频或评论时通知你</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.likes" @update:value="saveSettings" />
                </n-space>

                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">评论</div>
                    <div class="notification-description">当有人评论你的视频时通知你</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.comments" @update:value="saveSettings" />
                </n-space>

                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">回复</div>
                    <div class="notification-description">当有人回复你的评论时通知你</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.replies" @update:value="saveSettings" />
                </n-space>

                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">关注</div>
                    <div class="notification-description">当有人关注你时通知你</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.follows" @update:value="saveSettings" />
                </n-space>
              </n-space>

              <n-divider />

              <h3>系统通知</h3>
              <n-space vertical>
                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">视频处理</div>
                    <div class="notification-description">当你的视频处理完成或失败时通知你</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.videoProcessing" @update:value="saveSettings" />
                </n-space>

                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">更新与公告</div>
                    <div class="notification-description">接收关于平台更新和重要公告的通知</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.updates" @update:value="saveSettings" />
                </n-space>
              </n-space>

              <n-divider />

              <h3>通知方式</h3>
              <n-space vertical>
                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">浏览器通知</div>
                    <div class="notification-description">在浏览器中显示弹出通知</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.browserNotification" @update:value="saveSettings" />
                </n-space>

                <n-space justify="space-between" align="center">
                  <div class="notification-text">
                    <div class="notification-label">邮件通知</div>
                    <div class="notification-description">发送重要通知到您的邮箱</div>
                  </div>
                  <n-switch v-model:value="notificationSettings.emailNotification" @update:value="saveSettings" />
                </n-space>
              </n-space>
            </n-space>
          </n-card>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { NTabs, NTabPane, NButton, NCard, NSpace, NSwitch, NDivider } from 'naive-ui';
  import NotificationList from '@/components/business/notification/NotificationList.vue';
  import { useNotificationStore } from '@/stores/notification';
  import { useMessage } from 'naive-ui';
  import { useUserStore } from '@/stores/user';
  import type { UserNotificationSettings } from '@/types';

  const notificationStore = useNotificationStore();
  const userStore = useUserStore();
  const message = useMessage();

  const isMarkingAllRead = ref(false);
  const notificationSettings = ref<UserNotificationSettings>({
    likes: true,
    comments: true,
    replies: true,
    follows: true,
    videoProcessing: true,
    updates: true,
    browserNotification: false,
    emailNotification: true
  });

  // 计算是否有未读通知
  const hasUnread = computed(() => notificationStore.hasUnread);

  // 获取初始数据
  onMounted(async () => {
    try {
      // 初始化通知数据
      await notificationStore.initialize();

      // 获取用户通知设置
      if (userStore.currentUser) {
        const settings = await userStore.getUserNotificationSettings();
        if (settings) {
          notificationSettings.value = settings;
        }
      }
    } catch (error) {
      console.error('获取通知数据失败', error);
      message.error('获取通知数据失败，请稍后重试');
    }
  });

  // 标记所有通知为已读
  async function handleMarkAllAsRead() {
    isMarkingAllRead.value = true;
    try {
      await notificationStore.markAllAsRead();
      message.success('所有通知已标记为已读');
    } catch (error) {
      console.error('标记通知失败', error);
      message.error('标记失败，请稍后重试');
    } finally {
      isMarkingAllRead.value = false;
    }
  }

  // 保存通知设置
  async function saveSettings() {
    try {
      await userStore.updateNotificationSettings(notificationSettings.value);
      message.success('通知设置已保存');
    } catch (error) {
      console.error('保存通知设置失败', error);
      message.error('保存设置失败，请稍后重试');
    }
  }
</script>

<style scoped>
  .notifications-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: var(--text-color);
  }

  .notification-container {
    margin-top: 16px;
  }

  .notification-settings-container {
    margin-top: 16px;
  }

  .notification-text {
    display: flex;
    flex-direction: column;
  }

  .notification-label {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--text-color);
  }

  .notification-description {
    font-size: 14px;
    color: var(--text-color-secondary);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .notifications-page {
      padding: 16px;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
</style>