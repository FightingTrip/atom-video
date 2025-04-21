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
    <div v-else class="player-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
      @touchend="handleTouchEnd" @dblclick="togglePlayPause">
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
            <n-button quaternary @click="togglePictureInPicture" class="youtube-btn">
              <template #icon>
                <n-icon>
                  <ScanOutline />
                </n-icon>
              </template>
              画中画
            </n-button>
            <n-button quaternary @click="captureScreenshot" class="youtube-btn">
              <template #icon>
                <n-icon>
                  <CameraOutline />
                </n-icon>
              </template>
              截图
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

      <!-- 触摸反馈 -->
      <div v-if="touchFeedbackVisible" class="touch-feedback visible">
        {{ touchFeedbackText }}
      </div>

      <!-- 截图模式 -->
      <div v-if="isScreenshotMode" class="screenshot-mode">
        <img :src="screenshotUrl" alt="Screenshot" class="screenshot-image">
        <div class="screenshot-actions">
          <n-button type="primary" @click="isScreenshotMode = false">
            关闭
          </n-button>
          <n-button type="primary" @click="captureScreenshot">
            重新截图
          </n-button>
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="bottom-controls" v-if="!loading && !error">
      <div class="quality-control">
        <n-dropdown :options="qualityOptions" :value="currentQuality" @select="handleQualitySelect" trigger="click">
          <n-button quaternary size="small">
            {{ currentQuality === 'auto' ? '自动' : currentQuality }}
            <template #suffix>
              <n-icon>
                <ChevronDownOutline />
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </div>

      <!-- 触摸反馈 -->
      <div class="touch-feedback" :class="{ visible: touchFeedbackVisible }">
        {{ touchFeedbackText }}
      </div>

      <!-- 添加预缓冲指示器 -->
      <div class="prebuffer-indicator" v-if="isPreBuffering">
        <n-icon size="16">
          <BufferingOutline />
        </n-icon>
        <span>正在预加载下个视频...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch, provide } from 'vue'
  import VuePlyr from 'vue-plyr'
  import 'vue-plyr/dist/vue-plyr.css'
  import { NButton, NButtonGroup, NIcon, NInput, NSpin, NSelect, NMessage, NDropdown } from 'naive-ui'
  import {
    AlertCircleOutline,
    ChatbubbleOutline,
    PaperPlaneOutline,
    WifiOutline,
    CloudOfflineOutline,
    ScanOutline,
    CameraOutline,
    ChevronDownOutline,
    BufferingOutline
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

  // 新增: 触摸状态
  const touchStartX = ref<number | null>(null)
  const touchStartY = ref<number | null>(null)
  const touchStartTime = ref<number | null>(null)
  const lastTapTime = ref<number>(0)
  const gestureType = ref<'none' | 'seek' | 'volume'>('none')
  const seekDirection = ref<'forward' | 'backward' | null>(null)
  const touchProgress = ref<number | null>(null)
  const isTouching = ref(false)
  const touchFeedbackVisible = ref(false)
  const touchFeedbackText = ref('')
  const touchFeedbackTimeout = ref<number | null>(null)

  // 新增: 截图状态
  const screenshotCanvas = ref<HTMLCanvasElement | null>(null)
  const isScreenshotMode = ref(false)
  const screenshotUrl = ref('')

  // 新增: 自动质量调节相关状态
  const autoQualityEnabled = ref(true)
  const detectedBandwidth = ref(0)
  const idealQuality = ref('720p')
  const isPreBuffering = ref(false)
  const preBufferProgress = ref(0)
  const videoPreBuffer = ref<HTMLVideoElement | null>(null)
  const bandwidthSamples = ref<number[]>([])

  // 提供当前播放时间给其他组件
  provide('currentPlayerTime', computed(() => videoRef.value?.currentTime || 0))

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
        if (currentQuality.value === 'auto') {
          // 使用根据网络状况自动选择的质量
          const source = props.video.sources.find(s => s.label === idealQuality.value);
          if (source && source.url) {
            return source.url;
          }
        } else {
          // 根据用户选择的清晰度
          const source = props.video.sources.find(s => s.label === currentQuality.value);
          if (source && source.url) {
            return source.url;
          }
        }
        // 如果没找到匹配的清晰度，使用第一个
        return props.video.sources[0].url;
      }
    }

    // 所有情况都没有，使用测试视频
    if (useTestVideo.value) {
      if (currentQuality.value === 'auto') {
        const testVideo = testVideos.find(v => v.label === idealQuality.value);
        return testVideo ? testVideo.url : testVideos[0].url;
      } else {
        const testVideo = testVideos.find(v => v.label === currentQuality.value);
        return testVideo ? testVideo.url : testVideos[0].url;
      }
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
  const handleQualitySelect = (value: string) => {
    currentQuality.value = value;
    if (value === 'auto') {
      // 重置理想质量
      estimateIdealQuality();
    } else {
      // 保存用户质量选择
      saveUserQualityPreference(value);
    }

    // 保存当前播放进度
    const currentTime = videoRef.value?.currentTime || 0;

    // 切换对应清晰度的视频源
    if (videoRef.value) {
      videoRef.value.src = videoSrc.value;
      videoRef.value.load();

      // 重新加载后恢复播放进度和状态
      videoRef.value.addEventListener('loadedmetadata', () => {
        if (videoRef.value) {
          videoRef.value.currentTime = currentTime;
          if (!videoRef.value.paused) {
            videoRef.value.play().catch(err => {
              console.error('恢复播放失败:', err);
            });
          }
        }
      }, { once: true });
    }
  };

  // 估算理想质量
  const estimateIdealQuality = () => {
    if (bandwidthSamples.value.length === 0) {
      // 如果没有带宽样本，默认使用720p
      idealQuality.value = '720p';
      return;
    }

    // 计算平均带宽 (Mbps)
    const avgBandwidth = bandwidthSamples.value.reduce((a, b) => a + b, 0) / bandwidthSamples.value.length;
    detectedBandwidth.value = avgBandwidth;

    // 根据带宽选择最佳质量
    if (avgBandwidth < 1.5) {
      idealQuality.value = '480p';
    } else if (avgBandwidth < 5) {
      idealQuality.value = '720p';
    } else {
      idealQuality.value = '1080p';
    }

    console.log(`[VideoPlayer] 估算理想质量: ${idealQuality.value} (带宽: ${avgBandwidth.toFixed(2)} Mbps)`);
  };

  // 保存用户质量偏好
  const saveUserQualityPreference = (quality: string) => {
    if (quality === 'auto') {
      localStorage.removeItem('preferred_video_quality');
    } else {
      localStorage.setItem('preferred_video_quality', quality);
    }
  };

  // 加载用户质量偏好
  const loadUserQualityPreference = () => {
    const savedQuality = localStorage.getItem('preferred_video_quality');
    if (savedQuality) {
      // 验证保存的质量选项是否有效
      const isValidQuality = qualityOptions.value.some(option => option.value === savedQuality);
      if (isValidQuality) {
        currentQuality.value = savedQuality;
        return;
      }
    }

    // 默认使用自动模式
    currentQuality.value = 'auto';
  };

  // 测量网络带宽
  const measureBandwidth = () => {
    if (!videoRef.value || videoRef.value.readyState < 3) return;

    try {
      const videoElem = videoRef.value;
      const loadStart = performance.now();

      // 获取当前缓冲范围
      const buffered = videoElem.buffered;
      if (buffered.length === 0) return;

      const initialBufferedEnd = buffered.end(buffered.length - 1);

      // 设置超时，等待缓冲增加
      setTimeout(() => {
        if (!videoElem) return;

        const buffered = videoElem.buffered;
        if (buffered.length === 0) return;

        const newBufferedEnd = buffered.end(buffered.length - 1);
        const loadedBytes = (newBufferedEnd - initialBufferedEnd) * videoElem.videoWidth * videoElem.videoHeight * 3; // 估算加载的字节数

        if (loadedBytes <= 0) return;

        const loadTime = (performance.now() - loadStart) / 1000; // 转换为秒
        const bandwidth = (loadedBytes * 8) / loadTime / 1000000; // Mbps

        // 添加到带宽样本
        bandwidthSamples.value.push(bandwidth);

        // 保留最近10个样本
        if (bandwidthSamples.value.length > 10) {
          bandwidthSamples.value.shift();
        }

        // 重新估算理想质量
        if (currentQuality.value === 'auto') {
          estimateIdealQuality();
        }

        console.log(`[VideoPlayer] 网络带宽: ${bandwidth.toFixed(2)} Mbps`);
      }, 5000);

    } catch (err) {
      console.error('[VideoPlayer] 测量带宽失败:', err);
    }
  };

  // 预缓冲下一个视频
  const preBufferNextVideo = (nextVideoId: string) => {
    if (!navigator.onLine || isPreBuffering.value) return;

    try {
      isPreBuffering.value = true;
      preBufferProgress.value = 0;

      // 获取下一个视频的信息
      import('@/services/video').then(async ({ videoService }) => {
        try {
          const response = await videoService.getVideoById(nextVideoId);

          if (response.success && response.data) {
            const nextVideo = response.data;

            // 创建一个隐藏的video元素用于预缓冲
            if (!videoPreBuffer.value) {
              videoPreBuffer.value = document.createElement('video');
              videoPreBuffer.value.style.display = 'none';
              videoPreBuffer.value.preload = 'auto';
              document.body.appendChild(videoPreBuffer.value);
            }

            // 选择合适的质量
            let sourceUrl = '';
            if (nextVideo.sources && nextVideo.sources.length > 0) {
              // 使用比当前低一级的质量进行预加载
              const qualityIndex = nextVideo.sources.findIndex(s => s.label === idealQuality.value);
              if (qualityIndex > 0) {
                // 使用低一级的质量
                sourceUrl = nextVideo.sources[qualityIndex - 1].url;
              } else {
                // 使用最低质量
                sourceUrl = nextVideo.sources[nextVideo.sources.length - 1].url;
              }
            } else if (nextVideo.videoUrl) {
              sourceUrl = nextVideo.videoUrl;
            }

            if (sourceUrl) {
              videoPreBuffer.value.src = sourceUrl;
              videoPreBuffer.value.load();

              // 监听进度
              const handleProgress = () => {
                if (!videoPreBuffer.value) return;
                const buffered = videoPreBuffer.value.buffered;
                if (buffered.length > 0) {
                  const duration = videoPreBuffer.value.duration || 1;
                  preBufferProgress.value = (buffered.end(buffered.length - 1) / duration) * 100;

                  // 预缓冲30%后停止
                  if (preBufferProgress.value >= 30) {
                    isPreBuffering.value = false;
                    videoPreBuffer.value.removeEventListener('progress', handleProgress);
                    console.log(`[VideoPlayer] 预缓冲完成 ${preBufferProgress.value.toFixed(1)}%: ${nextVideo.title}`);
                  }
                }
              };

              videoPreBuffer.value.addEventListener('progress', handleProgress);
            }
          }
        } catch (err) {
          console.error('[VideoPlayer] 预缓冲失败:', err);
          isPreBuffering.value = false;
        }
      });
    } catch (err) {
      console.error('[VideoPlayer] 预缓冲初始化失败:', err);
      isPreBuffering.value = false;
    }
  };

  // 处理视频预加载
  const setupLazyLoading = () => {
    // 根据用户设备和网络状况决定预加载策略
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn) {
        if (conn.saveData) {
          // 用户开启了数据节省模式，禁用预加载
          console.log('[VideoPlayer] 用户开启了数据节省模式，禁用预加载');
          return;
        }

        // 根据网络类型设置预加载
        if (conn.effectiveType === '4g') {
          // 高速网络，允许完整预加载
        } else if (conn.effectiveType === '3g') {
          // 中速网络，减少预加载
        } else {
          // 低速网络，最小化预加载
          console.log('[VideoPlayer] 网络较慢，最小化预加载');
        }
      }
    }
  };

  // 优化视频初始加载
  const optimizeInitialLoad = () => {
    if (!videoRef.value) return;

    // 对于较长的视频，设置初始播放时禁用自动质量调整
    if (props.video.duration && props.video.duration > 1800) { // > 30分钟
      console.log('[VideoPlayer] 长视频优化: 初始加载使用较低质量');

      // 播放开始后再进行质量调整
      const handlePlaying = () => {
        videoRef.value?.removeEventListener('playing', handlePlaying);
        setTimeout(() => {
          if (currentQuality.value === 'auto') {
            estimateIdealQuality();
          }
        }, 5000);
      };

      videoRef.value.addEventListener('playing', handlePlaying, { once: true });
    }
  };

  // 组件挂载
  onMounted(() => {
    // ... existing code ...

    // 加载用户质量偏好
    loadUserQualityPreference();

    // 设置带宽测量间隔
    const bandwidthInterval = setInterval(() => {
      if (videoRef.value && !videoRef.value.paused) {
        measureBandwidth();
      }
    }, 30000); // 每30秒测量一次

    // 优化初始加载
    optimizeInitialLoad();

    // 设置预加载策略
    setupLazyLoading();

    // 卸载时清除定时器
    onUnmounted(() => {
      clearInterval(bandwidthInterval);

      // 移除预缓冲视频元素
      if (videoPreBuffer.value) {
        document.body.removeChild(videoPreBuffer.value);
        videoPreBuffer.value = null;
      }
    });
  });

  // 监听视频加载事件以测量带宽
  watch(() => videoRef.value, (newVal) => {
    if (newVal) {
      newVal.addEventListener('progress', () => {
        if (currentQuality.value === 'auto') {
          measureBandwidth();
        }
      });
    }
  });

  // 导出preBufferNextVideo方法供外部调用
  defineExpose({
    preBufferNextVideo
  });

  // ... existing code ...
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
    touch-action: none;
    /* 防止浏览器默认的触摸行为 */
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

  /* 触摸反馈 */
  .touch-feedback {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .touch-feedback.visible {
    opacity: 1;
  }

  /* 截图模式 */
  .screenshot-mode {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .screenshot-image {
    max-width: 90%;
    max-height: 70%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .screenshot-actions {
    margin-top: 20px;
    display: flex;
    gap: 16px;
  }

  /* 预缓冲指示器 */
  .prebuffer-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    color: #fff;
    font-size: 12px;
  }

  /* 画质下拉按钮 */
  .quality-control .n-button {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
  }

  /* 确保播放器正确响应 */
  :deep(.plyr__video-wrapper) {
    height: 100% !important;
  }

  /* 提高移动设备上的控件可点击区域 */
  @media (max-width: 768px) {

    :deep(.plyr__controls button),
    :deep(.plyr__control) {
      min-height: 44px;
      min-width: 44px;
    }
  }

  /* 启用硬件加速 */
  .player-container,
  .danmaku-area,
  .danmaku-item,
  :deep(.plyr),
  :deep(.plyr__video-wrapper) {
    transform: translateZ(0);
    will-change: transform;
  }
</style>