/**
* @file Home.vue
* @description 首页信息流，展示用户关注的创作者发布的视频
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 关注视频流：展示用户关注的创作者发布的视频
* - 视频分类：支持按类型筛选视频
* - 视频排序：支持按时间、热度等排序
* - 无限滚动：支持下拉加载更多视频
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
*/
<template>
  <div class="home-container">
    <!-- 分类导航 -->
    <nav class="category-nav">
      <div class="max-w-screen-2xl mx-auto px-4">
        <n-scrollbar x-scrollable class="scrollbar-hide">
          <div class="flex space-x-4 py-2">
            <n-button v-for="category in categories" :key="category.value"
              :type="currentCategory === category.value ? 'primary' : 'default'"
              :ghost="currentCategory !== category.value" @click="handleCategoryChange(category.value)">
              <template #icon>
                <n-icon>
                  <component :is="category.icon" />
                </n-icon>
              </template>
              {{ category.label }}
            </n-button>
          </div>
        </n-scrollbar>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-screen-2xl mx-auto">
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" class="mx-4 my-4" closable @close="error = null">
        {{ error }}
      </n-alert>

      <!-- 视频网格 -->
      <div class="px-4">
        <n-virtual-list :items="videos" :item-size="300" :container-style="{ height: 'calc(100vh - 200px)' }"
          :grid="{ cols: gridCols, itemSize: 300 }" @scroll="handleScroll">
          <template #default="{ item }">
            <VideoCard :video="item" class="video-card-hover" />
          </template>
        </n-virtual-list>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <n-spin size="large" />
        </div>

        <!-- 无数据提示 -->
        <div v-if="!loading && videos.length === 0" class="flex flex-col items-center justify-center py-16">
          <n-empty description="暂无视频" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { NButton, NSpin, NEmpty, NIcon, NScrollbar, NAlert, NVirtualList } from 'naive-ui';
  import {
    VideocamOutline,
    GameControllerOutline,
    MusicalNotesOutline,
    FastFoodOutline,
    HeartOutline,
    SchoolOutline,
    HappyOutline,
    FootballOutline,
    EllipsisHorizontalOutline
  } from '@vicons/ionicons5';
  import VideoCard from '@/components/video/VideoCard.vue';
  import { useVideoStore } from '@/stores/video';
  import { useBreakpoint } from '@/composables/useBreakpoint';
  import type { Video } from '@/types';

  const router = useRouter();
  const videoStore = useVideoStore();
  const { breakpoint } = useBreakpoint();

  // 状态
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const hasMore = ref(true);
  const currentPage = ref(1);
  const currentCategory = ref('all');
  const error = ref<string | null>(null);

  // 分类配置
  const categories = [
    { label: '全部', value: 'all', icon: VideocamOutline },
    { label: '游戏', value: 'game', icon: GameControllerOutline },
    { label: '音乐', value: 'music', icon: MusicalNotesOutline },
    { label: '美食', value: 'food', icon: FastFoodOutline },
    { label: '生活', value: 'life', icon: HeartOutline },
    { label: '教育', value: 'education', icon: SchoolOutline },
    { label: '娱乐', value: 'entertainment', icon: HappyOutline },
    { label: '体育', value: 'sports', icon: FootballOutline },
    { label: '更多', value: 'more', icon: EllipsisHorizontalOutline }
  ];

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

  // 获取视频列表
  const fetchVideos = async (reset = false) => {
    if (loading.value) return;

    try {
      loading.value = true;
      error.value = null;

      if (reset) {
        currentPage.value = 1;
        videos.value = [];
      }

      const response = await videoStore.getVideos(
        currentPage.value,
        currentCategory.value === 'all' ? undefined : currentCategory.value
      );

      if (currentPage.value === 1) {
        videos.value = response.videos;
      } else {
        videos.value.push(...response.videos);
      }

      hasMore.value = response.hasMore;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取视频列表失败';
      console.error('Failed to fetch videos:', err);
    } finally {
      loading.value = false;
    }
  };

  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    currentCategory.value = category;
    fetchVideos(true);
  };

  // 处理滚动加载
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollHeight - scrollTop - clientHeight < 100 && !loading.value && hasMore.value) {
      currentPage.value++;
      fetchVideos();
    }
  };

  // 生命周期钩子
  onMounted(() => {
    fetchVideos();
  });

  onUnmounted(() => {
    // 清理工作
    videos.value = [];
    currentPage.value = 1;
    hasMore.value = true;
  });
</script>

<style scoped>
  .home-container {
    @apply min-h-screen bg-gray-50 dark:bg-gray-900 pt-4;
  }

  .category-nav {
    background-color: var(--n-color);
    position: sticky;
    top: 64px;
    z-index: 10;
    border-bottom: 1px solid var(--n-border-color);
  }

  /* 隐藏滚动条但保持功能 */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* 视频卡片悬停效果 */
  .video-card-hover {
    @apply transition-all duration-300 ease-in-out;
  }

  .video-card-hover:hover {
    @apply transform scale-105 shadow-lg;
  }
</style>