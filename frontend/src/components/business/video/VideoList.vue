/**
* @file VideoList.vue
* @description 视频列表业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<!--
 * @description 视频列表组件
 * @features
 * - 视频列表展示：支持网格和列表两种布局
 * - 无限滚动：支持滚动加载更多
 * - 加载状态：支持骨架屏和加载动画
 * - 空状态：支持自定义空状态展示
 * - 响应式布局：自适应不同屏幕尺寸
 * @dependencies
 * - naive-ui: UI组件库
 * - @vueuse/core: 实用工具集
 * @props
 * - videos: 视频列表数据
 * - loading: 是否显示加载状态
 * - layout: 布局方式（grid/list）
 * @emits
 * - load-more: 加载更多事件
 * - video-click: 视频点击事件
 -->

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
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    padding: var(--spacing-xl);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .error-container {
    color: var(--error-color);
  }

  .empty-container {
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .video-list {
      padding: var(--spacing-md);
    }

    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-md);
    }

    .loading-container,
    .error-container,
    .empty-container {
      min-height: 150px;
      padding: var(--spacing-lg);
    }
  }
</style>