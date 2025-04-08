<!--
 * @description 视频卡片组件
 * @features
 * - 视频信息展示：标题、作者、时长、播放量
 * - 封面展示：支持懒加载和加载失败处理
 * - 交互功能：点击跳转、悬停效果
 * - 预览功能：悬停时自动播放预览
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
  <div class="video-card" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- 缩略图 -->
    <div class="thumbnail">
      <!-- 视频预览 -->
      <video v-if="isHovering && video.previewUrl" ref="previewVideoRef" class="preview-video" muted loop
        :src="video.previewUrl" poster=""></video>

      <!-- 封面图 -->
      <img v-show="!isPlaying" :src="video.coverUrl" :alt="video.title" loading="lazy" @error="handleImageError" />

      <!-- 进度条 -->
      <div v-if="watchProgress > 0" class="progress-bar">
        <div class="progress-fill" :style="{ width: `${watchProgress}%` }"></div>
      </div>

      <!-- 时长 -->
      <div class="duration">{{ formatDuration(video.duration) }}</div>

      <!-- 悬停效果 -->
      <div class="overlay">
        <n-icon size="48" class="play-icon">
          <PlayCircle />
        </n-icon>
      </div>

      <!-- 悬停选项 -->
      <div v-if="isHovering" class="hover-actions">
        <n-tooltip>
          <template #trigger>
            <n-button quaternary circle @click.stop="handleWatchLater">
              <template #icon>
                <n-icon>
                  <TimeOutline />
                </n-icon>
              </template>
            </n-button>
          </template>
          稍后观看
        </n-tooltip>

        <n-tooltip>
          <template #trigger>
            <n-button quaternary circle @click.stop="handleAddToPlaylist">
              <template #icon>
                <n-icon>
                  <AddCircleOutline />
                </n-icon>
              </template>
            </n-button>
          </template>
          添加到播放列表
        </n-tooltip>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="info">
      <h3 class="title">{{ video.title }}</h3>
      <div class="meta">
        <div class="author" @click.stop="handleAuthorClick">
          <n-avatar round :size="24" :src="video.author.avatar" :fallback-src="fallbackAvatar" />
          <span class="author-name">{{ video.author.nickname }}</span>
        </div>
        <div class="stats">
          <span class="views">{{ formatNumber(video.views) }} 次观看</span>
          <span class="date">{{ formatDate(video.createdAt) }}</span>
        </div>
      </div>
      <div class="tags" v-if="video.tags?.length">
        <n-tag v-for="tag in video.tags.slice(0, 2)" :key="tag" size="small" round @click.stop="handleTagClick(tag)">
          {{ tag }}
        </n-tag>
      </div>
    </div>

    <!-- 稍后观看菜单 -->
    <n-modal v-model:show="showPlaylistModal" preset="card" style="width: 350px;" title="添加到播放列表">
      <div v-if="playlists.length === 0" class="empty-playlist">
        <p>暂无播放列表</p>
        <n-button size="small" @click="handleCreatePlaylist">创建播放列表</n-button>
      </div>
      <n-list v-else>
        <n-list-item v-for="playlist in playlists" :key="playlist.id">
          <n-thing>
            <template #avatar>
              <n-checkbox v-model:checked="playlist.selected" />
            </template>
            <template #header>{{ playlist.name }}</template>
            <template #description>{{ playlist.videoCount }}个视频</template>
          </n-thing>
        </n-list-item>
      </n-list>
      <div class="playlist-actions">
        <n-button size="small" @click="handleCreatePlaylist">创建新播放列表</n-button>
        <n-button type="primary" size="small" @click="saveToPlaylists">保存</n-button>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { NAvatar, NIcon, NTag, NButton, NTooltip, NModal, NList, NListItem, NThing, NCheckbox } from 'naive-ui'
  import {
    PlayCircle,
    TimeOutline,
    AddCircleOutline
  } from '@vicons/ionicons5'
  import { useHistoryStore } from '@/stores/history'
  import { useMessage } from 'naive-ui'
  import type { Video } from '@/types'

  const props = defineProps<{
    video: Video
  }>()

  const emit = defineEmits<{
    (e: 'click', video: Video): void
    (e: 'author-click', authorId: string): void
    (e: 'tag-click', tag: string): void
    (e: 'watch-later', video: Video): void
    (e: 'add-to-playlist', video: Video, playlistIds: string[]): void
  }>()

  const router = useRouter()
  const message = useMessage()
  const historyStore = useHistoryStore()

  // 状态
  const isHovering = ref(false)
  const isPlaying = ref(false)
  const previewVideoRef = ref<HTMLVideoElement>()
  const previewTimeout = ref<number | null>(null)
  const showPlaylistModal = ref(false)
  const playlists = ref([
    { id: '1', name: '收藏夹', videoCount: 12, selected: false },
    { id: '2', name: '前端技术', videoCount: 8, selected: false },
    { id: '3', name: '学习清单', videoCount: 5, selected: false }
  ])

  // 计算属性
  const fallbackAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.video.author.id}`
  })

  // 播放进度
  const watchProgress = computed(() => {
    const progress = historyStore.getVideoProgress(props.video.id)
    if (!progress || !props.video.duration) return 0
    return Math.min(100, (progress / props.video.duration) * 100)
  })

  // 方法
  const handleClick = () => {
    emit('click', props.video)
    router.push({
      name: 'video-detail',
      params: { id: props.video.id }
    })
  }

  const handleAuthorClick = () => {
    emit('author-click', props.video.author.id)
    router.push(`/user/${props.video.author.id}`)
  }

  const handleTagClick = (tag: string) => {
    emit('tag-click', tag)
    router.push(`/search?tag=${encodeURIComponent(tag)}`)
  }

  const handleImageError = (e: Event) => {
    const img = e.target as HTMLImageElement
    img.src = fallbackAvatar.value
  }

  const handleMouseEnter = () => {
    isHovering.value = true

    // 如果有预览视频，延迟500ms后开始播放
    if (props.video.previewUrl && previewVideoRef.value) {
      previewTimeout.value = window.setTimeout(() => {
        previewVideoRef.value!.play()
          .then(() => {
            isPlaying.value = true
          })
          .catch((err) => {
            console.error('Failed to play preview:', err)
            isPlaying.value = false
          })
      }, 500)
    }
  }

  const handleMouseLeave = () => {
    isHovering.value = false
    isPlaying.value = false

    // 清除播放定时器
    if (previewTimeout.value) {
      clearTimeout(previewTimeout.value)
      previewTimeout.value = null
    }

    // 暂停并重置预览视频
    if (previewVideoRef.value) {
      previewVideoRef.value.pause()
      previewVideoRef.value.currentTime = 0
    }
  }

  const handleWatchLater = () => {
    emit('watch-later', props.video)
    message.success(`已添加到"稍后观看"`)
  }

  const handleAddToPlaylist = () => {
    showPlaylistModal.value = true
  }

  const handleCreatePlaylist = () => {
    // 实际项目中，这里会打开创建播放列表的表单
    message.info('创建播放列表功能开发中')
  }

  const saveToPlaylists = () => {
    const selectedIds = playlists.value
      .filter(p => p.selected)
      .map(p => p.id)

    if (selectedIds.length === 0) {
      message.warning('请选择至少一个播放列表')
      return
    }

    emit('add-to-playlist', props.video, selectedIds)
    message.success('已添加到所选播放列表')
    showPlaylistModal.value = false

    // 重置选择状态
    playlists.value.forEach(p => p.selected = false)
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
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-normal),
      box-shadow var(--transition-normal),
      background-color var(--transition-normal);
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

  .preview-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
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
    z-index: 2;
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.2);
    z-index: 2;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--primary-color);
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
    z-index: 3;
  }

  .video-card:hover .overlay {
    opacity: 1;
  }

  .play-icon {
    color: var(--text-inverse);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .hover-actions {
    position: absolute;
    top: var(--spacing-xs);
    right: var(--spacing-xs);
    display: flex;
    gap: var(--spacing-xs);
    z-index: 4;
  }

  .info {
    padding: var(--spacing-md);
    background-color: var(--card-bg);
    transition: background-color var(--transition-normal);
  }

  .title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-color);
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

  .author:hover .author-name {
    color: var(--primary-color);
    text-decoration: underline;
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

  .empty-playlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .playlist-actions {
    display: flex;
    justify-content: space-between;
    margin-top: var(--spacing-md);
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
      width: 100%;
      justify-content: space-between;
    }
  }

  /* 确保所有文本颜色适应主题 */
  [data-theme="dark"] .video-card {
    background-color: var(--card-bg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  [data-theme="dark"] .info {
    background-color: var(--card-bg);
  }

  [data-theme="dark"] .title {
    color: var(--text-color);
  }

  [data-theme="dark"] .author-name,
  [data-theme="dark"] .stats {
    color: var(--text-secondary);
  }

  [data-theme="dark"] .video-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  }
</style>