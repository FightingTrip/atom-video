/**
* @file VideoPlayerTemp.vue
* @description 临时视频播放器组件，用于替代VideoPlayerComponent
*/

<template>
  <div class="video-player-temp">
    <video :src="videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'"
      :poster="thumbnailUrl || 'https://picsum.photos/800/450'" controls class="video-element"></video>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    videoUrl: String,
    thumbnailUrl: String,
    title: String,
    duration: {
      type: Number,
      default: 0
    }
  });
</script>

<style scoped>
  .video-player-temp {
    width: 100%;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-element {
    width: 100%;
    max-height: 70vh;
    display: block;
  }
</style>