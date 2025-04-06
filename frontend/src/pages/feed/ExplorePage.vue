/**
* @file ExplorePage.vue
* @description 发现页面，使用 Explore 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="explore-page">
    <h1>探索页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[ExplorePage] 组件已挂载');
  });
</script>

<style scoped>
  .explore-page {
    padding: 20px;
  }
</style>