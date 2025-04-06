/**
* @file HomePage.vue
* @description 首页，使用 Feed 组件展示推荐视频
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="home-page">
    <Feed />
  </div>
</template>

<script setup lang="ts">
  import Feed from '@/components/business/feed/Feed.vue';
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[HomePage] 组件已挂载');
  });
</script>

<style scoped>
  .home-page {
    min-height: 100vh;
  }
</style>