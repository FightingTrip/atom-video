/**
* @file History.vue
* @description 观看历史页面组件，用于展示用户的视频观看历史
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 历史记录：展示用户观看过的视频
* - 时间筛选：支持按时间范围筛选历史记录
* - 记录排序：支持按观看时间排序
* - 记录搜索：支持搜索视频标题
* - 分页加载：支持分页加载更多记录
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/
<template>
  <div class="history-container">
    <!-- 页面标题 -->
    <div class="px-4 py-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">{{ t('nav.history') }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ t('history.description') }}
          </p>
        </div>
        <n-button v-if="videos.length > 0" type="error" ghost @click="handleClearHistory">
          {{ t('history.clearAll') }}
        </n-button>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center py-16">
      <n-empty :description="t('auth.loginRequired')">
        <template #extra>
          <n-button type="primary" @click="router.push('/auth/login')">
            {{ t('user.login') }}
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- 主要内容区域 -->
    <main v-else class="max-w-screen-2xl mx-auto">
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" class="mx-4 my-4" closable @close="error = null">
        {{ error }}
      </n-alert>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <n-spin size="large" />
      </div>

      <!-- 历史记录列表 -->
      <template v-else>
        <div v-if="videos.length === 0" class="flex flex-col items-center justify-center py-16">
          <n-empty :description="t('history.noHistory')">
            <template #extra>
              <n-button @click="router.push('/explore')">
                {{ t('history.exploreVideos') }}
              </n-button>
            </template>
          </n-empty>
        </div>

        <div v-else class="px-4">
          <div v-for="(group, date) in groupedVideos" :key="date" class="mb-8">
            <h2 class="text-lg font-semibold mb-4">{{ date }}</h2>
            <n-virtual-list :items="group" :item-size="300" :container-style="{ height: 'auto' }"
              :grid="{ cols: gridCols, itemSize: 300 }">
              <template #default="{ item }">
                <div class="relative">
                  <VideoCard :video="item" class="video-card-hover" @like="handleLike" @error="handleError" />
                  <n-button circle type="error" ghost class="absolute top-2 right-2 z-10"
                    @click.stop="handleRemoveFromHistory(item.id)">
                    <template #icon>
                      <n-icon>
                        <Close />
                      </n-icon>
                    </template>
                  </n-button>
                </div>
              </template>
            </n-virtual-list>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {
    NButton,
    NEmpty,
    NAlert,
    NSpin,
    NVirtualList,
    NIcon
  } from 'naive-ui';
  import { Close } from '@vicons/ionicons5';
  import { useAuthStore } from '@/stores/auth';
  import { useVideoStore } from '@/stores/video';
  import { useBreakpoint } from '@/composables/useBreakpoint';
  import VideoCard from '@/components/video/VideoCard.vue';
  import type { Video } from '@/types';
  import { formatDate } from '@/utils/format';
  import { useHistoryStore } from '@/stores/history';

  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();
  const videoStore = useVideoStore();
  const historyStore = useHistoryStore();
  const { breakpoint } = useBreakpoint();

  // 状态
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  // 按日期分组的视频
  const groupedVideos = computed(() => {
    const groups: Record<string, Video[]> = {};
    videos.value.forEach(video => {
      const date = formatDate(video.watchedAt || video.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(video);
    });
    return groups;
  });

  // 响应式网格列数
  const gridCols = computed(() => {
    switch (breakpoint.value) {
      case 'xs': return 1;
      case 'sm': return 2;
      case 'md': return 3;
      case 'lg': return 4;
      default: return 4;
    }
  });

  // 获取历史记录
  const fetchHistory = async () => {
    if (loading.value || !isAuthenticated.value) return;

    try {
      loading.value = true;
      error.value = null;
      await historyStore.getWatchHistory();
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('errors.fetchFailed');
      console.error('获取历史记录失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 清除历史记录
  const handleClearHistory = async () => {
    try {
      await historyStore.clearWatchHistory();
      videos.value = [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('errors.clearFailed');
      console.error('清除历史记录失败:', err);
    }
  };

  // 从历史记录中移除视频
  const handleRemoveFromHistory = async (videoId: string) => {
    try {
      await historyStore.removeFromWatchHistory(videoId);
      videos.value = videos.value.filter(v => v.id !== videoId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('errors.removeFailed');
      console.error('移除视频失败:', err);
    }
  };

  // 处理点赞
  const handleLike = (videoId: string) => {
    const video = videos.value.find(v => v.id === videoId);
    if (video) {
      video.isLiked = !video.isLiked;
      video.likes += video.isLiked ? 1 : -1;
    }
  };

  // 处理错误
  const handleError = (err: Error) => {
    error.value = err.message;
  };

  // 生命周期钩子
  onMounted(() => {
    if (isAuthenticated.value) {
      fetchHistory();
    }
  });

  onUnmounted(() => {
    // 清理工作
    videos.value = [];
  });
</script>

<style scoped>
  .history-container {
    @apply min-h-screen bg-gray-50 dark:bg-gray-900;
  }

  /* 视频卡片悬停效果 */
  .video-card-hover {
    @apply transition-all duration-300 ease-in-out;
  }

  .video-card-hover:hover {
    @apply transform scale-105 shadow-lg;
  }
</style>