<template>
  <div class="video-upload-page">
    <h1>视频上传页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[VideoUploadPage] 组件已挂载');
  });
</script>

<style scoped>
  .video-upload-page {
    padding: 20px;
  }
</style>