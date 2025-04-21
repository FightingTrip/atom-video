/**
* @file HomePage.vue
* @description 网站首页
* @created 2025-04-12
*/

<template>
  <div class="home-page">
    <HomeVideoList />
  </div>
</template>

<script setup lang="ts">
  import HomeVideoList from '@/components/business/home/HomeVideoList.vue';
</script>

<style scoped>
  .home-page {
    min-height: 100vh;
  }
</style>