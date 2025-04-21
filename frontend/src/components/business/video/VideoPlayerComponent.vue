/**
* @file VideoPlayerComponent.vue
* @description 视频播放器组件
*/

<template>
  <div class="video-player">
    <div v-if="loading" class="loading-state">
      <n-spin size="large" />
      <p>加载视频中...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <n-icon size="48" color="#d03050">
        <WarningOutline />
      </n-icon>
      <p>{{ error }}</p>
      <n-button @click="retryLoading">重试</n-button>
    </div>
    <div v-else class="player-container">
      <video ref="videoRef" class="video-element"
        :src="videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'"
        :poster="thumbnailUrl || 'https://picsum.photos/800/450'" controls @timeupdate="handleTimeUpdate"
        @ended="handleEnded" @error="handleError" @loadeddata="handleLoadedData"></video>

      <div class="video-info">
        <h2 class="video-title">{{ title || '视频标题' }}</h2>
        <div class="video-meta">
          <span>{{ formatDuration(duration) }}</span>
          <n-button @click="$router.push('/')" quaternary>返回首页</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';
  import { NSpin, NIcon, NButton } from 'naive-ui';
  import { WarningOutline } from '@vicons/ionicons5';
  import { useRouter, useRoute } from 'vue-router';

  const props = defineProps({
    videoUrl: String,
    thumbnailUrl: String,
    title: String,
    duration: {
      type: Number,
      default: 0
    }
  });

  const emit = defineEmits(['time-update', 'ended']);

  const router = useRouter();
  const route = useRoute();
  const videoId = route.params.id;

  const videoRef = ref<HTMLVideoElement | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // 格式化时长
  function formatDuration(seconds: number): string {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 重试加载视频
  function retryLoading() {
    error.value = null;
    loading.value = true;

    if (videoRef.value) {
      videoRef.value.load();
    }
  }

  // 处理视频时间更新
  function handleTimeUpdate(event: Event) {
    const video = event.target as HTMLVideoElement;
    emit('time-update', video.currentTime);
  }

  // 处理视频播放结束
  function handleEnded() {
    emit('ended');
  }

  // 处理视频加载错误
  function handleError() {
    loading.value = false;
    error.value = '视频加载失败，请稍后重试';
  }

  // 处理视频数据加载完成
  function handleLoadedData() {
    loading.value = false;
  }

  // 生命周期钩子
  onMounted(() => {
    console.log(`加载视频播放器，视频ID: ${videoId}`);

    // 模拟视频加载延迟
    setTimeout(() => {
      if (loading.value) {
        loading.value = false;
      }
    }, 1500);
  });

  onUnmounted(() => {
    // 清理资源
    if (videoRef.value) {
      videoRef.value.pause();
      videoRef.value.src = '';
      videoRef.value.load();
    }
  });
</script>

<style scoped>
  .video-player {
    width: 100%;
    position: relative;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
    min-height: 400px;
  }

  .loading-state,
  .error-state {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2;
  }

  .error-state p {
    margin: 16px 0;
  }

  .player-container {
    width: 100%;
    height: 100%;
  }

  .video-element {
    width: 100%;
    max-height: 70vh;
    display: block;
  }

  .video-info {
    padding: 16px;
    background-color: #f8f8f8;
  }

  .video-title {
    font-size: 18px;
    margin: 0 0 8px 0;
  }

  .video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .video-player {
      min-height: 250px;
    }
  }
</style>