<!-- 视频播放布局组件 -->
<template>
  <div class="video-play-layout">
    <div class="video-container">
      <VideoPlayerComponent :video-url="video?.videoUrl" :thumbnail-url="video?.thumbnailUrl" :title="video?.title"
        :duration="video?.duration" @time-update="$emit('time-update', $event)" @ended="$emit('ended')" />
    </div>

    <div class="video-details">
      <VideoInteraction :video="video" :is-liked="isLiked" :is-disliked="isDisliked" :is-favorited="isFavorited"
        :is-subscribed="isSubscribed" @like="$emit('like')" @dislike="$emit('dislike')" @favorite="$emit('favorite')"
        @subscribe="$emit('subscribe')" @share="$emit('share')" @report="$emit('report', $event)" />
    </div>

    <VideoDescription :video="video" />
    <VideoResources :video="video" />
  </div>
</template>

<script setup lang="ts">
  import type { IVideo } from '@atom-video/shared-types';
  import { ref, onMounted, onUnmounted } from 'vue';
  import VideoPlayerComponent from './VideoPlayerComponent.vue';
  import VideoInteraction from './VideoInteraction.vue';
  import VideoDescription from './VideoDescription.vue';
  import VideoResources from './VideoResources.vue';

  defineProps<{
    video: IVideo | null;
    isLiked: boolean;
    isDisliked: boolean;
    isFavorited: boolean;
    isSubscribed: boolean;
  }>();

  defineEmits<{
    (e: 'time-update', time: number): void;
    (e: 'ended'): void;
    (e: 'like'): void;
    (e: 'dislike'): void;
    (e: 'favorite'): void;
    (e: 'subscribe'): void;
    (e: 'share'): void;
    (e: 'report', payload: { reason: string; description: string }): void;
  }>();
</script>

<style scoped>
  .video-play-layout {
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