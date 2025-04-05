/**
* @file VideoList.vue
* @description 视频列表组件，用于展示视频列表
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 视频列表：展示视频列表
* - 视频分类：支持按分类筛选视频
* - 视频排序：支持按时间、热度等排序
* - 视频搜索：支持搜索视频标题和描述
* - 分页加载：支持分页加载更多视频
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
*/

<template>
  <div ref="containerRef" class="video-list">
    <!-- 加载状态 -->
    <div v-if="loading && !videos.length" class="loading-state">
      <n-spin size="large" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <n-icon size="48" class="error-icon">
        <AlertCircleIcon />
      </n-icon>
      <p class="error-text">{{ error }}</p>
      <n-button @click="retry">
        重试
      </n-button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!videos.length" class="empty-state">
      <n-icon size="48" class="empty-icon">
        <VideocamOffIcon />
      </n-icon>
      <p class="empty-text">暂无视频</p>
    </div>

    <!-- 视频列表 -->
    <div v-else class="video-grid">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="handleVideoClick(video)" />
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <n-button v-if="!loading" quaternary :disabled="loading" @click="loadMore">
        加载更多
      </n-button>
      <n-spin v-else size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useInfiniteScroll } from '@vueuse/core'
  import { NButton, NIcon, NSpin } from 'naive-ui'
  import {
    AlertCircleIcon,
    VideocamOffIcon
  } from '@vicons/ionicons5'
  import VideoCard from './VideoCard.vue'
  import type { Video } from '@/types'
  import { useVideoStore } from '@/stores/video'

  const router = useRouter()
  const videoStore = useVideoStore()
  const containerRef = ref<HTMLElement>()
  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const page = ref(1)

  const props = defineProps<{
    videos: Video[]
    loading: boolean
    error: string | null
    hasMore: boolean
  }>()

  const emit = defineEmits<{
    (e: 'retry'): void
    (e: 'load-more'): void
    (e: 'video-click', video: Video): void
  }>()

  // 方法
  const fetchVideos = async () => {
    try {
      loading.value = true
      error.value = null

      // TODO: 实现视频获取逻辑
      // 模拟数据
      const response = await new Promise<Video[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              title: '示例视频 1',
              description: '这是一个示例视频',
              coverUrl: 'https://picsum.photos/320/180',
              videoUrl: 'https://example.com/video1.mp4',
              duration: 120,
              viewCount: 1000,
              likeCount: 100,
              favoriteCount: 50,
              createdAt: new Date().toISOString(),
              author: {
                id: '1',
                nickname: '示例用户',
                avatarUrl: 'https://picsum.photos/100/100',
                description: '这是一个示例用户'
              },
              tags: ['示例', '视频']
            },
            // ... 更多视频数据
          ])
        }, 1000)
      })

      if (page.value === 1) {
        videos.value = response
      } else {
        videos.value.push(...response)
      }

      hasMore.value = response.length === 10 // 假设每页 10 个视频
    } catch (err) {
      error.value = '加载失败，请重试'
      console.error('Failed to fetch videos:', err)
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return
    page.value++
    await fetchVideos()
  }

  const retry = () => {
    page.value = 1
    fetchVideos()
  }

  const handleVideoClick = (video: Video) => {
    router.push(`/videos/${video.id}`)
  }

  // 无限滚动
  useInfiniteScroll(
    containerRef,
    () => {
      if (!loading.value && hasMore.value) {
        loadMore()
      }
    },
    { distance: 10 }
  )

  // 生命周期钩子
  onMounted(() => {
    fetchVideos()
  })

  onUnmounted(() => {
    // 清理工作
  })
</script>

<style scoped>
  .video-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    min-height: 100vh;
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    text-align: center;
  }

  .loading-text,
  .error-text,
  .empty-text {
    margin: var(--spacing-md) 0 0;
    font-size: var(--text-base);
    color: var(--text-color);
  }

  .error-icon,
  .empty-icon {
    color: var(--text-color-secondary);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    width: 100%;
  }

  .load-more {
    display: flex;
    justify-content: center;
    padding: var(--spacing-lg) 0;
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .video-list {
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }

    .video-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
  }
</style>