/**
* @file ExplorePage.vue
* @description 发现页面，使用 ExploreComponent 组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="explore-page">
    <ExploreComponent />
  </div>
</template>

<script setup lang="ts">
  import ExploreComponent from '@/components/business/feed/ExploreComponent.vue';
</script>

<style scoped>
  .explore-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>