<!-- 视频播放页面 -->
<template>
  <VideoPlayLayout :video="video" :is-liked="isLiked" :is-disliked="isDisliked" :is-favorited="isFavorited"
    :is-subscribed="isSubscribed" @time-update="handleTimeUpdate" @ended="handleVideoEnded" @like="handleLike"
    @dislike="handleDislike" @favorite="handleFavorite" @subscribe="handleSubscribe" @share="handleShare"
    @report="handleReport" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import type { IVideo } from '@atom-video/shared-types';
  import VideoPlayLayout from '@/components/business/video/VideoPlayLayout.vue';
  import { mockVideos } from '@/mock/video';

  const route = useRoute();
  const videoId = route.params.id as string;

  // 状态
  const video = ref<IVideo | null>(null);
  const isLiked = ref(false);
  const isDisliked = ref(false);
  const isFavorited = ref(false);
  const isSubscribed = ref(false);

  // 方法
  const loadVideo = async () => {
    try {
      // 这里使用模拟数据，实际项目中应该调用API
      video.value = mockVideos[0];
    } catch (error) {
      console.error('加载视频失败:', error);
    }
  };

  const handleTimeUpdate = (currentTime: number) => {
    // 处理视频时间更新
    console.log('当前播放时间:', currentTime);
  };

  const handleVideoEnded = () => {
    // 处理视频播放结束
    console.log('视频播放结束');
  };

  const handleLike = () => {
    isLiked.value = !isLiked.value;
    if (isLiked.value) {
      isDisliked.value = false;
    }
  };

  const handleDislike = () => {
    isDisliked.value = !isDisliked.value;
    if (isDisliked.value) {
      isLiked.value = false;
    }
  };

  const handleFavorite = () => {
    isFavorited.value = !isFavorited.value;
  };

  const handleSubscribe = () => {
    isSubscribed.value = !isSubscribed.value;
  };

  const handleShare = () => {
    // 处理分享
    console.log('分享视频');
  };

  const handleReport = (payload: { reason: string; description: string }) => {
    // 处理举报
    console.log('举报视频:', payload.reason, payload.description);
  };

  // 生命周期钩子
  onMounted(() => {
    loadVideo();
  });
</script>

<style scoped>
  .video-play-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  .video-container {
    margin-bottom: 24px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-details {
    margin-bottom: 24px;
  }
</style>