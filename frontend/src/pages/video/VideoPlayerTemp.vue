/**
* @file VideoPlayerTemp.vue
* @description 增强的视频播放器组件，仿YouTube风格
*/

<template>
  <div class="video-player" :class="{ 'fullscreen': isFullscreen }">
    <div v-if="loading" class="loading-overlay">
      <n-spin size="large" />
      <p>加载视频中...</p>
    </div>
    <div v-if="error" class="error-overlay">
      <n-icon size="48" color="#d03050">
        <WarningOutline />
      </n-icon>
      <p>{{ error }}</p>
      <n-button @click="retryLoading">重试</n-button>
    </div>

    <!-- 视频元素 -->
    <video ref="videoRef" class="video-element"
      :src="videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'"
      :poster="thumbnailUrl || 'https://picsum.photos/800/450'" @click="togglePlay" @timeupdate="handleTimeUpdate"
      @loadeddata="handleLoadedData" @ended="handleEnded" @error="handleError" @progress="handleProgress"
      @waiting="isBuffering = true" @playing="isBuffering = false"></video>

    <!-- 缓冲指示器 -->
    <div v-if="isBuffering" class="buffering-indicator">
      <n-spin size="large" />
    </div>

    <!-- 悬浮控制条 -->
    <div class="controls" :class="{ 'show': controlsVisible || isDragging }">
      <!-- 进度条 -->
      <div class="progress-container" @mousedown="startDrag" @mousemove="handleDrag" @mouseup="endDrag"
        @mouseleave="endDrag" ref="progressContainer">
        <div class="progress-bar">
          <div class="buffer-bar" :style="{ width: `${bufferedPercent}%` }"></div>
          <div class="play-bar" :style="{ width: `${playedPercent}%` }"></div>
        </div>
        <div class="seek-handle" :style="{ left: `${playedPercent}%` }"></div>

        <!-- 预览时间气泡 -->
        <div v-if="showPreview" class="time-preview" :style="{ left: `${previewPosition}px` }">
          {{ formatTime(previewTime) }}
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-buttons">
        <div class="left-controls">
          <button @click="togglePlay" class="control-button">
            <n-icon size="24">
              <component :is="isPlaying ? 'PauseOutline' : 'PlayOutline'" />
            </n-icon>
          </button>

          <button @click="skip(-10)" class="control-button">
            <n-icon size="24">
              <ReloadOutline />
            </n-icon>
            <span class="skip-text">10</span>
          </button>

          <button @click="skip(10)" class="control-button">
            <n-icon size="24">
              <PlayForwardOutline />
            </n-icon>
            <span class="skip-text">10</span>
          </button>

          <div class="volume-control">
            <button @click="toggleMute" class="control-button">
              <n-icon size="24">
                <component :is="volumeIcon" />
              </n-icon>
            </button>
            <div class="volume-slider-container">
              <input type="range" min="0" max="100" v-model="volume" class="volume-slider" @input="setVolume" />
            </div>
          </div>

          <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>

        <div class="right-controls">
          <button @click="toggleCaptions" class="control-button" :class="{ active: captionsEnabled }">
            <n-icon size="24">
              <TextOutline />
            </n-icon>
          </button>

          <button @click="toggleSettings" class="control-button" :class="{ active: showSettings }">
            <n-icon size="24">
              <SettingsOutline />
            </n-icon>
          </button>

          <button @click="togglePictureInPicture" class="control-button">
            <n-icon size="24">
              <TelescopeOutline />
            </n-icon>
          </button>

          <button @click="toggleFullscreen" class="control-button">
            <n-icon size="24">
              <component :is="isFullscreen ? 'ContractOutline' : 'ExpandOutline'" />
            </n-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-panel">
      <div class="settings-header">
        <span>设置</span>
        <button @click="showSettings = false" class="close-button">
          <n-icon>
            <CloseOutline />
          </n-icon>
        </button>
      </div>
      <div class="settings-content">
        <div class="settings-group">
          <div class="settings-title">播放速度</div>
          <div class="settings-options">
            <button v-for="rate in playbackRates" :key="rate" @click="setPlaybackRate(rate)"
              :class="{ active: playbackRate === rate }" class="settings-option">
              {{ rate === 1 ? '正常' : rate }}
            </button>
          </div>
        </div>
        <div class="settings-group">
          <div class="settings-title">画质</div>
          <div class="settings-options">
            <button v-for="quality in qualities" :key="quality.value" @click="setQuality(quality.value)"
              :class="{ active: currentQuality === quality.value }" class="settings-option">
              {{ quality.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import {
    NSpin,
    NIcon,
    NButton,
    useMessage
  } from 'naive-ui';
  import {
    WarningOutline,
    PlayOutline,
    PauseOutline,
    VolumeHighOutline,
    VolumeMediumOutline,
    VolumeLowOutline,
    VolumeOffOutline,
    ReloadOutline,
    PlayForwardOutline,
    TextOutline,
    SettingsOutline,
    TelescopeOutline,
    ExpandOutline,
    ContractOutline,
    CloseOutline
  } from '@vicons/ionicons5';

  const props = defineProps({
    videoUrl: String,
    thumbnailUrl: String,
    title: String,
    duration: {
      type: Number,
      default: 0
    }
  });

  const emit = defineEmits(['time-update', 'ended', 'loaded']);

  // 状态变量
  const videoRef = ref<HTMLVideoElement | null>(null);
  const progressContainer = ref<HTMLElement | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const bufferedPercent = ref(0);
  const volume = ref(100);
  const isMuted = ref(false);
  const isFullscreen = ref(false);
  const controlsVisible = ref(true);
  const controlsTimeout = ref<number | null>(null);
  const isBuffering = ref(false);
  const captionsEnabled = ref(false);
  const showSettings = ref(false);
  const playbackRate = ref(1);
  const currentQuality = ref('auto');
  const showPreview = ref(false);
  const previewPosition = ref(0);
  const previewTime = ref(0);
  const isDragging = ref(false);

  const message = useMessage();

  // 计算属性
  const playedPercent = computed(() => {
    if (duration.value <= 0) return 0;
    return (currentTime.value / duration.value) * 100;
  });

  const volumeIcon = computed(() => {
    if (isMuted.value || volume.value === 0) return 'VolumeOffOutline';
    if (volume.value < 30) return 'VolumeLowOutline';
    if (volume.value < 70) return 'VolumeMediumOutline';
    return 'VolumeHighOutline';
  });

  // 播放速度选项
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // 画质选项
  const qualities = [
    { label: '自动', value: 'auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
    { label: '360p', value: '360' }
  ];

  // 方法
  function togglePlay() {
    if (!videoRef.value) return;

    if (videoRef.value.paused) {
      videoRef.value.play().then(() => {
        isPlaying.value = true;
      }).catch(err => {
        console.error('播放失败:', err);
        error.value = '无法播放视频';
      });
    } else {
      videoRef.value.pause();
      isPlaying.value = false;
    }

    showControls();
  }

  function handleTimeUpdate() {
    if (!videoRef.value) return;
    currentTime.value = videoRef.value.currentTime;
    emit('time-update', currentTime.value);
  }

  function handleLoadedData() {
    if (!videoRef.value) return;
    loading.value = false;
    duration.value = videoRef.value.duration;
    emit('loaded', {
      duration: duration.value,
      videoWidth: videoRef.value.videoWidth,
      videoHeight: videoRef.value.videoHeight
    });
  }

  function handleEnded() {
    isPlaying.value = false;
    emit('ended');
  }

  function handleError() {
    loading.value = false;
    error.value = '视频加载失败，请稍后重试';
  }

  function handleProgress() {
    if (!videoRef.value) return;

    const video = videoRef.value;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      bufferedPercent.value = (bufferedEnd / duration.value) * 100;
    }
  }

  function retryLoading() {
    if (!videoRef.value) return;

    error.value = null;
    loading.value = true;
    videoRef.value.load();
  }

  function setVolume() {
    if (!videoRef.value) return;

    const vol = parseInt(volume.value.toString()) / 100;
    videoRef.value.volume = vol;

    if (vol === 0) {
      isMuted.value = true;
      videoRef.value.muted = true;
    } else if (isMuted.value) {
      isMuted.value = false;
      videoRef.value.muted = false;
    }
  }

  function toggleMute() {
    if (!videoRef.value) return;

    isMuted.value = !isMuted.value;
    videoRef.value.muted = isMuted.value;

    if (isMuted.value) {
      // 记住之前的音量
      if (volume.value > 0) {
        videoRef.value.volume = 0;
      }
    } else {
      // 恢复之前的音量
      const vol = parseInt(volume.value.toString()) / 100;
      videoRef.value.volume = vol;
    }
  }

  function skip(seconds: number) {
    if (!videoRef.value) return;

    const newTime = videoRef.value.currentTime + seconds;
    videoRef.value.currentTime = Math.max(0, Math.min(newTime, duration.value));
  }

  function seekTo(percent: number) {
    if (!videoRef.value || duration.value <= 0) return;

    const seekTime = (duration.value * percent) / 100;
    videoRef.value.currentTime = seekTime;
  }

  function startDrag(e: MouseEvent) {
    if (!progressContainer.value) return;

    isDragging.value = true;
    const rect = progressContainer.value.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    seekTo(Math.max(0, Math.min(pos, 100)));
  }

  function handleDrag(e: MouseEvent) {
    if (!progressContainer.value) return;

    const rect = progressContainer.value.getBoundingClientRect();
    const pos = (e.clientX - rect.left);
    const percent = (pos / rect.width) * 100;

    // 更新预览位置和时间
    previewPosition.value = pos;
    previewTime.value = (duration.value * Math.max(0, Math.min(percent, 100))) / 100;
    showPreview.value = true;

    if (isDragging.value) {
      seekTo(Math.max(0, Math.min(percent, 100)));
    }
  }

  function endDrag() {
    isDragging.value = false;
    showPreview.value = false;
  }

  function toggleFullscreen() {
    if (!videoRef.value) return;

    if (!document.fullscreenElement) {
      videoRef.value.requestFullscreen().then(() => {
        isFullscreen.value = true;
      }).catch(err => {
        message.error('无法进入全屏模式: ' + err.message);
      });
    } else {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  }

  function togglePictureInPicture() {
    if (!videoRef.value) return;

    if (document.pictureInPictureElement !== videoRef.value) {
      videoRef.value.requestPictureInPicture().catch(err => {
        message.error('画中画模式不可用: ' + err.message);
      });
    } else {
      document.exitPictureInPicture().catch(err => {
        message.error('无法退出画中画模式: ' + err.message);
      });
    }
  }

  function toggleCaptions() {
    captionsEnabled.value = !captionsEnabled.value;
    // 实际应用中，这里应该启用/禁用字幕轨道
  }

  function toggleSettings() {
    showSettings.value = !showSettings.value;
  }

  function setPlaybackRate(rate: number) {
    if (!videoRef.value) return;

    playbackRate.value = rate;
    videoRef.value.playbackRate = rate;
    showSettings.value = false;
  }

  function setQuality(quality: string) {
    currentQuality.value = quality;
    // 实际应用中，这里应该切换不同质量的视频源
    showSettings.value = false;
  }

  function showControls() {
    controlsVisible.value = true;

    // 清除之前的定时器
    if (controlsTimeout.value) {
      window.clearTimeout(controlsTimeout.value);
    }

    // 设置新的定时器，3秒后隐藏控制条
    controlsTimeout.value = window.setTimeout(() => {
      if (!isDragging.value && isPlaying.value) {
        controlsVisible.value = false;
      }
    }, 3000);
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '00:00';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // 监听鼠标移动，显示控制条
  function handleMouseMove() {
    showControls();
  }

  // 生命周期钩子
  onMounted(() => {
    // 初始化视频元素
    if (videoRef.value) {
      // 设置初始音量
      videoRef.value.volume = volume.value / 100;

      // 添加鼠标移动事件监听器
      document.addEventListener('mousemove', handleMouseMove);

      // 添加全屏变化事件监听器
      document.addEventListener('fullscreenchange', () => {
        isFullscreen.value = !!document.fullscreenElement;
      });
    }
  });

  onUnmounted(() => {
    // 清理事件监听器
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('fullscreenchange', () => { });

    // 清理定时器
    if (controlsTimeout.value) {
      window.clearTimeout(controlsTimeout.value);
    }
  });

  // 监听音量变化
  watch(volume, () => {
    setVolume();
  });
</script>

<style scoped>
  .video-player {
    position: relative;
    width: 100%;
    background-color: #000;
    border-radius: 12px;
    overflow: hidden;
    user-select: none;
  }

  .video-element {
    width: 100%;
    max-height: 70vh;
    display: block;
    cursor: pointer;
  }

  .loading-overlay,
  .error-overlay,
  .buffering-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    gap: 16px;
    z-index: 5;
  }

  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 10;
  }

  .controls.show {
    opacity: 1;
  }

  .progress-container {
    position: relative;
    height: 20px;
    cursor: pointer;
    padding: 8px 0;
  }

  .progress-bar {
    height: 4px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    position: relative;
  }

  .buffer-bar,
  .play-bar {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 2px;
  }

  .buffer-bar {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .play-bar {
    background-color: #f00;
  }

  .seek-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #f00;
    border-radius: 50%;
    top: 4px;
    transform: translateX(-50%);
    transition: transform 0.1s;
  }

  .seek-handle:hover,
  .progress-container:hover .seek-handle {
    transform: translateX(-50%) scale(1.3);
  }

  .time-preview {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    bottom: 25px;
    transform: translateX(-50%);
  }

  .control-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  .left-controls,
  .right-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .control-button {
    background: transparent;
    border: none;
    color: white;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .control-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .control-button.active {
    color: #f00;
  }

  .skip-text {
    position: absolute;
    bottom: 0;
    font-size: 8px;
  }

  .volume-control {
    display: flex;
    align-items: center;
  }

  .volume-slider-container {
    width: 0;
    overflow: hidden;
    transition: width 0.3s;
  }

  .volume-control:hover .volume-slider-container {
    width: 60px;
  }

  .volume-slider {
    width: 60px;
    height: 4px;
    appearance: none;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    border-radius: 2px;
  }

  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  .time-display {
    font-size: 14px;
    margin-left: 8px;
  }

  .settings-panel {
    position: absolute;
    right: 10px;
    bottom: 50px;
    width: 200px;
    background-color: rgba(28, 28, 28, 0.9);
    border-radius: 8px;
    color: white;
    overflow: hidden;
    z-index: 15;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .close-button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }

  .settings-content {
    padding: 10px;
  }

  .settings-group {
    margin-bottom: 16px;
  }

  .settings-title {
    font-size: 14px;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.7);
  }

  .settings-options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .settings-option {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .settings-option:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .settings-option.active {
    background: #f00;
  }

  /* 全屏模式样式 */
  .video-player.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    z-index: 9999;
  }

  .video-player.fullscreen .video-element {
    max-height: 100vh;
    height: 100vh;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .control-buttons {
      flex-wrap: wrap;
    }

    .time-display {
      display: none;
    }

    .volume-control:hover .volume-slider-container {
      width: 40px;
    }

    .volume-slider {
      width: 40px;
    }
  }
</style>