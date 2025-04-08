/**
* @file TrendingPage.vue
* @description 热门页面，使用 Trending 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="trending-page">
    <Trending />
  </div>
</template>

<script setup lang="ts">
  import Trending from '@/components/business/feed/Trending.vue';
</script>

<style scoped>
  .trending-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>