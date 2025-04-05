<template>
  <div class="video-card group cursor-pointer" @click="navigateToVideo">
    <div class="relative overflow-hidden rounded-lg mb-2">
      <img :src="video.thumbnail" :alt="video.title"
        class="w-full aspect-video object-cover transform transition hover:scale-105">
      <span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
        {{ video.duration }}
      </span>
    </div>

    <div class="flex">
      <div class="mr-3 flex-shrink-0">
        <img :src="video.author.avatar" :alt="video.author.name" class="w-10 h-10 rounded-full object-cover">
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="text-base font-medium text-gray-700 dark:text-gray-300 line-clamp-2 mb-1 group-hover:text-blue-500">
          {{ video.title }}
        </h3>
        <div class="flex flex-col text-sm text-gray-700 dark:text-gray-300">
          <span>
            {{ video.author.name }}
            <span v-if="video.author.verified" class="ml-1">
              <i class="fas fa-check-circle text-blue-500"></i>
            </span>
          </span>
          <span>
            {{ formatViews(video.views) }} 次观看 • {{ video.publishTime }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Video } from '@/types'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const props = defineProps<{
    video: Video
  }>()

  const navigateToVideo = () => {
    router.push(`/video/${props.video.id}`)
  }

  // 格式化观看次数
  const formatViews = (views: string) => {
    const viewCount = parseInt(views, 10)
    if (!isNaN(viewCount) && viewCount >= 10000) {
      return (viewCount / 10000).toFixed(1) + '万'
    }
    return views
  }

  // 格式化视频时长
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const remainingSeconds = Math.floor(duration % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 格式化发布时间
  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diff = now.getTime() - past.getTime()

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `${years}年前`
    if (months > 0) return `${months}个月前`
    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  }

  // 调试属性 用来视频的数据
  // console.log('Video object:', JSON.stringify(props.video, null, 2))
</script>

<style scoped>
  .video-card {
    transition: transform 0.2s ease;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  /* 确保内容不溢出 */
  .video-card h3,
  .video-card span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 允许标题多行显示 */
  .video-card h3 {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>