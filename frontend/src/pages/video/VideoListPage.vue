/**
* @file VideoListPage.vue
* @description 视频列表页面，使用 VideoList 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="video-list-page">
    <VideoList />
  </div>
</template>

<script setup lang="ts">
  import VideoList from '@/components/business/video/VideoList.vue'
</script>

<style scoped>
  .video-list-page {
    min-height: 100vh;
  }
</style>