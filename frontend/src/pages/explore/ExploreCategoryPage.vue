<!-- 探索分类页面 -->
<template>
  <div class="explore-category-page">
    <ExploreCategory />
  </div>
</template>

<script setup lang="ts">
  import ExploreCategory from '@/components/business/explore/ExploreCategory.vue';
</script>

<style scoped>
  .explore-category-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>