<template>
  <div class="search-results-page">
    <h1>搜索结果页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[SearchResultsPage] 组件已挂载');
  });
</script>

<style scoped>
  .search-results-page {
    padding: 20px;
  }
</style>