/**
* @file Trending.vue
* @description 热门视频业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="trending">
    <!-- 时间范围选择器 -->
    <section class="filter-section">
      <TimeRangeSelector v-model="timeRange" @change="handleTimeRangeChange" />
    </section>

    <!-- 视频列表 -->
    <section class="video-list">
      <VideoCard v-for="(video, index) in videos" :key="video.id" :video="video" :rank="index + 1"
        @click="handleVideoClick(video)" />
    </section>

    <!-- 加载更多按钮 -->
    <div v-if="hasMore" class="load-more">
      <Button :loading="loading" @click="loadMore">
        加载更多
      </Button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading && !videos.length" class="loading-container">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !error && !videos.length" class="empty-container">
      <EmptyState message="暂无热门视频" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useVideo } from '@/composables/useVideo';
  import TimeRangeSelector from '@/components/common/filter/TimeRangeSelector.vue';
  import VideoCard from '@/components/common/video/VideoCard.vue';
  import Button from '@/components/common/button/Button.vue';
  import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
  import EmptyState from '@/components/common/feedback/EmptyState.vue';
  import type { Video } from '@/types';

  const router = useRouter();

  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const videos = ref<Video[]>([]);
  const timeRange = ref('day');
  const currentPage = ref(1);
  const hasMore = ref(true);

  // 组合式函数
  const { fetchTrendingVideos } = useVideo();

  // 方法
  const handleTimeRangeChange = async () => {
    try {
      loading.value = true;
      error.value = null;
      currentPage.value = 1;
      videos.value = [];
      hasMore.value = true;

      const result = await fetchTrendingVideos({
        page: 1,
        pageSize: 20,
        timeRange: timeRange.value,
      });

      videos.value = result;
      hasMore.value = result.length === 20;
    } catch (err) {
      error.value = '加载热门视频失败';
      console.error('加载热门视频失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    try {
      loading.value = true;
      error.value = null;
      currentPage.value++;

      const result = await fetchTrendingVideos({
        page: currentPage.value,
        pageSize: 20,
        timeRange: timeRange.value,
      });

      videos.value.push(...result);
      hasMore.value = result.length === 20;
    } catch (err) {
      error.value = '加载更多失败';
      console.error('加载更多失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // 初始化
  onMounted(async () => {
    await handleTimeRangeChange();
  });
</script>

<style scoped>
  .trending {
    padding: 2rem;
  }

  .filter-section {
    margin-bottom: 2rem;
  }

  .video-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  @media (max-width: 768px) {
    .trending {
      padding: 1rem;
    }
  }
</style>