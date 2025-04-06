/**
* @file VideoDetail.vue
* @description 视频详情页面组件
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 视频播放：支持播放、暂停、进度控制、音量调节
* - 视频信息：标题、描述、标签、观看数据
* - 作者信息：头像、昵称、简介、关注状态
* - 互动功能：点赞、收藏、分享、关注
* - 评论系统：评论发布、回复、点赞、分页加载
* - 响应式布局：适配不同屏幕尺寸
* - 主题适配：支持明暗主题切换
*
* @dependencies
* - naive-ui: UI组件库
* - @vueuse/core: 实用工具集
* - @vicons/ionicons5: 图标库
*
* @props
* - video: 视频信息对象
* - currentTime: 当前播放时间（可选）
*
* @emits
* - time-update: 播放时间更新
* - play: 开始播放
* - pause: 暂停播放
* - ended: 播放结束
* - like: 点赞操作
* - favorite: 收藏操作
* - subscribe: 关注操作
* - comment: 发表评论
* - load-more-comments: 加载更多评论
*/
<template>
  <div class="video-detail">
    <!-- 视频播放器 -->
    <video-player :video="video" :current-time="currentTime" @time-update="handleTimeUpdate" @play="handlePlay"
      @pause="handlePause" @ended="handleEnded" />

    <!-- 视频信息 -->
    <div class="video-info">
      <h1 class="title">{{ video.title }}</h1>
      <div class="meta">
        <div class="stats">
          <span class="views">{{ formatNumber(video.views) }} 次观看</span>
          <span class="date">{{ formatDate(video.createdAt) }}</span>
        </div>
        <div class="actions">
          <n-button-group>
            <n-button quaternary :type="isLiked ? 'primary' : 'default'" @click="handleLike">
              <template #icon>
                <n-icon>
                  <ThumbsUp />
                </n-icon>
              </template>
              {{ formatNumber(video.likes) }}
            </n-button>
            <n-button quaternary :type="isFavorited ? 'primary' : 'default'" @click="handleFavorite">
              <template #icon>
                <n-icon>
                  <Bookmark />
                </n-icon>
              </template>
              {{ formatNumber(video.favorites) }}
            </n-button>
            <n-button quaternary>
              <template #icon>
                <n-icon>
                  <Share />
                </n-icon>
              </template>
              分享
            </n-button>
          </n-button-group>
        </div>
      </div>
    </div>

    <!-- 作者信息 -->
    <div class="author-info">
      <div class="author-header">
        <n-avatar round :size="48" :src="video.author.avatar" :fallback-src="fallbackAvatar" />
        <div class="author-meta">
          <h3 class="author-name">{{ video.author.nickname }}</h3>
          <p class="author-bio">{{ video.author.description }}</p>
        </div>
        <n-button :type="isSubscribed ? 'primary' : 'default'" @click="handleSubscribe">
          {{ isSubscribed ? '已关注' : '关注' }}
        </n-button>
      </div>
      <div class="author-stats">
        <span>{{ formatNumber(video.author.followersCount || 0) }} 粉丝</span>
        <span>{{ formatNumber(video.author.followingCount || 0) }} 关注</span>
        <span>{{ formatNumber(video.views) }} 播放</span>
      </div>
    </div>

    <!-- 视频描述 -->
    <div class="description">
      <p>{{ video.description }}</p>
      <div class="tags" v-if="video.tags?.length">
        <n-tag v-for="tag in video.tags" :key="tag" size="small" round>
          {{ tag }}
        </n-tag>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments">
      <h2 class="comments-title">
        {{ formatNumber(video.comments) }} 条评论
      </h2>

      <!-- 评论输入 -->
      <div class="comment-input">
        <n-avatar round :size="40" :src="userAvatar" :fallback-src="fallbackUserAvatar" />
        <n-input v-model:value="commentText" type="textarea" placeholder="添加评论..."
          :autosize="{ minRows: 2, maxRows: 6 }" @keydown.enter.prevent="handleComment" />
        <n-button type="primary" :disabled="!commentText.trim()" @click="handleComment">
          评论
        </n-button>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <n-avatar round :size="40" :src="comment.author.avatar"
            :fallback-src="getFallbackAvatar(comment.author.id)" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author.nickname }}</span>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <n-button quaternary size="small">
                <template #icon>
                  <n-icon>
                    <ThumbsUp />
                  </n-icon>
                </template>
                {{ formatNumber(comment.likes) }}
              </n-button>
              <n-button quaternary size="small">
                <template #icon>
                  <n-icon>
                    <Chatbubble />
                  </n-icon>
                </template>
                回复
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMoreComments" class="load-more">
        <n-button :loading="loadingMore" :disabled="loadingMore" @click="loadMoreComments">
          加载更多
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { NButton, NButtonGroup, NIcon, NInput, NAvatar, NTag } from 'naive-ui'
  import {
    ThumbsUp,
    Bookmark,
    Share,
    Chatbubble
  } from '@vicons/ionicons5'
  import VideoPlayer from './VideoPlayer.vue'
  import type { Video, Comment } from '@/types'
  import { useAuthStore } from '@/stores/auth'

  const props = defineProps<{
    video: Video
    currentTime?: number
  }>()

  const emit = defineEmits<{
    (e: 'time-update', time: number): void
    (e: 'play'): void
    (e: 'pause'): void
    (e: 'ended'): void
    (e: 'like'): void
    (e: 'favorite'): void
    (e: 'subscribe'): void
    (e: 'comment', content: string): void
    (e: 'load-more-comments'): void
  }>()

  // 状态
  const authStore = useAuthStore()
  const currentTime = ref(props.currentTime || 0)
  const isLiked = ref(false)
  const isFavorited = ref(false)
  const isSubscribed = ref(false)
  const commentText = ref('')
  const comments = ref<Comment[]>([])
  const loadingMore = ref(false)
  const hasMoreComments = ref(true)

  // 计算属性
  const userAvatar = computed(() => authStore.user?.avatar)
  const fallbackAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.video.author.id}`
  })
  const fallbackUserAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.id}`
  })

  // 方法
  const handleTimeUpdate = (time: number) => {
    currentTime.value = time
    emit('time-update', time)
  }

  const handlePlay = () => {
    emit('play')
  }

  const handlePause = () => {
    emit('pause')
  }

  const handleEnded = () => {
    emit('ended')
  }

  const handleLike = () => {
    isLiked.value = !isLiked.value
    emit('like')
  }

  const handleFavorite = () => {
    isFavorited.value = !isFavorited.value
    emit('favorite')
  }

  const handleSubscribe = () => {
    isSubscribed.value = !isSubscribed.value
    emit('subscribe')
  }

  const handleComment = () => {
    if (!commentText.value.trim()) return
    emit('comment', commentText.value)
    commentText.value = ''
  }

  const loadMoreComments = async () => {
    if (loadingMore.value) return
    loadingMore.value = true
    await emit('load-more-comments')
    loadingMore.value = false
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

  const getFallbackAvatar = (id: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
  }
</script>

<style scoped>
  .video-detail {
    max-width: var(--container-lg);
    margin: 0 auto;
    padding: var(--spacing-lg);
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }

  .video-info {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .title {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-md);
  }

  .stats {
    display: flex;
    gap: var(--spacing-md);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .author-info {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .author-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .author-meta {
    flex: 1;
  }

  .author-name {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .author-bio {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .author-stats {
    display: flex;
    gap: var(--spacing-lg);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .description {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .tags {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
    flex-wrap: wrap;
  }

  .comments {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .comments-title {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
  }

  .comment-input {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .comment-item {
    display: flex;
    gap: var(--spacing-md);
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
  }

  .comment-author {
    font-weight: 600;
    color: var(--text-primary);
  }

  .comment-date {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .comment-text {
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    line-height: 1.5;
  }

  .comment-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    .video-detail {
      padding: var(--spacing-md);
    }

    .meta {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .author-header {
      flex-direction: column;
      text-align: center;
    }

    .author-stats {
      justify-content: center;
    }

    .comment-input {
      flex-direction: column;
    }
  }
</style>