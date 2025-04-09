/**
* @file VideoPlayerComponent.vue
* @description 视频播放器组件 - 核心视频播放功能的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="video-player">
    <!-- 加载遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <n-spin size="large" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 错误遮罩 -->
    <div v-else-if="error" class="error-overlay">
      <n-icon size="48" class="error-icon">
        <AlertCircleOutline />
      </n-icon>
      <p class="error-text">{{ error }}</p>
      <n-button @click="retry">
        重试
      </n-button>
    </div>

    <!-- 播放器 -->
    <div v-else class="player-container">
      <vue-plyr ref="playerRef" :options="playerOptions" @ready="handleReady" @error="handleError"
        @timeupdate="handleTimeUpdate" @play="handlePlay" @pause="handlePause" @ended="handleEnded">
        <video ref="videoRef" :src="videoSrc" :poster="posterSrc" :preload="'auto'" crossorigin playsinline>
          <source v-for="source in videoSources" :key="source.url" :src="source.url" :type="source.type"
            :size="source.size" :label="source.label" />
          <track v-for="subtitle in videoSubtitles" :key="subtitle.url" :src="subtitle.url" :label="subtitle.label"
            :srclang="subtitle.srclang" :default="subtitle.default" kind="subtitles" />
        </video>
      </vue-plyr>

      <!-- 弹幕系统 -->
      <div class="danmaku-container">
        <div class="danmaku-controls">
          <n-button-group>
            <n-button quaternary :type="isDanmakuEnabled ? 'primary' : 'default'" @click="toggleDanmaku">
              <template #icon>
                <n-icon>
                  <ChatbubbleOutline />
                </n-icon>
              </template>
              弹幕
            </n-button>
            <n-button quaternary :type="isDanmakuInputVisible ? 'primary' : 'default'" @click="toggleDanmakuInput">
              <template #icon>
                <n-icon>
                  <PaperPlaneOutline />
                </n-icon>
              </template>
              发送
            </n-button>

            <!-- 新增：画质选择 -->
            <n-tooltip>
              <template #trigger>
                <n-button quaternary>
                  <template #icon>
                    <n-icon>
                      <SettingsOutline />
                    </n-icon>
                  </template>
                  画质
                </n-button>
              </template>
              <div class="quality-selector">
                <n-select v-model:value="currentQuality" :options="availableQualities"
                  @update:value="handleQualityChange" size="small" :style="{ width: '80px' }" />
              </div>
            </n-tooltip>
          </n-button-group>
        </div>

        <!-- 弹幕输入框 -->
        <div v-if="isDanmakuInputVisible" class="danmaku-input">
          <n-input v-model:value="danmakuText" placeholder="发送弹幕..." @keydown.enter="sendDanmaku" />
          <n-button type="primary" :disabled="!danmakuText.trim()" @click="sendDanmaku">
            发送
          </n-button>
        </div>

        <!-- 弹幕显示区域 -->
        <div v-if="isDanmakuEnabled" class="danmaku-area" ref="danmakuAreaRef">
          <div v-for="danmaku in visibleDanmaku" :key="danmaku.id" class="danmaku-item" :style="{
            top: `${danmaku.top}%`,
            transform: `translateX(${danmaku.offset}px)`,
            color: danmaku.color
          }">
            {{ danmaku.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import VuePlyr from 'vue-plyr'
  import 'vue-plyr/dist/vue-plyr.css'
  import { NButton, NButtonGroup, NIcon, NInput, NSpin, NSelect, NTooltip } from 'naive-ui'
  import {
    AlertCircleOutline,
    ChatbubbleOutline,
    PaperPlaneOutline,
    SettingsOutline
  } from '@vicons/ionicons5'
  import type { Video } from '@/types'
  import { useHistoryStore } from '@/stores/history'
  import { debounce } from '@/utils/helpers'

  const props = defineProps<{
    video: Video
    currentTime?: number
  }>()

  const emit = defineEmits<{
    (e: 'time-update', time: number): void
    (e: 'play'): void
    (e: 'pause'): void
    (e: 'ended'): void
    (e: 'quality-change', quality: string): void
  }>()

  // 状态
  const playerRef = ref()
  const videoRef = ref<HTMLVideoElement>()
  const loading = ref(true)
  const error = ref<string | null>(null)
  const isDanmakuEnabled = ref(true)
  const isDanmakuInputVisible = ref(false)
  const danmakuText = ref('')
  const danmakuAreaRef = ref<HTMLElement>()
  const danmakuList = ref<Array<{
    id: number
    content: string
    time: number
    top: number
    offset: number
    color: string
  }>>([])

  // 新增：画质选择
  const currentQuality = ref(props.video.sources?.[0]?.label || '720p')
  const availableQualities = computed(() => {
    if (!props.video.sources) return []
    return props.video.sources.map(source => ({
      label: source.label,
      value: source.label
    }))
  })

  // 新增：使用历史记录
  const historyStore = useHistoryStore()

  // 播放器配置
  const playerOptions = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'captions',
      'settings',
      'pip',
      'airplay',
      'fullscreen'
    ],
    settings: ['captions', 'quality', 'speed'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    quality: { default: 720, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] }
  }

  // 计算属性
  const visibleDanmaku = computed(() => {
    if (!videoRef.value) return []
    const currentTime = videoRef.value.currentTime
    return danmakuList.value.filter(
      danmaku => Math.abs(danmaku.time - currentTime) < 3
    )
  })

  // 视频源URL，兼容不同的视频对象属性
  const videoSrc = computed(() => {
    return props.video.videoUrl || props.video.url || '';
  })

  // 封面图URL，兼容不同的视频对象属性
  const posterSrc = computed(() => {
    return props.video.coverUrl || props.video.thumbnail || '';
  })

  // 视频源列表，兼容不同的视频对象属性
  const videoSources = computed(() => {
    if (props.video.sources && props.video.sources.length > 0) {
      return props.video.sources;
    }

    // 如果没有sources，但有videoUrl，创建一个默认source
    if (props.video.videoUrl || props.video.url) {
      return [{
        url: props.video.videoUrl || props.video.url || '',
        type: 'video/mp4',
        label: '720p',
        size: 720
      }];
    }

    return [];
  })

  // 字幕列表，兼容不同的视频对象属性
  const videoSubtitles = computed(() => {
    return props.video.subtitles || [];
  })

  // 方法
  const handleReady = () => {
    loading.value = false

    try {
      // 从历史记录或props中恢复播放进度
      const savedProgress = historyStore.getVideoProgress(props.video.id)
      if (savedProgress && videoRef.value) {
        videoRef.value.currentTime = savedProgress
      } else if (props.currentTime && videoRef.value) {
        videoRef.value.currentTime = props.currentTime
      }
    } catch (err) {
      console.error('获取播放进度失败:', err)
    }
  }

  const handleError = (err: Error) => {
    error.value = '视频加载失败'
    console.error('Video error:', err)
  }

  // 防抖更新播放历史
  const updateHistory = debounce((currentTime: number) => {
    if (props.video && props.video.id) {
      try {
        historyStore.saveVideoProgress(props.video.id, currentTime)
      } catch (err) {
        console.error('保存播放进度失败:', err)
      }
    }
  }, 1000)

  const handleTimeUpdate = () => {
    if (videoRef.value) {
      const currentTime = videoRef.value.currentTime
      emit('time-update', currentTime)

      // 保存播放进度到历史
      if (currentTime > 0 && props.video.duration && currentTime < props.video.duration - 10) {
        updateHistory(currentTime)
      }
    }
  }

  const handlePlay = () => {
    emit('play')
  }

  const handlePause = () => {
    emit('pause')
  }

  const handleEnded = () => {
    emit('ended')
    // 播放结束，清除进度
    if (props.video && props.video.id) {
      historyStore.saveVideoProgress(props.video.id, 0)
    }
  }

  const retry = () => {
    loading.value = true
    error.value = null
    videoRef.value?.load()
  }

  const toggleDanmaku = () => {
    isDanmakuEnabled.value = !isDanmakuEnabled.value
  }

  const toggleDanmakuInput = () => {
    isDanmakuInputVisible.value = !isDanmakuInputVisible.value
  }

  const sendDanmaku = () => {
    if (!danmakuText.value.trim() || !videoRef.value) return

    const danmaku = {
      id: Date.now(),
      content: danmakuText.value,
      time: videoRef.value.currentTime,
      top: Math.random() * 80 + 10, // 10% 到 90% 之间
      offset: danmakuAreaRef.value?.offsetWidth || 0,
      color: `hsl(${Math.random() * 360}, 100%, 75%)`
    }

    danmakuList.value.push(danmaku)
    danmakuText.value = ''
    isDanmakuInputVisible.value = false
  }

  // 新增：画质切换
  const handleQualityChange = (value: string) => {
    currentQuality.value = value
    emit('quality-change', value)

    // 保存当前播放进度
    const currentTime = videoRef.value?.currentTime || 0

    // 切换对应清晰度的视频源
    if (videoRef.value && props.video.sources) {
      const source = props.video.sources.find(s => s.label === value)
      if (source) {
        videoRef.value.src = source.url
        videoRef.value.load()

        // 重新加载后恢复播放进度和状态
        videoRef.value.addEventListener('loadedmetadata', () => {
          videoRef.value!.currentTime = currentTime
          if (!videoRef.value!.paused) {
            videoRef.value!.play()
          }
        }, { once: true })
      }
    }
  }

  // 键盘快捷键
  const handleKeydown = (event: KeyboardEvent) => {
    if (!videoRef.value) return

    switch (event.key) {
      case ' ':
        event.preventDefault()
        if (videoRef.value.paused) {
          videoRef.value.play()
        } else {
          videoRef.value.pause()
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        videoRef.value.currentTime -= 5
        break
      case 'ArrowRight':
        event.preventDefault()
        videoRef.value.currentTime += 5
        break
      case 'ArrowUp':
        event.preventDefault()
        videoRef.value.volume = Math.min(1, videoRef.value.volume + 0.1)
        break
      case 'ArrowDown':
        event.preventDefault()
        videoRef.value.volume = Math.max(0, videoRef.value.volume - 0.1)
        break
    }
  }

  // 监听视频ID变化，加载新视频
  watch(() => props.video.id, () => {
    if (videoRef.value) {
      loading.value = true
      error.value = null
      videoRef.value.load()
    }
  })

  // 生命周期钩子
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)

    // 将视频添加到播放历史
    if (props.video && props.video.id) {
      try {
        historyStore.addToHistory(props.video)
      } catch (err) {
        console.error('添加到历史记录失败:', err)
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
</script>

<style scoped>
  .video-player {
    position: relative;
    width: 100%;
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-bg);
    color: var(--text-primary);
    z-index: 10;
  }

  .loading-text,
  .error-text {
    margin-top: var(--spacing-md);
    font-size: var(--text-base);
    color: var(--text-secondary);
  }

  .error-icon {
    color: var(--error-color);
    margin-bottom: var(--spacing-md);
  }

  .player-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .danmaku-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 5;
  }

  .danmaku-controls {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: var(--radius-md);
    padding: var(--spacing-xs);
  }

  .danmaku-input {
    position: absolute;
    bottom: var(--spacing-lg);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--spacing-sm);
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
  }

  .danmaku-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .danmaku-item {
    position: absolute;
    white-space: nowrap;
    font-size: var(--text-lg);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    animation: danmaku-move 8s linear;
  }

  @keyframes danmaku-move {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(-100%);
    }
  }

  /* 自定义播放器样式 */
  :deep(.plyr) {
    --plyr-color-main: var(--primary-color);
    --plyr-video-background: var(--background-color);
    --plyr-video-control-color: var(--text-color);
    --plyr-video-control-background-hover: var(--background-color-hover);
    --plyr-video-control-icon-size: 18px;
    --plyr-range-fill-background: var(--primary-color);
    --plyr-range-thumb-background: var(--primary-color);
    --plyr-range-thumb-active-shadow-width: 0;
    --plyr-range-thumb-active-shadow-color: transparent;
    --plyr-menu-background: var(--background-color);
    --plyr-menu-color: var(--text-color);
    --plyr-menu-border-color: var(--border-color);
    --plyr-menu-border-radius: var(--border-radius);
    --plyr-tooltip-background: var(--background-color);
    --plyr-tooltip-color: var(--text-color);
    --plyr-tooltip-padding: var(--spacing-xs) var(--spacing-sm);
    --plyr-tooltip-arrow-size: 16px;
    --plyr-tooltip-radius: var(--border-radius);
  }

  :deep(.plyr--video) {
    border-radius: var(--border-radius);
  }

  :deep(.plyr__control) {
    border-radius: var(--border-radius);
  }

  :deep(.plyr__control--overlaid) {
    background-color: rgba(0, 0, 0, 0.5);
  }

  :deep(.plyr__control--overlaid:hover) {
    background-color: rgba(0, 0, 0, 0.7);
  }

  :deep(.plyr__progress__container) {
    border-radius: var(--border-radius);
  }

  :deep(.plyr__volume) {
    border-radius: var(--border-radius);
  }

  :deep(.plyr__menu) {
    border: 1px solid var(--border-color);
  }

  :deep(.plyr__menu__container) {
    border-radius: var(--border-radius);
  }

  :deep(.plyr__menu__container > div) {
    border-radius: var(--border-radius);
  }

  :deep(.plyr__menu__container > div:hover) {
    background-color: var(--background-color-hover);
  }

  :deep(.plyr__tooltip) {
    border: 1px solid var(--border-color);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .danmaku-controls {
      top: var(--spacing-sm);
      right: var(--spacing-sm);
    }

    .danmaku-input {
      bottom: var(--spacing-md);
      width: 90%;
    }

    .danmaku-item {
      font-size: var(--text-base);
    }
  }

  .quality-selector {
    width: 90px;
    padding: var(--spacing-xs);
  }
</style>