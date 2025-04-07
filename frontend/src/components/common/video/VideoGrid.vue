/**
* @file VideoGrid.vue
* @description 视频网格组件，用于以网格形式展示多个视频卡片
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="video-grid-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-grid">
        <div v-for="i in 8" :key="i" class="skeleton-item">
          <div class="skeleton-thumbnail"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-meta"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="videos.length === 0" class="empty-state">
      <div class="empty-icon">📺</div>
      <p class="empty-text">{{ emptyText }}</p>
    </div>

    <!-- 视频网格 -->
    <div v-else class="video-grid">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" :show-author="showAuthor"
        @click="handleVideoClick(video)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import VideoCard from './VideoCard.vue';

  interface VideoAuthor {
    id: string;
    name: string;
    avatar: string;
  }

  interface Video {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl: string;
    duration: number;
    views: number;
    publishedAt: string;
    author: VideoAuthor;
  }

  const props = defineProps({
    /**
     * 视频列表
     */
    videos: {
      type: Array as () => Video[],
      default: () => []
    },
    /**
     * 加载状态
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示作者信息
     */
    showAuthor: {
      type: Boolean,
      default: true
    },
    /**
     * 空状态文本
     */
    emptyText: {
      type: String,
      default: '暂无视频'
    }
  });

  const emit = defineEmits(['video-click']);

  const handleVideoClick = (video: Video) => {
    emit('video-click', video);
  };
</script>

<style scoped>
  .video-grid-container {
    width: 100%;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .loading-state {
    width: 100%;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .skeleton-item {
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--secondary-bg);
  }

  .skeleton-thumbnail {
    padding-top: 56.25%;
    /* 16:9 aspect ratio */
    background-color: var(--tertiary-bg);
    animation: pulse 1.5s infinite;
  }

  .skeleton-content {
    padding: 12px;
  }

  .skeleton-title {
    height: 20px;
    margin-bottom: 8px;
    background-color: var(--tertiary-bg);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s infinite;
  }

  .skeleton-meta {
    height: 16px;
    width: 70%;
    background-color: var(--tertiary-bg);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s infinite;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: var(--text-secondary);
  }

  .empty-text {
    font-size: 16px;
    color: var(--text-secondary);
  }

  /* 深色模式特定样式 */
  :root.dark .skeleton-item,
  .dark-mode .skeleton-item {
    background-color: var(--secondary-bg);
  }

  :root.dark .skeleton-thumbnail,
  :root.dark .skeleton-title,
  :root.dark .skeleton-meta,
  .dark-mode .skeleton-thumbnail,
  .dark-mode .skeleton-title,
  .dark-mode .skeleton-meta {
    background-color: var(--tertiary-bg);
  }

  :root.dark .empty-icon,
  :root.dark .empty-text,
  .dark-mode .empty-icon,
  .dark-mode .empty-text {
    color: var(--text-secondary);
  }

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }

    50% {
      opacity: 0.4;
    }

    100% {
      opacity: 0.6;
    }
  }

  @media (max-width: 768px) {

    .video-grid,
    .skeleton-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 480px) {

    .video-grid,
    .skeleton-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
</style>