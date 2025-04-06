/**
* @file HistoryPage.vue
* @description 观看历史页面，使用 History 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="history-page">
    <h1>历史记录页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[HistoryPage] 组件已挂载');
  });
</script>

<style scoped>
  .history-page {
    padding: 20px;
  }
</style>