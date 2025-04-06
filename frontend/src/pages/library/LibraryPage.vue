/**
* @file LibraryPage.vue
* @description 媒体库页面，使用 Library 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="library-page">
    <h1>收藏库页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[LibraryPage] 组件已挂载');
  });
</script>

<style scoped>
  .library-page {
    padding: 20px;
  }
</style>