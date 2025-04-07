/**
* @file VideoCard.vue
* @description 视频卡片组件，用于在列表中展示视频
*/

<template>
  <div class="video-card" :class="{ 'has-progress': watchProgress && watchProgress > 0 }" @click="handleClick"
    @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- 缩略图 -->
    <div class="thumbnail">
      <!-- 封面图 -->
      <img v-show="!isPlaying" :src="thumbnailUrl" :alt="video.title" loading="lazy" @error="handleImageError" />

      <!-- 进度条 -->
      <div v-if="watchProgress && watchProgress > 0" class="progress-bar">
        <div class="progress-fill" :style="{ width: `${watchProgress}%` }"></div>
      </div>

      <!-- 时长 -->
      <div class="duration">{{ formatDuration(video.duration) }}</div>

      <!-- 悬停操作 -->
      <div class="hover-actions" v-if="isHovering">
        <n-button class="watch-later-btn" circle secondary @click.stop="$emit('watch-later', video)">
          <template #icon>
            <n-icon>
              <TimeOutline />
            </n-icon>
          </template>
        </n-button>
      </div>

      <!-- 悬停效果 -->
      <div class="overlay">
        <n-icon size="48" class="play-icon">
          <PlayCircle />
        </n-icon>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="video-info">
      <!-- 推荐原因 -->
      <div v-if="recommendReason" class="recommend-reason">
        {{ recommendReason }}
      </div>

      <!-- 标题 -->
      <h3 class="video-title" :title="video.title">{{ video.title }}</h3>

      <!-- 作者信息 -->
      <div class="meta-info">
        <span class="author-name" :title="authorName">{{ authorName }}</span>
        <div class="stats">
          <span class="views">{{ formatViews(video.views) }} 次观看</span>
          <span class="date">{{ formatPublishTime(video.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { NIcon, NButton } from 'naive-ui';
  import { PlayCircle, TimeOutline } from '@vicons/ionicons5';
  import type { Video } from '@/types';

  const props = defineProps<{
    video: Video;
    watchProgress?: number;
    recommendReason?: string;
  }>();

  const emit = defineEmits<{
    (e: 'click', video: Video): void;
    (e: 'hover', video: Video): void;
    (e: 'watch-later', video: Video): void;
  }>();

  // 状态
  const isHovering = ref(false);
  const isPlaying = ref(false);
  const previewTimeout = ref<number | null>(null);

  // 计算属性
  const thumbnailUrl = computed(() => {
    return props.video.coverUrl || 'https://placehold.co/400x225?text=No+Image';
  });

  const authorName = computed(() => {
    return props.video.author?.nickname || props.video.author?.username || '未知作者';
  });

  // 格式化方法
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes < 60) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  const formatPublishTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffYear > 0) {
      return `${diffYear}年前`;
    } else if (diffMonth > 0) {
      return `${diffMonth}个月前`;
    } else if (diffDay > 0) {
      return `${diffDay}天前`;
    } else if (diffHour > 0) {
      return `${diffHour}小时前`;
    } else if (diffMin > 0) {
      return `${diffMin}分钟前`;
    } else {
      return '刚刚';
    }
  };

  // 事件处理
  const handleClick = () => {
    emit('click', props.video);
  };

  const handleMouseEnter = () => {
    isHovering.value = true;
    emit('hover', props.video);
  };

  const handleMouseLeave = () => {
    isHovering.value = false;

    if (previewTimeout.value) {
      clearTimeout(previewTimeout.value);
      previewTimeout.value = null;
    }
  };

  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/400x225?text=Error+Loading';
  };

  // 生命周期钩子
  onUnmounted(() => {
    if (previewTimeout.value) {
      clearTimeout(previewTimeout.value);
    }
  });
</script>

<style scoped>
  .video-card {
    position: relative;
    width: 100%;
    border-radius: var(--radius-md);
    background: #222;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .video-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 Aspect Ratio */
    background-color: #181818;
    overflow: hidden;
  }

  .thumbnail img,
  .preview-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .video-card:hover .overlay {
    opacity: 1;
  }

  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .video-info {
    padding: 12px;
  }

  .recommend-reason {
    display: inline-block;
    padding: 2px 6px;
    margin-bottom: 6px;
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
  }

  .video-title {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 6px 0;
    color: white;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
  }

  .meta-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .author-name {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  .stats span::after {
    content: "•";
    margin: 0 4px;
  }

  .stats span:last-child::after {
    content: "";
    margin: 0;
  }

  /* 进度条样式 */
  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.2);
    z-index: 2;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--accent-primary);
  }

  /* 悬停操作按钮 */
  .hover-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 3;
    display: flex;
    gap: 8px;
  }

  .watch-later-btn {
    background-color: rgba(0, 0, 0, 0.6);
    border: none;
    color: white;
    transition: background-color 0.2s ease;
  }

  .watch-later-btn:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  /* 暗色主题优化 */
  :root.dark .video-card,
  .dark-mode .video-card {
    background-color: #222;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  :root.dark .video-card:hover,
  .dark-mode .video-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  :root.dark .video-title,
  .dark-mode .video-title {
    color: white;
  }

  :root.dark .author-name,
  .dark-mode .author-name {
    color: rgba(255, 255, 255, 0.7);
  }

  :root.dark .stats,
  .dark-mode .stats {
    color: rgba(255, 255, 255, 0.5);
  }

  :root.dark .recommend-reason,
  .dark-mode .recommend-reason {
    background-color: rgba(76, 110, 245, 0.15);
    color: #60a5fa;
  }

  :root.dark .thumbnail,
  .dark-mode .thumbnail {
    background-color: #181818;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .video-title {
      font-size: 13px;
    }

    .author-name,
    .stats {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .video-card {
      margin-bottom: 16px;
    }

    .video-info {
      padding: 8px;
    }
  }
</style>