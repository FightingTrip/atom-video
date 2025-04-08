/**
* @file HomePage.vue
* @description 首页，使用 Feed 组件展示推荐视频
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="home-page">
    <Home />
  </div>
</template>

<script setup lang="ts">
  import Home from '@/components/business/feed/Home.vue';
</script>

<style scoped>
  .home-page {
    min-height: 100vh;
    width: 100%;
    background-color: #000;
  }

  /* 深色模式特定样式 */
  :root.dark .home-page,
  .dark-mode .home-page {
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>