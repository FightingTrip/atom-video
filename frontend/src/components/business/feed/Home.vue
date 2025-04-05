/**
* @file Home.vue
* @description 首页业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="home">
    <!-- 推荐视频区域 -->
    <section class="recommended-section">
      <h2 class="section-title">为你推荐</h2>
      <VideoGrid :videos="recommendedVideos" :loading="loading" @video-click="handleVideoClick" />
    </section>

    <!-- 热门视频区域 -->
    <section class="trending-section">
      <h2 class="section-title">热门视频</h2>
      <VideoGrid :videos="trendingVideos" :loading="loading" @video-click="handleVideoClick" />
    </section>

    <!-- 最新视频区域 -->
    <section class="latest-section">
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
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useVideo } from '@/composables/useVideo';
  import VideoGrid from '@/components/common/video/VideoGrid.vue';
  import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
  import type { Video } from '@/types';

  const router = useRouter();

  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const recommendedVideos = ref<Video[]>([]);
  const trendingVideos = ref<Video[]>([]);
  const latestVideos = ref<Video[]>([]);

  // 组合式函数
  const { fetchRecommendedVideos, fetchTrendingVideos, fetchLatestVideos } = useVideo();

  // 方法
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
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

      recommendedVideos.value = recommended;
      trendingVideos.value = trending;
      latestVideos.value = latest;
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
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }

  .recommended-section,
  .trending-section,
  .latest-section {
    margin-bottom: 3rem;
  }

  .loading-container,
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  @media (max-width: 768px) {
    .home {
      padding: 1rem;
    }

    .section-title {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
  }
</style>