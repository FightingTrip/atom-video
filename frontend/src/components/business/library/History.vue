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
    <div class="history-header">
      <h2>观看历史</h2>
      <div class="history-actions">
        <n-button text @click="clearHistory">清空历史记录</n-button>
        <n-button text @click="pauseHistory">{{ isHistoryPaused ? '恢复记录历史' : '暂停记录历史' }}</n-button>
      </div>
    </div>

    <div class="history-content">
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane name="all" tab="全部">
          <div class="video-list">
            <div v-for="video in filteredVideos" :key="video.id" class="video-card-wrapper">
              <VideoCardComponent :video="video" @click="handleVideoClick(video)" />
            </div>
            <n-empty v-if="filteredVideos.length === 0" description="暂无观看历史" />
          </div>
        </n-tab-pane>
        <n-tab-pane name="today" tab="今天">
          <div class="video-list">
            <div v-for="video in todayVideos" :key="video.id" class="video-card-wrapper">
              <VideoCardComponent :video="video" @click="handleVideoClick(video)" />
            </div>
            <n-empty v-if="todayVideos.length === 0" description="今天暂无观看记录" />
          </div>
        </n-tab-pane>
        <n-tab-pane name="week" tab="本周">
          <div class="video-list">
            <div v-for="video in weekVideos" :key="video.id" class="video-card-wrapper">
              <VideoCardComponent :video="video" @click="handleVideoClick(video)" />
            </div>
            <n-empty v-if="weekVideos.length === 0" description="本周暂无观看记录" />
          </div>
        </n-tab-pane>
        <n-tab-pane name="earlier" tab="更早">
          <div class="video-list">
            <div v-for="video in earlierVideos" :key="video.id" class="video-card-wrapper">
              <VideoCardComponent :video="video" @click="handleVideoClick(video)" />
            </div>
            <n-empty v-if="earlierVideos.length === 0" description="暂无更早观看记录" />
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>

    <div class="history-pagination">
      <n-pagination v-model:page="currentPage" v-model:page-size="pageSize" :item-count="total"
        :page-sizes="[12, 24, 36, 48]" show-size-picker @update:page="handlePageChange"
        @update:page-size="handleSizeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { NButton, NTabs, NTabPane, NPagination, NEmpty, useMessage } from 'naive-ui';
  import type { Video } from '@/types';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import { historyApi } from '@/mock/videos';
  import { useUserStore } from '@/stores/user';

  const router = useRouter();
  const message = useMessage();
  const userStore = useUserStore();

  // 状态
  const activeTab = ref('all');
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(0);
  const isHistoryPaused = ref(false);
  const loading = ref(false);
  const historyVideos = ref<Video[]>([]);

  // 计算属性
  const filteredVideos = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyVideos.value.slice(start, end);
  });

  const todayVideos = computed(() => {
    return historyVideos.value.filter(video => {
      const today = new Date();
      const videoDate = new Date(video.createdAt);
      return videoDate.toDateString() === today.toDateString();
    });
  });

  const weekVideos = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return historyVideos.value.filter(video => {
      const videoDate = new Date(video.createdAt);
      return videoDate >= weekAgo;
    });
  });

  const earlierVideos = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return historyVideos.value.filter(video => {
      const videoDate = new Date(video.createdAt);
      return videoDate < weekAgo;
    });
  });

  // 方法
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const clearHistory = async () => {
    try {
      await historyApi.clearHistory(userStore.userId);
      historyVideos.value = [];
      total.value = 0;
      message.success('历史记录已清空');
    } catch (error) {
      message.error('清空历史记录失败');
      console.error('清空历史记录失败:', error);
    }
  };

  const pauseHistory = () => {
    isHistoryPaused.value = !isHistoryPaused.value;
    message.success(isHistoryPaused.value ? '已暂停记录历史' : '已恢复记录历史');
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
    loadHistory();
  };

  const handlePageChange = (val: number) => {
    currentPage.value = val;
    loadHistory();
  };

  const loadHistory = async () => {
    if (loading.value) return;

    loading.value = true;
    try {
      const videos = await historyApi.getHistory(userStore.userId);
      historyVideos.value = videos;
      total.value = videos.length;
    } catch (error) {
      message.error('加载历史记录失败');
      console.error('加载历史记录失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 生命周期钩子
  onMounted(() => {
    loadHistory();
  });
</script>

<style scoped>
  .history-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: var(--bg-color);
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .history-header h2 {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }

  .history-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .history-content {
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    padding: var(--spacing-lg);
  }

  .video-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
  }

  .video-card-wrapper {
    transition: transform var(--transition-normal);
  }

  .video-card-wrapper:hover {
    transform: scale(1.05);
  }

  .history-pagination {
    margin-top: var(--spacing-xl);
    display: flex;
    justify-content: center;
  }

  /* 暗色模式特定样式 */
  :root.dark .history-container,
  .dark-mode .history-container {
    background-color: var(--bg-color-dark);
  }

  :root.dark .history-header h2,
  .dark-mode .history-header h2 {
    color: var(--text-color-dark);
  }

  :root.dark .history-content,
  .dark-mode .history-content {
    background-color: var(--bg-color-dark);
  }

  :root.dark .video-card-wrapper,
  .dark-mode .video-card-wrapper {
    background-color: var(--bg-color-darker);
  }

  :root.dark .n-tabs-tab,
  .dark-mode .n-tabs-tab {
    color: var(--text-color-secondary);
  }

  :root.dark .n-tabs-tab--active,
  .dark-mode .n-tabs-tab--active {
    color: var(--text-color);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .history-container {
      padding: 16px;
    }

    .history-content {
      padding: var(--spacing-md);
    }

    .video-list {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-sm);
    }

    .history-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .history-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>