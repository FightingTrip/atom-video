<!-- 视频描述组件 -->
<template>
  <div class="video-description">
    <h3>视频描述</h3>
    <p>{{ video?.description }}</p>
    <VideoMetaInfo :video="video" />
  </div>

  <div class="video-prerequisites" v-if="video?.prerequisites">
    <h3>学习前提</h3>
    <p>{{ video.prerequisites }}</p>
  </div>

  <div class="video-outcomes" v-if="video?.learningOutcomes">
    <h3>学习目标</h3>
    <p>{{ video.learningOutcomes }}</p>
  </div>
</template>

<script setup lang="ts">
  import type { IVideo } from '@atom-video/shared-types';
  import VideoMetaInfo from './VideoMetaInfo.vue';

  defineProps<{
    video: IVideo | null;
  }>();
</script>

<style scoped>

  .video-description,
  .video-prerequisites,
  .video-outcomes {
    margin-bottom: 24px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    color: #333;
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: #666;
  }
</style>