<template>
  <div class="notification-container">
    <div class="notification-header">
      <h3>我的通知</h3>
      <div class="header-actions">
        <n-button-group size="small">
          <n-button :type="activeFilter === 'all' ? 'primary' : 'default'" @click="switchFilter('all')">
            全部
          </n-button>
          <n-button :type="activeFilter === 'unread' ? 'primary' : 'default'" @click="switchFilter('unread')">
            未读
            <n-badge v-if="unreadCount > 0" :value="unreadCount" processing />
          </n-button>
        </n-button-group>
        <n-divider vertical style="margin: 0 8px;" />
        <n-button text size="small" :disabled="!hasUnread || isMarkingAllRead" @click="handleMarkAllAsRead">
          {{ isMarkingAllRead ? '标记中...' : '全部标为已读' }}
        </n-button>
      </div>
    </div>

    <div v-if="loading && !filteredNotifications.length" class="notification-loading">
      <n-skeleton text :repeat="3" />
    </div>

    <div v-else-if="!filteredNotifications.length" class="empty-notification">
      <n-empty :description="emptyDescription">
        <template #extra>
          <n-button size="small" @click="reloadNotifications">刷新通知</n-button>
        </template>
      </n-empty>
    </div>

    <n-scrollbar v-else style="max-height: 400px" :trigger="scrollTrigger">
      <div v-if="showTodayNotifications.length > 0" class="notification-group">
        <div class="notification-group-title">今天</div>
        <transition-group name="notification-list" tag="div" class="notification-list">
          <div v-for="notification in showTodayNotifications" :key="notification.id" class="notification-item"
            :class="{ unread: !notification.read, active: activeNotification?.id === notification.id }"
            @click="handleNotificationClick(notification)">
            <div class="notification-icon" :class="getNotificationTypeClass(notification.type)">
              <n-icon>
                <component :is="getNotificationIcon(notification.type)" />
              </n-icon>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title || '系统通知' }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>
            <div class="notification-actions">
              <n-button v-if="!notification.read" text size="small" :loading="markingReadIds.includes(notification.id)"
                @click.stop="handleMarkAsRead(notification.id)">
                标为已读
              </n-button>
              <n-popover v-else trigger="hover" placement="bottom">
                <template #trigger>
                  <n-button text size="small" @click.stop="showNotificationDetails(notification)">
                    <n-icon>
                      <InfoOutline />
                    </n-icon>
                  </n-button>
                </template>
                <span>查看详情</span>
              </n-popover>
            </div>
          </div>
        </transition-group>
      </div>

      <div v-if="showEarlierNotifications.length > 0" class="notification-group">
        <div class="notification-group-title">更早</div>
        <transition-group name="notification-list" tag="div" class="notification-list">
          <div v-for="notification in showEarlierNotifications" :key="notification.id" class="notification-item"
            :class="{ unread: !notification.read, active: activeNotification?.id === notification.id }"
            @click="handleNotificationClick(notification)">
            <div class="notification-icon" :class="getNotificationTypeClass(notification.type)">
              <n-icon>
                <component :is="getNotificationIcon(notification.type)" />
              </n-icon>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title || '系统通知' }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>
            <div class="notification-actions">
              <n-button v-if="!notification.read" text size="small" :loading="markingReadIds.includes(notification.id)"
                @click.stop="handleMarkAsRead(notification.id)">
                标为已读
              </n-button>
              <n-popover v-else trigger="hover" placement="bottom">
                <template #trigger>
                  <n-button text size="small" @click.stop="showNotificationDetails(notification)">
                    <n-icon>
                      <InfoOutline />
                    </n-icon>
                  </n-button>
                </template>
                <span>查看详情</span>
              </n-popover>
            </div>
          </div>
        </transition-group>
      </div>
    </n-scrollbar>

    <div v-if="hasMoreNotifications && !loading" class="load-more">
      <n-button text @click="handleLoadMore" :loading="isLoadingMore">{{ isLoadingMore ? '加载中...' : '加载更多' }}</n-button>
    </div>

    <div v-if="loading && filteredNotifications.length" class="notification-loading-more">
      <n-skeleton text :repeat="1" />
    </div>

    <n-modal v-model:show="showNotificationModal" preset="card" style="width: 400px"
      :title="notificationDetail?.title || '通知详情'">
      <div class="notification-detail">
        <div class="notification-detail-time">
          <n-icon>
            <TimeOutline />
          </n-icon>
          {{ formatFullTime(notificationDetail?.createdAt) }}
        </div>
        <div class="notification-detail-type">
          <n-icon>
            <component :is="getNotificationIcon(notificationDetail?.type || 'system')" />
          </n-icon>
          {{ getNotificationTypeName(notificationDetail?.type) }}
        </div>
        <div class="notification-detail-content">
          {{ notificationDetail?.message }}
        </div>
        <div v-if="notificationDetail?.relatedId" class="notification-detail-related">
          相关ID: {{ notificationDetail.relatedId }}
        </div>
      </div>
      <div class="notification-detail-actions">
        <n-button @click="navigateToNotificationTarget" type="primary" block>
          {{ getActionButtonText(notificationDetail?.type) }}
        </n-button>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, PropType, watch, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { useNotificationStore } from '@/stores/notification';
  import { formatDistanceToNow, isToday, format } from 'date-fns';
  import { zhCN } from 'date-fns/locale';
  import {
    NButton,
    NSkeleton,
    NScrollbar,
    NEmpty,
    NIcon,
    NPopover,
    NModal,
    NDivider,
    NBadge,
    NButtonGroup
  } from 'naive-ui';
  import {
    ChatbubbleOutline,
    HeartOutline,
    PersonAddOutline,
    NotificationsOutline,
    VideocamOutline,
    MailOutline,
    TimeOutline,
    InformationCircleOutline as InfoOutline
  } from '@vicons/ionicons5';
  import type { Notification } from '@/types';

  const props = defineProps({
    filter: {
      type: String as PropType<'all' | 'unread'>,
      default: 'all'
    },
    limit: {
      type: Number,
      default: 10
    }
  });

  const router = useRouter();
  const notificationStore = useNotificationStore();
  const markingReadIds = ref<string[]>([]);
  const isMarkingAllRead = ref(false);
  const activeFilter = ref<'all' | 'unread'>(props.filter);
  const scrollTrigger = ref('none');
  const isLoadingMore = ref(false);
  const activeNotification = ref<Notification | null>(null);
  const showNotificationModal = ref(false);
  const notificationDetail = ref<Notification | null>(null);

  // 从store中获取状态
  const notifications = computed(() => notificationStore.notifications);
  const loading = computed(() => notificationStore.loading);
  const hasUnread = computed(() => notificationStore.hasUnread);
  const unreadCount = computed(() => notificationStore.unreadCount);
  const hasMoreNotifications = computed(() => notificationStore.hasMoreNotifications);

  // 过滤通知
  const filteredNotifications = computed(() => {
    let allNotifications = notificationStore.notifications;

    // 如果没有通知，添加一个默认通知
    if (allNotifications.length === 0) {
      console.log('通知列表为空，添加默认通知');
      const defaultNotification: Notification = {
        id: 'default-notif',
        type: 'system',
        title: '欢迎使用Atom Video',
        message: '感谢您使用Atom Video，开始探索丰富的视频世界吧！',
        read: false,
        createdAt: new Date().toISOString(),
      };
      // 注意：这不会更改store中的状态，只是临时添加
      allNotifications = [defaultNotification];
    }

    if (activeFilter.value === 'unread') {
      return allNotifications.filter(notification => !notification.read);
    }

    return allNotifications;
  });

  // 将通知分为今天和更早的通知
  const showTodayNotifications = computed(() => {
    return filteredNotifications.value.filter(notification => {
      try {
        return isToday(new Date(notification.createdAt));
      } catch (e) {
        return false;
      }
    });
  });

  const showEarlierNotifications = computed(() => {
    return filteredNotifications.value.filter(notification => {
      try {
        return !isToday(new Date(notification.createdAt));
      } catch (e) {
        return true; // 如果日期解析错误，默认显示在更早
      }
    });
  });

  // 空状态描述
  const emptyDescription = computed(() => {
    return activeFilter.value === 'unread' ? '没有未读通知' : '暂无通知';
  });

  // 初始化
  onMounted(async () => {
    await notificationStore.fetchNotifications(1, props.limit);
    // 监听窗口聚焦事件，重新获取通知
    window.addEventListener('focus', onWindowFocus);
  });

  // 在组件销毁时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('focus', onWindowFocus);
  });

  // 窗口聚焦时重新加载通知
  function onWindowFocus() {
    if (document.visibilityState === 'visible') {
      notificationStore.fetchUnreadCount();
    }
  }

  // 切换过滤器
  function switchFilter(filter: 'all' | 'unread') {
    if (activeFilter.value !== filter) {
      activeFilter.value = filter;
      // 触发动画
      triggerScrollbarRefresh();
    }
  }

  // 触发滚动条刷新
  function triggerScrollbarRefresh() {
    scrollTrigger.value = 'hover';
    nextTick(() => {
      scrollTrigger.value = 'none';
    });
  }

  // 更改filter时，更新通知列表
  watch(activeFilter, () => {
    if (activeFilter.value === 'unread' && unreadCount.value === 0) {
      // 如果切换到未读但是没有未读通知，尝试刷新数据
      notificationStore.fetchUnreadCount();
    }
  });

  // 根据通知类型获取图标组件
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'comment':
        return ChatbubbleOutline;
      case 'like':
        return HeartOutline;
      case 'subscription':
      case 'subscribe':
        return PersonAddOutline;
      case 'video':
        return VideocamOutline;
      case 'system':
        return NotificationsOutline;
      case 'mention':
        return MailOutline;
      default:
        return MailOutline;
    }
  }

  // 根据通知类型获取样式类
  function getNotificationTypeClass(type: string) {
    switch (type) {
      case 'comment':
        return 'icon-comment';
      case 'like':
        return 'icon-like';
      case 'subscription':
      case 'subscribe':
        return 'icon-subscribe';
      case 'system':
        return 'icon-system';
      case 'video':
        return 'icon-video';
      case 'mention':
        return 'icon-mention';
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

  // 格式化完整时间
  function formatFullTime(date: string | Date | undefined) {
    if (!date) return '未知时间';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
    } catch (e) {
      return '未知时间';
    }
  }

  // 获取通知类型名称
  function getNotificationTypeName(type: string | undefined) {
    if (!type) return '系统通知';

    switch (type) {
      case 'comment':
        return '评论通知';
      case 'like':
        return '点赞通知';
      case 'subscription':
      case 'subscribe':
        return '订阅通知';
      case 'video':
        return '视频通知';
      case 'system':
        return '系统通知';
      case 'mention':
        return '提及通知';
      default:
        return '其他通知';
    }
  }

  // 获取操作按钮文本
  function getActionButtonText(type: string | undefined) {
    if (!type) return '查看详情';

    switch (type) {
      case 'comment':
        return '查看评论';
      case 'like':
        return '查看点赞';
      case 'subscription':
      case 'subscribe':
        return '查看频道';
      case 'video':
        return '观看视频';
      case 'system':
        return '了解更多';
      case 'mention':
        return '查看提及';
      default:
        return '查看详情';
    }
  }

  // 显示通知详情
  function showNotificationDetails(notification: Notification) {
    notificationDetail.value = notification;
    showNotificationModal.value = true;
  }

  // 跳转到通知目标
  function navigateToNotificationTarget() {
    if (notificationDetail.value) {
      handleNotificationClick(notificationDetail.value);
      showNotificationModal.value = false;
    }
  }

  // 处理通知点击，跳转到相关页面
  function handleNotificationClick(notification: Notification) {
    activeNotification.value = notification;

    // 通知点击动画效果
    setTimeout(() => {
      activeNotification.value = null;
    }, 500);

    // 如果有链接，跳转到指定页面
    if (notification.link) {
      router.push(notification.link);
    } else if (notification.relatedId) {
      // 根据通知类型和关联ID决定跳转路径
      let path = '';

      switch (notification.type) {
        case 'comment':
        case 'reply':
          path = `/video/${notification.relatedId}?comment=true`;
          break;
        case 'like':
        case 'video_upload':
        case 'video':
          path = `/video/${notification.relatedId}`;
          break;
        case 'subscription':
        case 'subscribe':
          path = `/channel/${notification.relatedId}`;
          break;
        case 'mention':
          path = `/video/${notification.relatedId}?comment=true&highlight=mention`;
          break;
        default:
          // 尝试猜测是视频还是频道
          if (notification.type.includes('video')) {
            path = `/video/${notification.relatedId}`;
          } else if (notification.type.includes('user') || notification.type.includes('channel')) {
            path = `/channel/${notification.relatedId}`;
          } else {
            return; // 不跳转
          }
      }

      router.push(path);
    }

    // 标记为已读
    if (!notification.read) {
      handleMarkAsRead(notification.id);
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
      // 成功后，如果当前是未读过滤，则可能需要切换到全部视图
      if (activeFilter.value === 'unread') {
        activeFilter.value = 'all';
      }
    } finally {
      isMarkingAllRead.value = false;
    }
  }

  // 加载更多通知
  async function handleLoadMore() {
    isLoadingMore.value = true;
    try {
      await notificationStore.loadMoreNotifications();
    } finally {
      isLoadingMore.value = false;
    }
  }

  // 添加刷新通知的方法
  async function reloadNotifications() {
    try {
      await notificationStore.refreshNotifications();
    } catch (error) {
      console.error('刷新通知失败', error);
    }
  }
</script>

<style scoped>
  .notification-container {
    width: 100%;
    background-color: var(--bg-color, #fff);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 200px;
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color, #ebeef5);
    flex-shrink: 0;
  }

  .notification-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color-primary, #303133);
  }

  .header-actions {
    display: flex;
    align-items: center;
  }

  .notification-group {
    margin-bottom: 8px;
  }

  .notification-group-title {
    padding: 8px 16px;
    font-size: 12px;
    color: var(--text-color-tertiary, #909399);
    background-color: var(--bg-color-secondary, #f5f7fa);
    border-radius: 2px;
  }

  .notification-list {
    padding: 0;
    flex: 1;
  }

  .notification-item {
    display: flex;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color, #f5f7fa);
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .notification-item:hover {
    background-color: var(--hover-color, #f5f7fa);
  }

  .notification-item.unread {
    background-color: var(--unread-bg-color, #f0f9ff);
  }

  .notification-item.active {
    background-color: var(--active-bg-color, #e6f7ff);
  }

  .notification-item.active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(64, 158, 255, 0.1);
    animation: pulse 0.5s;
  }

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }

    100% {
      opacity: 0;
    }
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
    background-color: var(--icon-bg-color, #e6e6e6);
    color: var(--text-color-secondary, #606266);
    transition: all 0.3s ease;
  }

  .notification-icon.icon-comment {
    background-color: var(--comment-color-bg, rgba(64, 158, 255, 0.1));
    color: var(--comment-color, #409eff);
  }

  .notification-icon.icon-like {
    background-color: var(--like-color-bg, rgba(245, 108, 108, 0.1));
    color: var(--like-color, #f56c6c);
  }

  .notification-icon.icon-subscribe {
    background-color: var(--subscribe-color-bg, rgba(103, 194, 58, 0.1));
    color: var(--subscribe-color, #67c23a);
  }

  .notification-icon.icon-system {
    background-color: var(--system-color-bg, rgba(230, 162, 60, 0.1));
    color: var(--system-color, #e6a23c);
  }

  .notification-icon.icon-video {
    background-color: var(--video-color-bg, rgba(128, 128, 255, 0.1));
    color: var(--video-color, #8080ff);
  }

  .notification-icon.icon-mention {
    background-color: var(--mention-color-bg, rgba(128, 90, 213, 0.1));
    color: var(--mention-color, #805ad5);
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-title {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--text-color-primary, #303133);
  }

  .notification-message {
    font-size: 14px;
    color: var(--text-color-secondary, #606266);
    margin-bottom: 4px;
    word-break: break-word;
  }

  .notification-time {
    font-size: 12px;
    color: var(--text-color-tertiary, #909399);
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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 150px;
  }

  .load-more {
    text-align: center;
    padding: 8px 0;
    border-top: 1px solid var(--border-color, #f5f7fa);
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

  .notification-detail {
    margin-bottom: 16px;
  }

  .notification-detail-time,
  .notification-detail-type,
  .notification-detail-related {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-secondary, #606266);
  }

  .notification-detail-time .n-icon,
  .notification-detail-type .n-icon {
    margin-right: 4px;
  }

  .notification-detail-content {
    padding: 12px;
    background-color: var(--bg-color-secondary, #f5f7fa);
    border-radius: 4px;
    margin: 12px 0;
    line-height: 1.5;
    color: var(--text-color-primary, #303133);
  }

  .notification-detail-actions {
    margin-top: 16px;
  }

  /* 暗色主题适配 */
  :deep([data-theme="dark"]) .notification-container {
    background-color: var(--bg-color-overlay, #1f1f1f);
    color: var(--text-color-primary, #e5e5e5);
  }

  :deep([data-theme="dark"]) .notification-header {
    border-color: var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .notification-header h3 {
    color: var(--text-color-primary, #e5e5e5);
  }

  :deep([data-theme="dark"]) .notification-group-title {
    background-color: var(--bg-color-secondary-dark, #252525);
    color: var(--text-color-tertiary, #7a7a7a);
  }

  :deep([data-theme="dark"]) .notification-item {
    border-color: var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .notification-item:hover {
    background-color: var(--hover-color, #27272a);
  }

  :deep([data-theme="dark"]) .notification-item.unread {
    background-color: var(--unread-bg-color-dark, rgba(24, 144, 255, 0.1));
  }

  :deep([data-theme="dark"]) .notification-item.active {
    background-color: var(--active-bg-color-dark, rgba(24, 144, 255, 0.15));
  }

  :deep([data-theme="dark"]) .notification-title {
    color: var(--text-color-primary, #e5e5e5);
  }

  :deep([data-theme="dark"]) .notification-message {
    color: var(--text-color-secondary, #a0a0a0);
  }

  :deep([data-theme="dark"]) .notification-time {
    color: var(--text-color-tertiary, #7a7a7a);
  }

  :deep([data-theme="dark"]) .load-more {
    border-color: var(--border-color, #333);
  }

  :deep([data-theme="dark"]) .empty-notification {
    color: var(--text-color-tertiary, #7a7a7a);
  }

  :deep([data-theme="dark"]) .notification-detail-content {
    background-color: var(--bg-color-secondary-dark, #252525);
    color: var(--text-color-primary, #e5e5e5);
  }

  :deep([data-theme="dark"]) .notification-detail-time,
  :deep([data-theme="dark"]) .notification-detail-type,
  :deep([data-theme="dark"]) .notification-detail-related {
    color: var(--text-color-secondary, #a0a0a0);
  }

  /* 改进深色主题图标显示 */
  :deep([data-theme="dark"]) .notification-icon {
    background-color: var(--icon-bg-color-dark, #2c2c2c);
    color: var(--text-color-secondary-dark, #a0a0a0);
  }

  :deep([data-theme="dark"]) .notification-icon.icon-comment {
    background-color: var(--comment-color-bg-dark, rgba(64, 158, 255, 0.15));
    color: var(--comment-color-dark, #52a9ff);
  }

  :deep([data-theme="dark"]) .notification-icon.icon-like {
    background-color: var(--like-color-bg-dark, rgba(245, 108, 108, 0.15));
    color: var(--like-color-dark, #ff7875);
  }

  :deep([data-theme="dark"]) .notification-icon.icon-subscribe {
    background-color: var(--subscribe-color-bg-dark, rgba(103, 194, 58, 0.15));
    color: var(--subscribe-color-dark, #85d460);
  }

  :deep([data-theme="dark"]) .notification-icon.icon-system {
    background-color: var(--system-color-bg-dark, rgba(230, 162, 60, 0.15));
    color: var(--system-color-dark, #ffb74d);
  }

  :deep([data-theme="dark"]) .notification-icon.icon-video {
    background-color: var(--video-color-bg-dark, rgba(128, 128, 255, 0.15));
    color: var(--video-color-dark, #9e9eff);
  }

  :deep([data-theme="dark"]) .notification-icon.icon-mention {
    background-color: var(--mention-color-bg-dark, rgba(128, 90, 213, 0.15));
    color: var(--mention-color-dark, #b794f6);
  }
</style>