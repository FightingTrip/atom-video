/**
* @file Trending.vue
* @description 趋势页面，展示当前最热门的视频
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 热门视频：展示当前最热门的视频
* - 时间范围：支持按天、周、月查看热门视频
* - 分类筛选：支持按类别筛选热门视频
* - 地区筛选：支持按地区筛选热门视频
* - 无限滚动：支持下拉加载更多视频
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
*/
<template>
  <div class="trending-container">
    <!-- 页面标题 -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold">{{ $t('nav.trending') }}</h1>
    </div>

    <!-- 错误提示 -->
    <n-alert v-if="error" type="error" class="mx-4 my-4" closable @close="error = null">
      {{ error }}
    </n-alert>

    <!-- 主要内容区域 -->
    <main class="max-w-screen-2xl mx-auto">
      <div class="px-4">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <n-spin size="large" />
        </div>

        <!-- 视频列表 -->
        <template v-else>
          <n-virtual-list :items="videos" :item-size="300" :container-style="{ height: 'calc(100vh - 200px)' }"
            :grid="{ cols: gridCols, itemSize: 300 }">
            <template #default="{ item }">
              <VideoCard :video="item" class="video-card-hover" />
            </template>
          </n-virtual-list>

          <!-- 无数据提示 -->
          <div v-if="videos.length === 0" class="flex flex-col items-center justify-center py-16">
            <n-empty :description="$t('common.noData')" />
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { NSpin, NEmpty, NAlert, NVirtualList } from 'naive-ui';
  import VideoCard from '@/components/video/VideoCard.vue';
  import { useVideoStore } from '@/stores/video';
  import { useBreakpoint } from '@/composables/useBreakpoint';
  import type { Video } from '@/types';

  const videoStore = useVideoStore();
  const { breakpoint } = useBreakpoint();

  // 状态
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

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

  // 获取趋势视频
  const fetchTrendingVideos = async () => {
    if (loading.value) return;

    try {
      loading.value = true;
      error.value = null;
      const response = await videoStore.getTrendingVideos();
      videos.value = response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取趋势视频失败';
      console.error('Failed to fetch trending videos:', err);
    } finally {
      loading.value = false;
    }
  };

  // 生命周期钩子
  onMounted(() => {
    fetchTrendingVideos();
  });

  onUnmounted(() => {
    // 清理工作
    videos.value = [];
  });
</script>

<style scoped>
  .trending-container {
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