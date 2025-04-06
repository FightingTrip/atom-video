<!--
 * @description 视频卡片组件
 * @features
 * - 视频信息展示：标题、作者、时长、播放量
 * - 封面展示：支持懒加载和加载失败处理
 * - 交互功能：点击跳转、悬停效果
 * - 响应式布局：适配不同屏幕尺寸
 * - 主题适配：支持亮色和暗色主题
 * @dependencies
 * - naive-ui: UI组件库
 * - @vueuse/core: 实用工具集
 * @props
 * - video: 视频信息对象
 * - loading: 是否显示加载状态
 * @emits
 * - click: 点击事件
 * - hover: 悬停事件
 -->

<template>
  <div class="video-card" @click="handleClick">
    <!-- 缩略图 -->
    <div class="thumbnail">
      <img :src="video.coverUrl" :alt="video.title" @error="handleImageError" />
      <div class="duration">{{ formatDuration(video.duration) }}</div>
      <div class="overlay">
        <n-icon size="48" class="play-icon">
          <PlayCircle />
        </n-icon>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="info">
      <h3 class="title">{{ video.title }}</h3>
      <div class="meta">
        <div class="author">
          <n-avatar round :size="24" :src="video.author.avatar" :fallback-src="fallbackAvatar" />
          <span class="author-name">{{ video.author.nickname }}</span>
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
  import { PlayCircle } from '@vicons/ionicons5'
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
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-normal),
      box-shadow var(--transition-normal);
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
    background-color: var(--secondary-bg);
    overflow: hidden;
  }

  .thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
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
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    color: var(--text-inverse);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  .video-card:hover .overlay {
    opacity: 1;
  }

  .play-icon {
    color: var(--text-inverse);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .info {
    padding: var(--spacing-md);
  }

  .title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-sm);
  }

  .author {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .author-name {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .stats {
    display: flex;
    gap: var(--spacing-sm);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .tags {
    display: flex;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
    flex-wrap: wrap;
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .info {
      padding: var(--spacing-sm);
    }

    .title {
      font-size: var(--text-sm);
    }

    .meta {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs);
    }

    .stats {
      font-size: var(--text-xs);
    }
  }
</style>