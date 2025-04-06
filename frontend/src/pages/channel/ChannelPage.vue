<template>
  <div class="channel-page">
    <h1>频道页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[ChannelPage] 组件已挂载');
  });
</script>

<style scoped>
  .channel-page {
    padding: 20px;
  }
</style>