/**
* @file NotFoundPage.vue
* @description 404页面，使用 NotFound 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="not-found-page">
    <NotFound />
  </div>
</template>

<script setup lang="ts">
  import NotFound from '@/components/business/error/NotFound.vue';
</script>

<style scoped>
  .not-found-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>