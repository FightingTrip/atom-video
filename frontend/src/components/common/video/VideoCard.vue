/**
* @file VideoCard.vue
* @description 视频卡片组件，用于在列表中展示视频
*/

<template>
  <div class="video-card" @click="handleClick">
    <div class="video-thumbnail">
      <img :src="thumbnailUrl" :alt="video.title" class="thumbnail-img" />
      <div class="video-duration">{{ formatDuration(video.duration) }}</div>
    </div>
    <div class="video-info">
      <div class="video-author" v-if="showAuthor">
        <img :src="video.author.avatar" :alt="video.author.name" class="author-avatar" />
      </div>
      <div class="video-details">
        <h3 class="video-title" :title="video.title">{{ video.title }}</h3>
        <div class="video-meta" v-if="showAuthor">
          <span class="video-author-name">{{ video.author.name }}</span>
          <div class="video-stats">
            <span class="video-views">{{ formatViews(video.views) }}次观看</span>
            <span class="video-time">{{ formatTime(video.publishedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  // 视频类型定义
  interface VideoAuthor {
    id: string
    name: string
    avatar: string
  }

  interface VideoProps {
    id: string
    title: string
    description?: string
    thumbnailUrl: string
    duration: number
    views: number
    publishedAt: string
    author: VideoAuthor
  }

  const props = defineProps({
    /**
     * 视频数据
     */
    video: {
      type: Object as () => VideoProps,
      required: true
    },
    /**
     * 是否显示作者信息
     */
    showAuthor: {
      type: Boolean,
      default: true
    }
  })

  const router = useRouter()

  // 计算视频缩略图URL，如果没有则使用默认图
  const thumbnailUrl = computed(() => {
    return props.video.thumbnailUrl || '/assets/images/default-thumbnail.jpg'
  })

  // 格式化视频时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    if (minutes < 60) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 格式化观看次数
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  // 格式化发布时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    const diffMonth = Math.floor(diffDay / 30)
    const diffYear = Math.floor(diffMonth / 12)

    if (diffYear > 0) {
      return `${diffYear}年前`
    } else if (diffMonth > 0) {
      return `${diffMonth}个月前`
    } else if (diffDay > 0) {
      return `${diffDay}天前`
    } else if (diffHour > 0) {
      return `${diffHour}小时前`
    } else if (diffMin > 0) {
      return `${diffMin}分钟前`
    } else {
      return '刚刚'
    }
  }

  // 点击视频卡片跳转到视频详情页
  const handleClick = () => {
    router.push(`/video/${props.video.id}`)
  }
</script>

<style scoped>
  .video-card {
    cursor: pointer;
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .video-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .video-thumbnail {
    position: relative;
    padding-top: 56.25%;
    /* 16:9 宽高比 */
    overflow: hidden;
    background-color: var(--color-bg-secondary);
  }

  .thumbnail-img {
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
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
  }

  .video-info {
    display: flex;
    padding: 0.75rem;
  }

  .video-author {
    margin-right: 0.75rem;
  }

  .author-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .video-details {
    flex: 1;
    min-width: 0;
    /* 防止文本溢出 */
  }

  .video-title {
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0 0 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.2;
  }

  .video-meta {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  .video-author-name {
    display: block;
    margin-bottom: 0.125rem;
  }

  .video-stats {
    display: flex;
    gap: 0.5rem;
  }

  /* 响应式调整 */
  @media (max-width: 640px) {
    .video-info {
      padding: 0.5rem;
    }

    .author-avatar {
      width: 32px;
      height: 32px;
    }

    .video-title {
      font-size: 0.85rem;
    }

    .video-meta {
      font-size: 0.75rem;
    }
  }
</style>