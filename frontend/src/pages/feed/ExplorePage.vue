/**
* @file ExplorePage.vue
* @description 发现页面，使用 Explore 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="explore-page">
    <Explore />
  </div>
</template>

<script setup lang="ts">
  import Explore from '@/components/business/feed/Explore.vue'
</script>

<style scoped>
  .explore-page {
    min-height: 100vh;
  }
</style>