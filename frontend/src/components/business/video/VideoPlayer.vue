<!--
 * @description 视频播放器组件
 * @features
 * - 基本播放控制：播放/暂停、进度条、音量、全屏
 * - 清晰度切换：支持多种清晰度选择
 * - 弹幕系统：支持发送和显示弹幕
 * - 快捷键控制：空格播放/暂停、方向键调整进度等
 * - 自适应布局：支持不同尺寸和比例
 * - 主题适配：支持亮色和暗色主题
 * @dependencies
 * - vue-plyr: 视频播放器基础库
 * - @vueuse/core: 实用工具集
 -->

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
        <AlertCircleIcon />
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
        <video ref="videoRef" :src="video.url" :poster="video.coverUrl" :preload="'auto'" crossorigin playsinline>
          <source v-for="source in video.sources" :key="source.url" :src="source.url" :type="source.type"
            :size="source.size" :label="source.label" />
          <track v-for="subtitle in video.subtitles" :key="subtitle.url" :src="subtitle.url" :label="subtitle.label"
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
                  <ChatBubbleIcon />
                </n-icon>
              </template>
              弹幕
            </n-button>
            <n-button quaternary :type="isDanmakuInputVisible ? 'primary' : 'default'" @click="toggleDanmakuInput">
              <template #icon>
                <n-icon>
                  <SendIcon />
                </n-icon>
              </template>
              发送
            </n-button>
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
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import VuePlyr from 'vue-plyr'
  import 'vue-plyr/dist/vue-plyr.css'
  import { NButton, NButtonGroup, NIcon, NInput, NSpin } from 'naive-ui'
  import {
    AlertCircleIcon,
    ChatBubbleIcon,
    SendIcon
  } from '@vicons/ionicons5'
  import type { Video } from '@/types'

  const props = defineProps<{
    video: Video
    currentTime?: number
  }>()

  const emit = defineEmits<{
    (e: 'time-update', time: number): void
    (e: 'play'): void
    (e: 'pause'): void
    (e: 'ended'): void
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

  // 方法
  const handleReady = () => {
    loading.value = false
    if (props.currentTime) {
      videoRef.value!.currentTime = props.currentTime
    }
  }

  const handleError = (err: Error) => {
    error.value = '视频加载失败'
    console.error('Video error:', err)
  }

  const handleTimeUpdate = () => {
    if (videoRef.value) {
      emit('time-update', videoRef.value.currentTime)
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

  // 生命周期钩子
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
</script>

<style scoped>
  .video-player {
    position: relative;
    width: 100%;
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .loading-overlay,
  .error-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color);
    z-index: 1;
  }

  .loading-text,
  .error-text {
    margin: var(--spacing-md) 0 0;
    font-size: var(--text-base);
    color: var(--text-color-secondary);
  }

  .error-icon {
    color: var(--text-color-secondary);
  }

  .player-container {
    position: relative;
    width: 100%;
  }

  .danmaku-container {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .danmaku-controls {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    z-index: 3;
  }

  .danmaku-input {
    position: absolute;
    bottom: var(--spacing-md);
    left: var(--spacing-md);
    right: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
    z-index: 3;
  }

  .danmaku-area {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .danmaku-item {
    position: absolute;
    white-space: nowrap;
    font-size: var(--text-base);
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
      bottom: var(--spacing-sm);
      left: var(--spacing-sm);
      right: var(--spacing-sm);
    }

    .danmaku-item {
      font-size: var(--text-sm);
    }
  }
</style>