/**
* @file VideoPlayerComponent.vue
* @description 视频播放器组件 - 核心视频播放功能的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="video-player">
    <!-- 加载遮罩 -->
    <div v-if="loading && !error" class="loading-overlay">
      <n-spin size="large" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 错误遮罩 -->
    <div v-else-if="error" class="error-overlay">
      <n-icon size="48" class="error-icon">
        <AlertCircleOutline />
      </n-icon>
      <p class="error-text">{{ error }}</p>
      <n-button type="primary" ghost @click="retry" class="retry-button">
        重试
      </n-button>
    </div>

    <!-- 播放器 -->
    <div v-else class="player-container">
      <!-- 视频播放器 -->
      <vue-plyr ref="playerRef" :options="playerOptions" @ready="handleReady" @error="handleError"
        @timeupdate="handleTimeUpdate" @play="handlePlay" @pause="handlePause" @ended="handleEnded">
        <video ref="videoRef" :src="videoSrc" :poster="posterSrc" :preload="'auto'" crossorigin="anonymous" playsinline>
          <source v-for="source in videoSources" :key="source.url" :src="source.url" :type="source.type"
            :size="source.size" :label="source.label" />
          <track v-for="subtitle in videoSubtitles" :key="subtitle.url" :src="subtitle.url" :label="subtitle.label"
            :srclang="subtitle.srclang" :default="subtitle.default" kind="subtitles" />
        </video>
      </vue-plyr>

      <!-- 顶部控制栏 -->
      <div class="youtube-controls">
        <div class="top-gradient"></div>
        <div class="control-buttons">
          <n-button-group>
            <n-button quaternary @click="toggleDanmaku" class="youtube-btn">
              <template #icon>
                <n-icon>
                  <ChatbubbleOutline />
                </n-icon>
              </template>
              弹幕
            </n-button>
            <n-button quaternary @click="toggleDanmakuInput" class="youtube-btn">
              <template #icon>
                <n-icon>
                  <PaperPlaneOutline />
                </n-icon>
              </template>
              发送弹幕
            </n-button>
          </n-button-group>
        </div>
      </div>

      <!-- 弹幕输入框 -->
      <transition name="fade">
        <div v-if="isDanmakuInputVisible" class="danmaku-input">
          <n-input v-model:value="danmakuText" placeholder="发送弹幕..." @keydown.enter="sendDanmaku">
            <template #suffix>
              <n-button type="primary" :disabled="!danmakuText.trim()" @click="sendDanmaku">
                发送
              </n-button>
            </template>
          </n-input>
        </div>
      </transition>

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

      <!-- 网络状态提示 -->
      <div v-if="networkStatus === 'slow'" class="network-status slow">
        <n-icon>
          <WifiOutline />
        </n-icon>
        <span>网络状况不佳，视频加载缓慢</span>
      </div>
      <div v-if="networkStatus === 'offline'" class="network-status offline">
        <n-icon>
          <CloudOfflineOutline />
        </n-icon>
        <span>您当前处于离线状态</span>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="bottom-controls" v-if="!loading && !error">
      <div class="quality-control">
        <n-select v-model:value="currentQuality" :options="availableQualities" @update:value="handleQualityChange"
          size="small" style="width: 80px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import VuePlyr from 'vue-plyr'
  import 'vue-plyr/dist/vue-plyr.css'
  import { NButton, NButtonGroup, NIcon, NInput, NSpin, NSelect } from 'naive-ui'
  import {
    AlertCircleOutline,
    ChatbubbleOutline,
    PaperPlaneOutline,
    WifiOutline,
    CloudOfflineOutline
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
  const networkStatus = ref<'online' | 'offline' | 'slow'>('online')
  const currentRetryCount = ref(0)

  // 测试视频数据（提供不同质量的测试视频）
  const testVideos = [
    {
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4',
      size: 1080,
      label: '1080p'
    },
    {
      url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      type: 'video/mp4',
      size: 720,
      label: '720p'
    },
    {
      url: 'https://media.w3.org/2010/05/bunny/movie.mp4',
      type: 'video/mp4',
      size: 480,
      label: '480p'
    }
  ]

  // 检查是否使用测试视频
  const useTestVideo = computed(() =>
    !props.video.videoUrl || !props.video.sources || props.video.sources.length === 0
  )

  // 新增：画质选择
  const currentQuality = ref(useTestVideo.value ? '720p' : props.video.sources?.[0]?.label || '720p')
  const availableQualities = computed(() => {
    if (useTestVideo.value) {
      return testVideos.map(source => ({
        label: source.label,
        value: source.label
      }))
    }

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
    quality: { default: 720, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] },
    i18n: {
      restart: '重新播放',
      play: '播放',
      pause: '暂停',
      fastForward: '快进',
      rewind: '快退',
      seek: '跳转',
      played: '已播放',
      buffered: '已缓冲',
      currentTime: '当前时间',
      duration: '总时长',
      volume: '音量',
      mute: '静音',
      unmute: '取消静音',
      enterFullscreen: '全屏',
      exitFullscreen: '退出全屏',
      frameTitle: '视频播放器',
      captions: '字幕',
      settings: '设置',
      speed: '播放速度',
      normal: '正常',
      quality: '画质',
      loop: '循环',
      start: '开始',
      end: '结束',
      all: '全部',
      reset: '重置',
      disabled: '禁用',
      enabled: '启用',
      advertisement: '广告'
    }
  }

  // 计算属性
  const visibleDanmaku = computed(() => {
    if (!videoRef.value) return []
    const currentTime = videoRef.value.currentTime
    return danmakuList.value.filter(
      danmaku => Math.abs(danmaku.time - currentTime) < 3
    )
  })

  // 计算视频源
  const videoSrc = computed(() => {
    // 首先检查video对象
    if (props.video) {
      // 如果video有videoUrl属性，优先使用
      if (props.video.videoUrl) {
        return props.video.videoUrl;
      }

      // 其次查找video.sources数组
      if (props.video.sources && props.video.sources.length > 0) {
        // 根据当前选择的清晰度过滤
        const source = props.video.sources.find(s => s.label === currentQuality.value);
        if (source && source.url) {
          return source.url;
        }
        // 如果没找到匹配的清晰度，使用第一个
        return props.video.sources[0].url;
      }
    }

    // 所有情况都没有，使用测试视频
    if (useTestVideo.value) {
      const testVideo = testVideos.find(v => v.label === currentQuality.value);
      return testVideo ? testVideo.url : testVideos[0].url;
    }

    // 都没有则返回空字符串，会触发错误处理
    return '';
  });

  // 海报图
  const posterSrc = computed(() => {
    if (props.video) {
      // 优先使用coverUrl
      if (props.video.coverUrl) {
        return props.video.coverUrl;
      }
      // 其次使用previewUrl
      if (props.video.previewUrl) {
        return props.video.previewUrl;
      }
    }
    // 默认海报图
    return '';
  });

  // 视频源列表
  const videoSources = computed(() => {
    if (props.video && props.video.sources && props.video.sources.length > 0) {
      return props.video.sources;
    }
    return useTestVideo.value ? testVideos : [];
  });

  // 字幕列表
  const videoSubtitles = computed(() => {
    if (props.video && props.video.subtitles && props.video.subtitles.length > 0) {
      return props.video.subtitles;
    }
    return [];
  });

  // 方法
  const handleReady = () => {
    // 给一些视频加载的时间，避免假loading
    setTimeout(() => {
      if (!error.value) {
        loading.value = false;
        console.log('[VideoPlayer] 播放器已就绪');

        // 恢复保存的播放进度
        if (props.currentTime && props.currentTime > 0 && videoRef.value) {
          videoRef.value.currentTime = props.currentTime;
          console.log('[VideoPlayer] 恢复播放进度:', props.currentTime);
        }
      }
    }, 1000);

    // 监听视频加载中的网络状态
    checkNetworkStatus();
  };

  // 检查网络状态
  const checkNetworkStatus = () => {
    // 检查浏览器网络状态
    if (!navigator.onLine) {
      networkStatus.value = 'offline';
      return;
    }

    // 监测视频加载情况
    if (videoRef.value) {
      let lastBuffered = 0;
      let stallCount = 0;

      const bufferingCheck = setInterval(() => {
        if (!videoRef.value || videoRef.value.paused) {
          return;
        }

        const buffered = videoRef.value.buffered;
        if (buffered.length > 0) {
          const currentBuffered = buffered.end(buffered.length - 1);

          // 如果2秒内缓冲没有明显增加
          if (currentBuffered - lastBuffered < 0.1) {
            stallCount++;
            if (stallCount > 2) {
              networkStatus.value = 'slow';
            }
          } else {
            stallCount = 0;
            if (networkStatus.value === 'slow') {
              networkStatus.value = 'online';
            }
          }

          lastBuffered = currentBuffered;
        }
      }, 2000);

      // 组件卸载时清除定时器
      onUnmounted(() => {
        clearInterval(bufferingCheck);
      });
    }
  };

  // 播放器错误处理
  const handleError = (event: Event) => {
    const videoEl = videoRef.value;
    // 不知道为什么vue-plyr会触发两次error事件，所以我们只处理第一次
    if (!error.value) {
      let errorCode = '';
      let errorMessage = '视频加载失败';

      if (videoEl instanceof HTMLVideoElement) {
        errorCode = videoEl.error ? String(videoEl.error.code) : '';

        switch (errorCode) {
          case '1':
            errorMessage = '视频加载被中止';
            break;
          case '2':
            errorMessage = '网络错误，无法加载视频';
            break;
          case '3':
            errorMessage = '视频解码失败';
            break;
          case '4':
            errorMessage = '视频格式不支持';
            break;
          default:
            errorMessage = '播放器发生错误，无法加载视频';
        }
      }

      // 设置错误状态
      loading.value = false;
      error.value = errorMessage;

      // 如果是测试视频出错，尝试降低画质
      if (useTestVideo.value && currentQuality.value !== '480p') {
        error.value += '，尝试降低画质可能会有帮助';
      }

      // 提供错误详情日志
      console.warn('[VideoPlayer] 播放错误:', errorMessage);
      console.warn('[VideoPlayer] 视频URL:', videoSrc.value);
      console.warn('[VideoPlayer] 错误代码:', errorCode);
    }
  };

  // 重试播放
  const retry = () => {
    error.value = null;
    loading.value = true;
    console.log('[VideoPlayer] 重试加载视频:', videoSrc.value);

    // 如果是测试视频且画质高，则降低画质再试
    if (useTestVideo.value && currentRetryCount.value > 0) {
      if (currentQuality.value === '1080p') {
        console.log('[VideoPlayer] 降低画质到720p');
        currentQuality.value = '720p';
      } else if (currentQuality.value === '720p') {
        console.log('[VideoPlayer] 降低画质到480p');
        currentQuality.value = '480p';
      }
    }

    currentRetryCount.value++;

    // 清除视频元素的src并重新加载
    if (videoRef.value) {
      videoRef.value.src = '';
      setTimeout(() => {
        if (videoRef.value) {
          videoRef.value.src = videoSrc.value;
          videoRef.value.load();
          videoRef.value.play().catch(err => {
            console.error('[VideoPlayer] 重试播放失败:', err);
            // 如果是自动播放策略阻止，给用户提示
            if (err.name === 'NotAllowedError') {
              error.value = '浏览器阻止了自动播放，请点击播放按钮开始播放';
            } else {
              error.value = '视频加载失败，请检查网络连接后再试';
            }
            loading.value = false;
          });
        }
      }, 1000);
    }
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

  const toggleDanmaku = () => {
    isDanmakuEnabled.value = !isDanmakuEnabled.value
  }

  const toggleDanmakuInput = () => {
    isDanmakuInputVisible.value = !isDanmakuInputVisible.value
  }

  const sendDanmaku = () => {
    if (!danmakuText.value.trim() || !videoRef.value) return

    // 计算当前弹幕区已有弹幕的位置，避免重叠
    const usedPositions = danmakuList.value
      .filter(d => Math.abs(d.time - videoRef.value!.currentTime) < 4)
      .map(d => d.top)

    // 尝试找一个未被占用的位置
    let position = Math.random() * 80 + 10
    for (let i = 0; i < 10; i++) {
      // 检查该位置是否已被占用(±5%范围内)
      const isPositionUsed = usedPositions.some(p => Math.abs(p - position) < 5)
      if (!isPositionUsed) break
      position = Math.random() * 80 + 10
    }

    const danmaku = {
      id: Date.now(),
      content: danmakuText.value,
      time: videoRef.value.currentTime,
      top: position,
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
    if (videoRef.value) {
      let sourceUrl = ''

      if (useTestVideo.value) {
        // 使用测试视频源
        const source = testVideos.find(s => s.label === value)
        if (source) sourceUrl = source.url
      } else if (props.video.sources) {
        // 使用实际视频源
        const source = props.video.sources.find(s => s.label === value)
        if (source) sourceUrl = source.url
      }

      if (sourceUrl) {
        videoRef.value.src = sourceUrl
        videoRef.value.load()

        // 重新加载后恢复播放进度和状态
        videoRef.value.addEventListener('loadedmetadata', () => {
          if (videoRef.value) {
            videoRef.value.currentTime = currentTime
            if (!videoRef.value.paused) {
              videoRef.value.play()
            }
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
    // 检测浏览器对视频格式的支持
    const checkVideoSupport = () => {
      const video = document.createElement('video')
      const canPlayH264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"')
      const canPlayHEVC = video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"')
      const canPlayVP9 = video.canPlayType('video/webm; codecs="vp9"')

      console.log('Video format support:', {
        h264: canPlayH264,
        hevc: canPlayHEVC,
        vp9: canPlayVP9
      })
    }

    // 检测网络状态
    const updateNetworkStatus = () => {
      if (navigator.onLine) {
        networkStatus.value = 'online'
      } else {
        networkStatus.value = 'offline'
      }
    }

    checkVideoSupport()
    updateNetworkStatus()

    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // 将视频添加到播放历史
    if (props.video && props.video.id) {
      try {
        // 检查是否处于离线模式
        const isOfflineMode = localStorage.getItem('offline_mode') === 'true'

        if (isOfflineMode) {
          // 在离线模式下，仅保存到本地历史记录
          const watchHistory = JSON.parse(localStorage.getItem('watch_history') || '[]')
          const existingIndex = watchHistory.findIndex((v: any) => v.id === props.video.id)

          if (existingIndex >= 0) {
            watchHistory.splice(existingIndex, 1)
          }

          watchHistory.unshift(props.video)
          localStorage.setItem('watch_history', JSON.stringify(watchHistory.slice(0, 30)))
        } else {
          // 正常模式下使用historyStore
          historyStore.addToHistory(props.video)
        }
      } catch (err) {
        console.error('添加到历史记录失败:', err)
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('online', () => { })
    window.removeEventListener('offline', () => { })
  })
</script>

<style scoped>
  .video-player {
    position: relative;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .loading-overlay,
  .error-overlay {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
    background-color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
  }

  .loading-overlay .n-spin,
  .error-overlay .error-icon,
  .loading-overlay .loading-text,
  .error-overlay .error-text,
  .error-overlay .retry-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loading-text,
  .error-text {
    margin-top: 60px;
    font-size: 16px;
  }

  .error-text {
    max-width: 80%;
    line-height: 1.5;
  }

  .retry-button {
    margin-top: 120px;
  }

  .player-container {
    position: relative;
    width: 100%;
    background-color: #000;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    /* 保持16:9比例 */
  }

  /* 确保plyr播放器内容始终保持比例并居中 */
  :deep(.plyr) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :deep(.plyr video) {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* 保持视频正确比例 */
  }

  /* 控制条样式 */
  :deep(.plyr__control) {
    background: rgba(0, 0, 0, 0.6);
    color: white;
  }

  :deep(.plyr--video .plyr__controls) {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
  }

  /* 确保自定义控制在播放器尺寸变化时保持正确位置 */
  .youtube-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
    padding: 16px;
  }

  .top-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
    pointer-events: none;
  }

  .control-buttons {
    position: relative;
    z-index: 6;
    display: flex;
    justify-content: flex-end;
  }

  .danmaku-input {
    position: absolute;
    bottom: 70px;
    left: 0;
    width: 100%;
    padding: 0 16px;
    z-index: 10;
  }

  .danmaku-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80%;
    z-index: 4;
    pointer-events: none;
    overflow: hidden;
  }

  .danmaku-item {
    position: absolute;
    white-space: nowrap;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    font-size: 20px;
    font-weight: bold;
    will-change: transform;
    animation: danmaku-move 15s linear;
  }

  @keyframes danmaku-move {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(-100%);
    }
  }

  .network-status {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 8px 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    z-index: 5;
  }

  .network-status.slow {
    background-color: rgba(250, 173, 20, 0.8);
  }

  .network-status.offline {
    background-color: rgba(245, 34, 45, 0.8);
  }

  .bottom-controls {
    position: relative;
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    z-index: 2;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .danmaku-item {
      font-size: 16px;
    }

    .youtube-btn {
      font-size: 12px;
      padding: 4px 8px;
    }
  }
</style>