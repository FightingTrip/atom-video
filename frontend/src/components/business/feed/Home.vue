/**
* @file Home.vue
* @description 首页业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="home">
    <!-- 推荐视频区域 -->
    <section class="video-section">
      <h2 class="section-title">为你推荐</h2>
      <div class="tabs">
        <button v-for="tab in recommendationTabs" :key="tab.id" class="tab-btn"
          :class="{ 'active': activeRecommendTab === tab.id }" @click="activeRecommendTab = tab.id">
          {{ tab.name }}
        </button>
      </div>
      <VideoGrid :videos="filteredRecommendedVideos" :loading="loading" @video-click="handleVideoClick"
        @watch-later="handleWatchLater">
        <template #video-card="{ video }">
          <VideoCard :video="video" />
        </template>
      </VideoGrid>
    </section>

    <!-- 热门视频区域 -->
    <section class="video-section">
      <h2 class="section-title">热门视频</h2>
      <VideoGrid :videos="trendingVideos" :loading="loading" @video-click="handleVideoClick" />
    </section>

    <!-- 最新视频区域 -->
    <section class="video-section">
      <h2 class="section-title">最新视频</h2>
      <VideoGrid :videos="latestVideos" :loading="loading" @video-click="handleVideoClick" />
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
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  import { useVideo } from '@/composables/useVideo';
  import { useToast } from '@/composables/useToast';
  import VideoGrid from '@/components/common/video/VideoGrid.vue';
  import VideoCard from '@/components/common/video/VideoCard.vue';
  import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
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

  // 初始化
  onMounted(async () => {
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
      recommendVideos.value = recommended.map(item => ({
        id: item.id,
        title: item.title,
        description: '', // 默认值
        coverUrl: item.thumbnailUrl,
        videoUrl: '', // 默认值
        duration: item.duration,
        views: item.views,
        likes: 0, // 默认值
        favorites: 0, // 默认值
        comments: 0, // 默认值
        createdAt: item.publishedAt, // 使用publishedAt作为createdAt
        author: {
          id: item.author.id,
          username: '', // 默认值
          nickname: item.author.name,
          avatar: item.author.avatar,
          verified: false // 默认值
        },
        tags: [], // 默认值
        sources: [], // 默认值
        subtitles: [] // 默认值
      }));

      trendingVideos.value = trending.map(item => ({
        id: item.id,
        title: item.title,
        description: '',
        coverUrl: item.thumbnailUrl,
        videoUrl: '',
        duration: item.duration,
        views: item.views,
        likes: 0,
        favorites: 0,
        comments: 0,
        createdAt: item.publishedAt,
        author: {
          id: item.author.id,
          username: '',
          nickname: item.author.name,
          avatar: item.author.avatar,
          verified: false
        },
        tags: [],
        sources: [],
        subtitles: []
      }));

      latestVideos.value = latest.map(item => ({
        id: item.id,
        title: item.title,
        description: '',
        coverUrl: item.thumbnailUrl,
        videoUrl: '',
        duration: item.duration,
        views: item.views,
        likes: 0,
        favorites: 0,
        comments: 0,
        createdAt: item.publishedAt,
        author: {
          id: item.author.id,
          username: '',
          nickname: item.author.name,
          avatar: item.author.avatar,
          verified: false
        },
        tags: [],
        sources: [],
        subtitles: []
      }));
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .home {
    padding: 2rem;
    background-color: #000;
    min-height: 100vh;
  }

  .video-section {
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 0.35rem 0.8rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #222;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tab-btn:hover {
    background-color: #333;
    color: #fff;
  }

  .tab-btn.active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  /* 响应式调整 */
  @media (max-width: 992px) {
    .home {
      padding: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
    }

    .tab-btn {
      padding: 0.25rem 0.6rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 640px) {
    .home {
      padding: 1rem;
    }

    .section-title {
      font-size: 1.125rem;
    }

    .tabs {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .tabs::-webkit-scrollbar {
      display: none;
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

  :root.dark .tab-btn,
  .dark-mode .tab-btn {
    background-color: #222;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  :root.dark .tab-btn:hover,
  .dark-mode .tab-btn:hover {
    background-color: #333;
    color: #fff;
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