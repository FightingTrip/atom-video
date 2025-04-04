<template>
  <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
    <video ref="videoRef" class="w-full h-full" :poster="poster" @timeupdate="updateProgress"
      @loadedmetadata="updateDuration">
      <source :src="src" type="video/mp4" />
      您的浏览器不支持 HTML5 视频播放。
    </video>

    <!-- 控制栏 -->
    <div
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <!-- 进度条 -->
      <div class="relative w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer" @click="seekTo">
        <div class="absolute top-0 left-0 h-full bg-red-600 rounded-full" :style="{ width: `${progress}%` }"></div>
        <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" :style="{ left: `${progress}%` }">
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="togglePlay" class="text-white hover:text-gray-300 transition-colors">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <div class="flex items-center gap-2 text-white">
            <button @click="toggleMute" class="hover:text-gray-300 transition-colors">
              <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
            </button>
            <input type="range" v-model="volume" min="0" max="1" step="0.1" class="w-20 accent-white" />
          </div>
          <span class="text-white text-sm">{{ currentTime }} / {{ duration }}</span>
        </div>
        <button @click="toggleFullscreen" class="text-white hover:text-gray-300 transition-colors">
          <i class="fas fa-expand"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';

  const props = defineProps<{
    src: string;
    poster?: string;
  }>();

  const videoRef = ref<HTMLVideoElement | null>(null);
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const volume = ref(1);
  const progress = ref(0);
  const currentTime = ref('0:00');
  const duration = ref('0:00');

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
  };

  const updateDuration = () => {
    if (!videoRef.value) return;
    const { duration: total } = videoRef.value;
    const minutes = Math.floor(total / 60);
    const seconds = Math.floor(total % 60);
    duration.value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const updateTimeDisplay = () => {
    if (!videoRef.value) return;
    const { currentTime: current } = videoRef.value;
    const minutes = Math.floor(current / 60);
    const seconds = Math.floor(current % 60);
    currentTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seekTo = (event: MouseEvent) => {
    if (!videoRef.value) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    videoRef.value.currentTime = percentage * videoRef.value.duration;
  };

  const toggleFullscreen = () => {
    if (!videoRef.value) return;
    if (!document.fullscreenElement) {
      videoRef.value.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 监听音量变化
  watch(volume, (newVolume: number) => {
    if (!videoRef.value) return;
    videoRef.value.volume = newVolume;
    isMuted.value = newVolume === 0;
  });

  // 监听键盘事件
  const handleKeyPress = (event: KeyboardEvent) => {
    if (!videoRef.value) return;
    switch (event.key) {
      case ' ':
      case 'k':
        togglePlay();
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'ArrowLeft':
        videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 5);
        break;
      case 'ArrowRight':
        videoRef.value.currentTime = Math.min(
          videoRef.value.duration,
          videoRef.value.currentTime + 5
        );
        break;
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress);
  });
</script>