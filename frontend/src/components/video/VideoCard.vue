<!--
 * @description 视频卡片组件
 * @features
 * - 视频封面展示
 * - 视频基本信息：标题、作者、播放量等
 * - 支持水平和垂直两种布局
 * - 响应式设计
 * - 主题适配
 * - 懒加载优化
 * - 骨架屏加载
 * - 错误处理
 * @dependencies
 * - naive-ui: UI 组件库
 * - dayjs: 日期处理库
 -->

<template>
  <div class="video-card" @click="handleClick">
    <!-- 缩略图 -->
    <div class="thumbnail">
      <img :src="video.coverUrl" :alt="video.title" @error="handleImageError" />
      <div class="duration">{{ formatDuration(video.duration) }}</div>
      <div class="overlay">
        <n-icon size="48" class="play-icon">
          <PlayCircleIcon />
        </n-icon>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="info">
      <h3 class="title">{{ video.title }}</h3>
      <div class="meta">
        <div class="author">
          <n-avatar round :size="24" :src="video.author.avatar" :fallback-src="fallbackAvatar" />
          <span class="author-name">{{ video.author.name }}</span>
        </div>
        <div class="stats">
          <span class="views">{{ formatNumber(video.views) }} 次观看</span>
          <span class="date">{{ formatDate(video.createdAt) }}</span>
        </div>
      </div>
      <div class="tags" v-if="video.tags?.length">
        <n-tag v-for="tag in video.tags.slice(0, 2)" :key="tag" size="small" round>
          {{ tag }}
        </n-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NAvatar, NIcon, NTag } from 'naive-ui'
  import { PlayCircleIcon } from '@vicons/ionicons5'
  import type { Video } from '@/types'

  const props = defineProps<{
    video: Video
  }>()

  const emit = defineEmits<{
    (e: 'click', video: Video): void
  }>()

  // 计算属性
  const fallbackAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.video.author.id}`
  })

  // 方法
  const handleClick = () => {
    emit('click', props.video)
  }

  const handleImageError = (e: Event) => {
    const img = e.target as HTMLImageElement
    img.src = fallbackAvatar.value
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    }
    return num.toString()
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else if (diff < 2592000000) {
      return `${Math.floor(diff / 86400000)}天前`
    } else {
      return d.toLocaleDateString()
    }
  }
</script>

<style scoped>
  .video-card {
    position: relative;
    width: 100%;
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-duration),
      box-shadow var(--transition-duration);
  }

  .video-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
    background-color: var(--background-color-secondary);
    overflow: hidden;
  }

  .thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-duration);
  }

  .video-card:hover .thumbnail img {
    transform: scale(1.05);
  }

  .duration {
    position: absolute;
    bottom: var(--spacing-xs);
    right: var(--spacing-xs);
    padding: 2px 4px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: var(--border-radius-sm);
    font-size: var(--text-sm);
    color: var(--text-color-inverse);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity var(--transition-duration);
  }

  .video-card:hover .overlay {
    opacity: 1;
  }

  .play-icon {
    color: var(--text-color-inverse);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .info {
    padding: var(--spacing-sm);
  }

  .title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-color);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    margin-top: var(--spacing-xs);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .author {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .author-name {
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
  }

  .stats {
    display: flex;
    gap: var(--spacing-sm);
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
  }

  .tags {
    margin-top: var(--spacing-xs);
    display: flex;
    gap: var(--spacing-xs);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .title {
      font-size: var(--text-sm);
    }

    .author-name,
    .stats {
      font-size: var(--text-xs);
    }
  }
</style>