/**
* @file TrendingPage.vue
* @description 热门页面，使用 TrendingComponent 组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="trending-page">
    <TrendingComponent />
  </div>
</template>

<script setup lang="ts">
  import TrendingComponent from '@/components/business/feed/TrendingComponent.vue';
</script>

<style scoped>
  .trending-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>