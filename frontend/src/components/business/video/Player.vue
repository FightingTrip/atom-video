<template>
  <div class="video-player">
    <div class="player-container" ref="playerContainer">
      <video ref="videoElement" class="player-element" :src="videoSrc" @click="togglePlay" @timeupdate="updateProgress"
        @ended="handleEnded" @loadedmetadata="handleMetadataLoaded" @error="handleError"></video>

      <div class="player-overlay" v-if="!isPlaying && !isLoading">
        <div class="play-button" @click="togglePlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      </div>

      <div class="loading-overlay" v-if="isLoading">
        <div class="loading-spinner"></div>
      </div>

      <div class="player-controls" v-show="showControls" @mousemove="resetControlsTimer">
        <div class="progress-container" @click="seekToPosition">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>

        <div class="controls-row">
          <div class="left-controls">
            <button class="control-button" @click="togglePlay">
              <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            </button>

            <div class="time-display">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>

          <div class="right-controls">
            <div class="volume-control">
              <button class="control-button" @click="toggleMute">
                <svg v-if="isMuted || volume === 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
                <svg v-else-if="volume < 0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              </button>

              <input type="range" class="volume-slider" min="0" max="1" step="0.1" v-model="volume"
                @input="updateVolume">
            </div>

            <button class="control-button" @click="toggleFullscreen">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3">
                </path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="video-info">
      <h1 class="video-title">{{ videoTitle }}</h1>
      <div class="video-stats">
        <span>{{ formatViews(videoViews) }}</span>
        <span>•</span>
        <span>{{ formatDate(videoDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  // 模拟视频数据
  const videoId = ref('sample-video-id');
  const videoTitle = ref('示例视频标题 - Vue.js 入门教程');
  const videoViews = ref(1287654);
  const videoDate = ref('2023-04-15T12:00:00Z');
  const videoSrc = ref('https://samplelib.com/lib/preview/mp4/sample-5s.mp4'); // 示例视频URL

  // Player refs和状态
  const videoElement = ref<HTMLVideoElement | null>(null);
  const playerContainer = ref<HTMLElement | null>(null);
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const volume = ref(1);
  const currentTime = ref(0);
  const duration = ref(0);
  const progress = ref(0);
  const isLoading = ref(true);
  const showControls = ref(true);
  const controlsTimer = ref<NodeJS.Timeout | null>(null);

  // 格式化时间为 MM:SS 格式
  function formatTime(seconds: number): string {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 格式化播放量
  function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M ${t('common.views')}`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K ${t('common.views')}`;
    } else {
      return `${views} ${t('common.views')}`;
    }
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return '今天';
    } else if (diffDays < 30) {
      return `${diffDays} ${t('common.daysAgo')}`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ${t('common.monthsAgo')}`;
    }
  }

  // 播放/暂停视频
  function togglePlay() {
    if (!videoElement.value) return;

    if (videoElement.value.paused) {
      videoElement.value.play();
      isPlaying.value = true;
    } else {
      videoElement.value.pause();
      isPlaying.value = false;
    }

    showControls.value = true;
    resetControlsTimer();
  }

  // 静音/取消静音
  function toggleMute() {
    if (!videoElement.value) return;

    videoElement.value.muted = !videoElement.value.muted;
    isMuted.value = videoElement.value.muted;

    if (isMuted.value) {
      // 保存当前音量以便恢复
      volume.value = 0;
    } else {
      volume.value = videoElement.value.volume;
    }
  }

  // 更新音量
  function updateVolume() {
    if (!videoElement.value) return;

    videoElement.value.volume = volume.value;
    isMuted.value = volume.value === 0;
    videoElement.value.muted = isMuted.value;
  }

  // 切换全屏
  function toggleFullscreen() {
    if (!playerContainer.value) return;

    if (!document.fullscreenElement) {
      playerContainer.value.requestFullscreen().catch(err => {
        console.error(`全屏请求失败: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // 跳转到特定位置
  function seekToPosition(event: MouseEvent) {
    if (!videoElement.value) return;

    const progressBar = event.currentTarget as HTMLElement;
    const position = event.offsetX / progressBar.clientWidth;
    videoElement.value.currentTime = position * duration.value;

    updateProgress();
  }

  // 更新进度条
  function updateProgress() {
    if (!videoElement.value) return;

    currentTime.value = videoElement.value.currentTime;
    progress.value = (currentTime.value / duration.value) * 100;
  }

  // 视频结束时的处理
  function handleEnded() {
    isPlaying.value = false;
    showControls.value = true;
  }

  // 视频元数据加载完成的处理
  function handleMetadataLoaded() {
    if (!videoElement.value) return;

    duration.value = videoElement.value.duration;
    isLoading.value = false;
  }

  // 视频加载错误的处理
  function handleError() {
    isLoading.value = false;
    console.error('视频加载失败');
  }

  // 隐藏控制栏的计时器
  function resetControlsTimer() {
    showControls.value = true;

    if (controlsTimer.value) {
      clearTimeout(controlsTimer.value);
    }

    controlsTimer.value = setTimeout(() => {
      if (isPlaying.value) {
        showControls.value = false;
      }
    }, 3000);
  }

  // 监听鼠标移动以显示控制栏
  onMounted(() => {
    if (playerContainer.value) {
      playerContainer.value.addEventListener('mousemove', resetControlsTimer);
      playerContainer.value.addEventListener('mouseleave', () => {
        if (isPlaying.value) {
          showControls.value = false;
        }
      });
    }

    // 初始化音量
    if (videoElement.value) {
      videoElement.value.volume = volume.value;
    }

    resetControlsTimer();
  });

  // 清理事件监听器
  onUnmounted(() => {
    if (playerContainer.value) {
      playerContainer.value.removeEventListener('mousemove', resetControlsTimer);
    }

    if (controlsTimer.value) {
      clearTimeout(controlsTimer.value);
    }
  });

  // 监听音量变化
  watch(volume, (newVolume) => {
    if (videoElement.value) {
      videoElement.value.volume = newVolume;
      isMuted.value = newVolume === 0;
      videoElement.value.muted = isMuted.value;
    }
  });
</script>

<style scoped>
  .video-player {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .player-container {
    position: relative;
    width: 100%;
    background-color: #000;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 8px;
  }

  .player-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .player-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .play-button {
    color: white;
    width: 64px;
    height: 64px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .play-button:hover {
    opacity: 1;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .player-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    padding: 10px;
    transition: opacity 0.3s;
  }

  .progress-container {
    width: 100%;
    height: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
    transition: height 0.2s;
  }

  .progress-container:hover .progress-bar {
    height: 6px;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--color-accent-primary);
    transition: width 0.1s;
  }

  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }

  .left-controls,
  .right-controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .control-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .control-button:hover {
    color: var(--color-accent-primary);
  }

  .time-display {
    font-size: 14px;
    font-variant-numeric: tabular-nums;
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 120px;
  }

  .volume-slider {
    width: 80px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    outline: none;
    transition: height 0.2s;
  }

  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
  }

  .volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
    border: none;
  }

  .volume-slider:hover {
    height: 6px;
  }

  .video-info {
    padding: 20px 0;
  }

  .video-title {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 10px;
  }

  .video-stats {
    display: flex;
    gap: 8px;
    color: var(--color-text-secondary);
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .volume-control {
      width: auto;
    }

    .volume-slider {
      display: none;
    }

    .time-display {
      font-size: 12px;
    }
  }
</style>