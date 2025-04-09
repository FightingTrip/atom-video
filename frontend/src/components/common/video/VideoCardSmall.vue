/**
* @file VideoCardSmall.vue
* @description 小型视频卡片组件 - 用于在推荐视频列表中显示视频信息
* @author Atom Video Team
* @date 2025-04-09
*/
<template>
  <div class="video-card-small" @click="$emit('click')" :class="{ 'loading': !video }">
    <!-- 视频缩略图 -->
    <div class="thumbnail-container">
      <img v-if="video" :src="video.thumbnail" :alt="video.title" class="thumbnail" loading="lazy"
        @error="handleImageError" />
      <div v-if="video && video.duration" class="duration">
        {{ formatDuration(video.duration) }}
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="info-container">
      <h4 class="title">{{ video?.title || '加载中...' }}</h4>
      <div class="meta">
        <span class="author">{{ video?.author?.nickname || '加载中...' }}</span>
        <div class="stats">
          <span class="views">{{ video ? formatViews(video.views) + ' 次观看' : '' }}</span>
          <span v-if="video?.createdAt" class="date">· {{ formatTime(video.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { Video } from '@/types';
  import { formatDuration, formatViews, formatTime } from '@/utils/format';

  defineProps<{
    video?: Video
  }>();

  defineEmits<{
    (e: 'click'): void
  }>();

  // 处理图片加载错误
  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    target.src = '/images/fallback-thumbnail.jpg';
  };
</script>

<style scoped>
  .video-card-small {
    display: flex;
    gap: 12px;
    padding: 8px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-normal);
    background-color: var(--related-videos-bg);
  }

  .video-card-small:hover {
    background-color: var(--tertiary-bg);
  }

  .thumbnail-container {
    position: relative;
    width: 120px;
    height: 68px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    flex-shrink: 0;
    background-color: var(--border-medium);
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 12px;
    padding: 1px 4px;
    border-radius: 2px;
    font-weight: 500;
  }

  .info-container {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 4px;
    color: var(--text-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    flex-direction: column;
  }

  .author {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stats {
    font-size: 12px;
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
  }

  .views,
  .date {
    white-space: nowrap;
  }

  /* 深色模式适配 */
  :root.dark .video-card-small,
  .dark-mode .video-card-small {
    background-color: var(--related-videos-bg);
  }

  :root.dark .video-card-small:hover,
  .dark-mode .video-card-small:hover {
    background-color: var(--tertiary-bg);
  }

  /* 加载状态 */
  .loading .thumbnail-container {
    background-color: var(--border-light);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }

    50% {
      opacity: 0.8;
    }

    100% {
      opacity: 0.6;
    }
  }
</style>