/**
* @file HistoryPage.vue
* @description 用户观看历史页面，展示和管理历史记录
* @created 2024-04-06
* @last-modified 2024-04-07
*/

<template>
  <div class="history-page">
    <History />
  </div>
</template>

<script setup lang="ts">
  import History from '@/components/business/library/History.vue';
</script>

<style scoped>
  .history-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>