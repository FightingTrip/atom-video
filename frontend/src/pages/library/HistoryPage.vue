/**
* @file HistoryPage.vue
* @description 观看历史页面，使用 History 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="history-page">
    <History />
  </div>
</template>

<script setup lang="ts">
  import History from '@/components/business/library/History.vue'
</script>

<style scoped>
  .history-page {
    min-height: 100vh;
  }
</style>