/**
* @file VideoList.vue
* @description 视频列表业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="video-list">
    <div class="video-grid">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="handleVideoClick(video)" />
    </div>
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    <div v-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>
    <div v-if="!loading && !error && videos.length === 0" class="empty-container">
      <EmptyState message="暂无视频" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useVideo } from '@/composables/useVideo';
  import VideoCard from '@/components/common/video/VideoCard.vue';
  import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
  import EmptyState from '@/components/common/feedback/EmptyState.vue';
  import type { Video } from '@/types/video';

  const router = useRouter();
  const {
    videos,
    loading,
    error,
    fetchVideos,
  } = useVideo();

  // 处理视频点击
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // 初始化加载视频列表
  onMounted(async () => {
    await fetchVideos({
      page: 1,
      pageSize: 12,
    });
  });
</script>

<style scoped>
  .video-list {
    width: 100%;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
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
    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
      padding: 0.5rem;
    }
  }
</style>