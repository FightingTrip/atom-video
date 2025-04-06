/**
* @file TrendingPage.vue
* @description 热门页面，使用 Trending 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="trending-page">
    <h1>热门页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[TrendingPage] 组件已挂载');
  });
</script>

<style scoped>
  .trending-page {
    padding: 20px;
  }
</style>