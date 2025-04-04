<template>
  <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
    <video ref="videoRef" class="w-full h-full" :poster="poster" @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata" @waiting="isBuffering = true" @playing="isBuffering = false"
      @ended="onVideoEnded" :class="{ 'cursor-none': controlsHidden }">
      <source :src="src" type="video/mp4" />
      <track v-for="(subtitle, index) in props.subtitles || []" :key="index" :kind="subtitle.kind" :src="subtitle.src"
        :srclang="subtitle.srclang" :label="subtitle.label" />
      您的浏览器不支持 HTML5 视频播放。
    </video>

    <!-- 缓冲状态显示 -->
    <div v-if="isBuffering" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>

    <!-- 控制栏 -->
    <div v-show="!controlsHidden"
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity"
      @mousemove="showControls">
      <!-- 进度条和预览 -->
      <div class="relative w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer group/progress" @click="seekTo"
        @mousemove="updatePreview" @mouseleave="hidePreview">
        <!-- 缓冲进度 -->
        <div class="absolute top-0 left-0 h-full bg-gray-400 rounded-full" :style="{ width: `${buffered}%` }"></div>
        <!-- 播放进度 -->
        <div class="absolute top-0 left-0 h-full bg-red-600 rounded-full" :style="{ width: `${progress}%` }"></div>
        <!-- 进度条手柄 -->
        <div
          class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
          :style="{ left: `${progress}%` }">
        </div>
        <!-- 时间预览 -->
        <div v-if="showPreviewTime"
          class="absolute bottom-6 px-2 py-1 bg-black/80 text-white text-xs rounded transform -translate-x-1/2"
          :style="{ left: `${previewPosition}%` }">
          {{ previewTime }}
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="togglePlay" class="text-white hover:text-gray-300 transition-colors">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <div class="flex items-center gap-2 text-white group/volume">
            <button @click="toggleMute" class="hover:text-gray-300 transition-colors">
              <i :class="volumeIcon"></i>
            </button>
            <input type="range" v-model="volume" min="0" max="1" step="0.1"
              class="w-0 group-hover/volume:w-20 transition-all duration-300 accent-white" />
          </div>
          <span class="text-white text-sm">{{ currentTime }} / {{ duration }}</span>
          <div class="relative group/speed">
            <button class="text-white hover:text-gray-300 transition-colors">
              <span class="text-sm">{{ playbackSpeed }}x</span>
            </button>
            <div class="absolute bottom-full left-0 mb-2 hidden group-hover/speed:block">
              <div class="bg-black/80 rounded p-2 space-y-1">
                <button v-for="speed in playbackSpeeds" :key="speed" @click="setPlaybackSpeed(speed)"
                  class="block w-full text-white text-sm px-3 py-1 hover:bg-white/20 rounded"
                  :class="{ 'bg-white/20': playbackSpeed === speed }">
                  {{ speed }}x
                </button>
              </div>
            </div>
          </div>
          <div class="relative group/subtitle" v-if="props.subtitles?.length">
            <button class="text-white hover:text-gray-300 transition-colors">
              <i class="fas fa-closed-captioning"></i>
            </button>
            <div class="absolute bottom-full left-0 mb-2 hidden group-hover/subtitle:block">
              <div class="bg-black/80 rounded p-2 space-y-1">
                <button v-for="(subtitle, index) in props.subtitles" :key="index" @click="selectSubtitle(index)"
                  class="block w-full text-white text-sm px-3 py-1 hover:bg-white/20 rounded"
                  :class="{ 'bg-white/20': currentSubtitle === index }">
                  {{ subtitle.label }}
                </button>
                <button @click="selectSubtitle(-1)"
                  class="block w-full text-white text-sm px-3 py-1 hover:bg-white/20 rounded"
                  :class="{ 'bg-white/20': currentSubtitle === -1 }">
                  关闭字幕
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button v-if="supportsPiP" @click="togglePiP" class="text-white hover:text-gray-300 transition-colors">
            <i class="fas fa-external-link-alt"></i>
          </button>
          <button @click="toggleFullscreen" class="text-white hover:text-gray-300 transition-colors">
            <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

  interface Subtitle {
    kind: string;
    src: string;
    srclang: string;
    label: string;
  }

  const props = defineProps<{
    src: string;
    poster?: string;
    subtitles?: Subtitle[];
  }>();

  const videoRef = ref<HTMLVideoElement | null>(null);
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const volume = ref(1);
  const progress = ref(0);
  const buffered = ref(0);
  const currentTime = ref('0:00');
  const duration = ref('0:00');
  const isBuffering = ref(false);
  const playbackSpeed = ref(1);
  const isFullscreen = ref(false);
  const supportsPiP = ref(false);
  const isPiP = ref(false);
  const currentSubtitle = ref(-1);
  const controlsHidden = ref(false);
  const controlsTimeout = ref<number | null>(null);
  const showPreviewTime = ref(false);
  const previewPosition = ref(0);
  const previewTime = ref('0:00');

  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const volumeIcon = computed(() => {
    if (isMuted.value || volume.value === 0) return 'fas fa-volume-mute';
    if (volume.value < 0.5) return 'fas fa-volume-down';
    return 'fas fa-volume-up';
  });

  const togglePlay = () => {
    if (!videoRef.value) return;
    if (isPlaying.value) {
      videoRef.value.pause();
    } else {
      videoRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  };

  const toggleMute = () => {
    if (!videoRef.value) return;
    videoRef.value.muted = !isMuted.value;
    isMuted.value = !isMuted.value;
  };

  const updateProgress = () => {
    if (!videoRef.value) return;
    const { currentTime: current, duration: total } = videoRef.value;
    progress.value = (current / total) * 100;
    updateTimeDisplay();
    updateBuffered();
  };

  const updateBuffered = () => {
    if (!videoRef.value) return;
    const { buffered: timeRanges, duration: total } = videoRef.value;
    if (timeRanges.length > 0) {
      buffered.value = (timeRanges.end(timeRanges.length - 1) / total) * 100;
    }
  };

  const onLoadedMetadata = () => {
    if (!videoRef.value) return;
    updateDuration();
    checkPiPSupport();
  };

  const updateDuration = () => {
    if (!videoRef.value) return;
    const { duration: total } = videoRef.value;
    duration.value = formatTime(total);
  };

  const updateTimeDisplay = () => {
    if (!videoRef.value) return;
    currentTime.value = formatTime(videoRef.value.currentTime);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const seekTo = (event: MouseEvent) => {
    if (!videoRef.value) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    videoRef.value.currentTime = percentage * videoRef.value.duration;
  };

  const updatePreview = (event: MouseEvent) => {
    if (!videoRef.value) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    previewPosition.value = percentage * 100;
    previewTime.value = formatTime(percentage * videoRef.value.duration);
    showPreviewTime.value = true;
  };

  const hidePreview = () => {
    showPreviewTime.value = false;
  };

  const toggleFullscreen = async () => {
    if (!videoRef.value) return;

    try {
      if (!document.fullscreenElement) {
        await videoRef.value.requestFullscreen();
        isFullscreen.value = true;
      } else {
        await document.exitFullscreen();
        isFullscreen.value = false;
      }
    } catch (err) {
      console.error('全屏切换失败:', err);
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    if (!videoRef.value) return;
    videoRef.value.playbackRate = speed;
    playbackSpeed.value = speed;
  };

  const checkPiPSupport = () => {
    if (!videoRef.value) return;
    supportsPiP.value = document.pictureInPictureEnabled &&
      !videoRef.value.disablePictureInPicture;
  };

  const togglePiP = async () => {
    if (!videoRef.value) return;

    try {
      if (!document.pictureInPictureElement) {
        await videoRef.value.requestPictureInPicture();
        isPiP.value = true;
      } else {
        await document.exitPictureInPicture();
        isPiP.value = false;
      }
    } catch (err) {
      console.error('画中画切换失败:', err);
    }
  };

  const selectSubtitle = (index: number) => {
    if (!videoRef.value) return;
    const tracks = videoRef.value.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = i === index ? 'showing' : 'hidden';
    }
    currentSubtitle.value = index;
  };

  const showControls = () => {
    controlsHidden.value = false;
    if (controlsTimeout.value) {
      clearTimeout(controlsTimeout.value);
    }
    controlsTimeout.value = window.setTimeout(() => {
      if (isPlaying.value) {
        controlsHidden.value = true;
      }
    }, 3000);
  };

  const onVideoEnded = () => {
    isPlaying.value = false;
    controlsHidden.value = false;
  };

  watch(volume, (newVolume: number) => {
    if (!videoRef.value) return;
    videoRef.value.volume = newVolume;
    isMuted.value = newVolume === 0;
  });

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!videoRef.value) return;

    switch (event.key.toLowerCase()) {
      case ' ':
      case 'k':
        event.preventDefault();
        togglePlay();
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'p':
        if (supportsPiP.value) togglePiP();
        break;
      case 'arrowleft':
        videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 5);
        break;
      case 'arrowright':
        videoRef.value.currentTime = Math.min(
          videoRef.value.duration,
          videoRef.value.currentTime + 5
        );
        break;
      case 'arrowup':
        event.preventDefault();
        volume.value = Math.min(1, volume.value + 0.1);
        break;
      case 'arrowdown':
        event.preventDefault();
        volume.value = Math.max(0, volume.value - 0.1);
        break;
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement;
    });
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('fullscreenchange', () => { });
    if (controlsTimeout.value) {
      clearTimeout(controlsTimeout.value);
    }
  });
</script>