/**
* @file HomeComponent.vue
* @description 首页组件 - 展示首页内容的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="home">
    <!-- 页面标题和整合的分类菜单 -->
    <div class="page-header">
      <h1 class="page-title">为你推荐</h1>
      <div class="header-controls">
        <CategoryTabs v-model="activeRecommendTab" :tabs="recommendationTabs" @change="handleCategoryChange" />
      </div>
    </div>

    <!-- 推荐视频区域 -->
    <section class="video-section">
      <VideoGridComponent :videos="filteredRecommendedVideos" :loading="loading" :disableToolbar="true"
        @video-click="handleVideoClick" @watch-later="handleWatchLater" />
    </section>

    <!-- 热门视频区域 -->
    <section class="video-section">
      <h2 class="section-title">热门视频</h2>
      <VideoGridComponent :videos="trendingVideos" :loading="loading" :disableToolbar="true"
        @video-click="handleVideoClick" @watch-later="handleWatchLater" />
    </section>

    <!-- 最新视频区域 -->
    <section class="video-section">
      <h2 class="section-title">最新视频</h2>
      <VideoGridComponent :videos="latestVideos" :loading="loading" :disableToolbar="true"
        @video-click="handleVideoClick" @watch-later="handleWatchLater" />
    </section>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, defineAsyncComponent, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  import { useVideo } from '@/composables/useVideo';
  import { useToast } from '@/composables/useToast';
  import { NButton, NButtonGroup, NIcon } from 'naive-ui';
  import { GridOutline, ListOutline } from '@vicons/ionicons5';
  import VideoGridComponent from '@/components/common/video/VideoGridComponent.vue';
  import VideoListComponent from '@/components/business/video/VideoListComponent.vue';
  import CategoryTabs from '@/components/common/controls/CategoryTabs.vue';

  // 懒加载非关键组件
  const VideoCard = defineAsyncComponent(() => import('@/components/business/video/VideoCardComponent.vue'));
  const LoadingSpinner = defineAsyncComponent(() => import('@/components/common/loading/LoadingSpinner.vue'));
  const ErrorMessage = defineAsyncComponent(() => import('@/components/common/feedback/ErrorMessage.vue'));

  import type { Video } from '@/types';

  const router = useRouter();
  const userStore = useUserStore();
  const toast = useToast();

  // 视频分类标签
  const recommendationTabs = [
    { id: 'all', name: '全部' },
    { id: 'recent', name: '最近观看' },
    { id: 'trending', name: '热门' },
    { id: 'new', name: '新发布' }
  ];

  // 状态
  const viewMode = ref<'grid' | 'list'>('grid');
  const loading = ref(false);
  const error = ref<string | null>(null);
  const activeRecommendTab = ref('all');
  const recommendVideos = ref<Video[]>([]);
  const trendingVideos = ref<Video[]>([]);
  const latestVideos = ref<Video[]>([]);

  // 模拟观看历史数据
  const watchHistory = ref<Record<string, number>>({
    'rec-1': 35, // 35% 的观看进度
    'rec-3': 62,
    'trend-2': 90,
  });

  // 基于当前选中的分类标签过滤推荐视频
  const filteredRecommendedVideos = computed(() => {
    if (activeRecommendTab.value === 'all') {
      return recommendVideos.value;
    } else if (activeRecommendTab.value === 'recent') {
      // 过滤出已观看过的视频
      return recommendVideos.value.filter(video =>
        Object.keys(watchHistory.value).includes(video.id)
      );
    } else if (activeRecommendTab.value === 'trending') {
      // 按观看量排序
      return [...recommendVideos.value].sort((a, b) => b.views - a.views);
    } else if (activeRecommendTab.value === 'new') {
      // 按发布日期排序（最新的在前）
      return [...recommendVideos.value].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return recommendVideos.value;
  });

  // 组合式函数
  const { fetchRecommendedVideos, fetchTrendingVideos, fetchLatestVideos } = useVideo();

  // 获取视频观看进度
  const getWatchProgress = (videoId: string) => {
    return watchHistory.value[videoId] || 0;
  };

  // 获取推荐理由
  const getRecommendReason = (video: Video) => {
    // 根据视频属性或用户历史为视频添加推荐理由
    if (Object.keys(watchHistory.value).includes(video.id)) {
      return '继续观看';
    } else if (video.views > 50000) {
      return '热门推荐';
    } else if (new Date(video.createdAt).getTime() > Date.now() - 86400000 * 3) {
      return '新发布';
    }
    return '';
  };

  // 方法
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // 添加到稍后观看
  const handleWatchLater = (video: Video) => {
    toast.success(`已将《${video.title}》添加到稍后观看`);
    // 实际应用中应调用API或更新store
  };

  // 视图切换处理
  const updateView = (mode: 'grid' | 'list') => {
    viewMode.value = mode;
    // 保存用户偏好
    localStorage.setItem('preferredViewMode', mode);
  };

  // 标签切换处理
  const handleCategoryChange = (categoryId: string) => {
    activeRecommendTab.value = categoryId;
    // 可以记录用户偏好或触发其他操作
  };

  // 初始化
  onMounted(async () => {
    // 尝试从本地存储加载用户偏好的视图模式
    const savedViewMode = localStorage.getItem('preferredViewMode');
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
      viewMode.value = savedViewMode as 'grid' | 'list';
    }

    await loadData();
  });

  // 清理资源
  onUnmounted(() => {
    // 释放大型数据对象引用
    recommendVideos.value = [];
    trendingVideos.value = [];
    latestVideos.value = [];
  });

  // 数据加载函数，提取到单独函数便于重用
  const loadData = async () => {
    try {
      loading.value = true;
      error.value = null;

      // 并行加载数据
      const [recommended, trending, latest] = await Promise.all([
        fetchRecommendedVideos(),
        fetchTrendingVideos(),
        fetchLatestVideos(),
      ]);

      // 将API返回的数据转换为Video类型
      const convertToVideo = (item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        coverUrl: item.thumbnailUrl || '',
        videoUrl: item.videoUrl || '',
        duration: item.duration || 0,
        views: item.views || 0,
        likes: item.likes || 0,
        favorites: item.favorites || 0,
        comments: item.comments || 0,
        createdAt: item.publishedAt || new Date().toISOString(),
        previewUrl: item.previewUrl || '',
        author: {
          id: item.author?.id || '',
          username: item.author?.username || item.author?.name || '',
          nickname: item.author?.nickname || item.author?.name || '',
          avatar: item.author?.avatar || '',
          verified: item.author?.verified || false
        },
        tags: item.tags || [],
        sources: [{
          url: item.videoUrl || '',
          type: 'video/mp4',
          label: '标准'
        }],
        subtitles: []
      });

      // 转换所有视频数据
      recommendVideos.value = recommended.map(convertToVideo);
      trendingVideos.value = trending.map(convertToVideo);
      latestVideos.value = latest.map(convertToVideo);
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 刷新数据
  const refreshData = async () => {
    // 清除缓存
    const { clearCache } = useVideo();
    clearCache();

    // 重新加载数据
    await loadData();
  };
</script>

<style scoped>
  .home {
    padding: 2rem;
    background-color: var(--bg-color);
    min-height: 100vh;
    position: relative;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .view-switcher-compact {
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: var(--radius-md);
    background-color: var(--bg-color-secondary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .video-section {
    margin-bottom: 3rem;
    position: relative;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-controls {
      width: 100%;
      flex-wrap: wrap;
    }

    .home {
      padding: 1.5rem;
    }
  }

  @media (max-width: 640px) {
    .home {
      padding: 1rem;
    }
  }

  /* 深色模式特定样式 */
  :root.dark .home,
  .dark-mode .home {
    background-color: #000;
  }

  :root.dark .section-title,
  .dark-mode .section-title {
    color: #fff;
  }

  :root.dark .view-switcher-compact,
  .dark-mode .view-switcher-compact {
    background-color: rgba(50, 50, 50, 0.7);
    border: 1px solid rgba(70, 70, 70, 0.5);
  }

  .loading-container,
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  /* 骨架屏样式 */
  .skeleton-section {
    margin-bottom: 3rem;
  }

  .skeleton-header {
    height: 2rem;
    width: 120px;
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {

    0%,
    100% {
      opacity: 0.6;
    }

    50% {
      opacity: 0.3;
    }
  }
</style>