/**
* @file HomePage.vue
* @description 首页，使用 Feed 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="home-page">
    <Feed />
  </div>
</template>

<script setup lang="ts">
  import Feed from '@/components/business/feed/Feed.vue'
</script>

<style scoped>
  .home-page {
    min-height: 100vh;
  }
</style>