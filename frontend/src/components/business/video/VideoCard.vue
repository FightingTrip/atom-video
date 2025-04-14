/**
* @file VideoCard.vue
* @description 视频卡片组件，用于显示视频缩略图、标题、作者等基本信息
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="video-card" @click="navigateToVideo">
    <div class="video-thumbnail">
      <img :src="video.thumbnailUrl || defaultThumbnail" :alt="video.title" loading="lazy" />
      <span class="video-duration">{{ formatDuration(video.duration) }}</span>
    </div>
    <div class="video-info">
      <div class="video-creator">
        <router-link :to="`/user/${video.creatorId}`" class="creator-avatar" @click.stop>
          <img :src="video.creator?.avatarUrl || defaultAvatar" :alt="video.creator?.username" />
        </router-link>
      </div>
      <div class="video-details">
        <h3 class="video-title">{{ video.title }}</h3>
        <div class="video-meta">
          <router-link :to="`/user/${video.creatorId}`" class="creator-name" @click.stop>
            {{ video.creator?.username }}
          </router-link>
          <div class="video-stats">
            <span class="view-count">{{ formatViewCount(video.viewCount) }}次观看</span>
            <span class="dot">•</span>
            <span class="upload-time">{{ formatTime(video.publishedAt || video.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';

  // 配置dayjs
  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');

  // 默认图片
  const defaultThumbnail = '/images/default-thumbnail.jpg';
  const defaultAvatar = '/images/default-avatar.jpg';

  // 接收视频数据作为props
  interface VideoProps {
    id: string;
    title: string;
    thumbnailUrl?: string;
    duration: number; // 视频时长（秒）
    viewCount: number;
    creatorId: string;
    creator?: {
      username: string;
      avatarUrl?: string;
    };
    publishedAt?: string;
    createdAt: string;
  }

  const props = defineProps<{
    video: VideoProps;
  }>();

  const router = useRouter();

  // 跳转到视频详情页
  const navigateToVideo = () => {
    router.push(`/video/${props.video.id}`);
  };

  // 格式化视频时长（转换为mm:ss格式）
  const formatDuration = (seconds: number) => {
    if (!seconds) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // 处理超过1小时的视频
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化观看次数
  const formatViewCount = (count: number) => {
    if (!count) return '0';

    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }

    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }

    return count.toString();
  };

  // 格式化时间（相对时间）
  const formatTime = (time: string) => {
    if (!time) return '';
    return dayjs(time).fromNow();
  };
</script>

<style scoped>
  .video-card {
    cursor: pointer;
    transition: transform 0.2s;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--card-bg);
  }

  .video-card:hover {
    transform: translateY(-2px);
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56.25%;
    /* 16:9 比例 */
    overflow: hidden;
    border-radius: 8px;
  }

  .video-thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  }

  .video-info {
    display: flex;
    padding: 12px 0;
    gap: 12px;
  }

  .video-creator {
    flex-shrink: 0;
  }

  .creator-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    display: block;
  }

  .creator-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-details {
    flex-grow: 1;
    overflow: hidden;
  }

  .video-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--text-primary);
  }

  .creator-name {
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
    display: block;
    margin-bottom: 2px;
  }

  .creator-name:hover {
    color: var(--primary-color);
  }

  .video-meta {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .video-stats {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dot {
    font-size: 10px;
    opacity: 0.6;
  }
</style>