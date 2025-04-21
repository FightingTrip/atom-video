/**
* @file VideoCard.vue
* @description 视频卡片组件，用于展示视频缩略图、标题和基本信息
* @created 2025-04-12
*/

<template>
  <div class="video-card" @click="$emit('click')">
    <!-- 视频缩略图 -->
    <div class="thumbnail-container">
      <img :src="video.coverUrl" :alt="video.title" class="thumbnail" />

      <div class="duration">{{ formatDuration(video.duration) }}</div>

      <!-- 播放进度条 (仅当有进度时显示) -->
      <div v-if="videoProgress" class="progress-bar">
        <div class="progress" :style="{ width: `${videoProgress.percentage}%` }"></div>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="video-info">
      <!-- 创作者头像 -->
      <div class="author-avatar">
        <img :src="video.author.avatar" :alt="video.author.nickname" />
      </div>

      <!-- 标题和元数据 -->
      <div class="content">
        <h3 class="title" :title="video.title">{{ video.title }}</h3>

        <div class="metadata">
          <div class="author-name">
            {{ video.author.nickname }}
            <span v-if="video.author.verified" class="verified-badge">✓</span>
          </div>

          <div class="stats">
            <span>{{ formatViews(video.views) }}次观看</span>
            <span class="dot">•</span>
            <span>{{ formatDate(video.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { Video, VideoProgress } from '@/types';
  import { useUserStore } from '@/stores/user';
  import videoService from '@/services/videoService';

  // 属性定义
  interface Props {
    video: Video;
    showProgress?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showProgress: true
  });

  // 事件
  defineEmits<{
    (e: 'click'): void;
  }>();

  // 用户存储
  const userStore = useUserStore();

  // 获取视频进度
  const videoProgress = computed<VideoProgress | null>(() => {
    if (!props.showProgress || !userStore.currentUser) {
      return null;
    }

    return videoService.getPlaybackProgress(userStore.currentUser.id, props.video.id);
  });

  // 格式化视频时长
  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 格式化观看次数
  function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}百万`;
    }

    if (views >= 10000) {
      return `${Math.floor(views / 10000)}万`;
    }

    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}千`;
    }

    return views.toString();
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '刚刚';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}天前`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}个月前`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}年前`;
  }
</script>

<style scoped>
  .video-card {
    cursor: pointer;
    transition: transform 0.2s ease;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  .thumbnail-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9宽高比 */
    overflow: hidden;
    border-radius: 8px;
    background-color: #f5f5f5;
  }

  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .video-card:hover .thumbnail {
    transform: scale(1.05);
  }

  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .progress {
    height: 100%;
    background-color: var(--primary-color, #1890ff);
  }

  .video-info {
    display: flex;
    padding: 12px 0;
    gap: 12px;
  }

  .author-avatar {
    flex-shrink: 0;
  }

  .author-avatar img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    max-height: 2.6em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .metadata {
    color: var(--text-color-secondary, rgba(0, 0, 0, 0.45));
    font-size: 12px;
  }

  .author-name {
    margin-bottom: 2px;
  }

  .verified-badge {
    display: inline-block;
    margin-left: 4px;
    color: var(--primary-color, #1890ff);
    font-size: 10px;
  }

  .stats {
    display: flex;
    align-items: center;
  }

  .dot {
    margin: 0 4px;
  }

  @media (max-width: 768px) {
    .author-avatar {
      display: none;
    }

    .video-info {
      padding: 8px 0;
    }
  }
</style>