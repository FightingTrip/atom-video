<template>
  <div class="video-detail-page">
    <h1>视频详情页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[VideoDetailPage] 组件已挂载');
  });
</script>

<style scoped>
  .video-detail-page {
    padding: 20px;
  }
</style>