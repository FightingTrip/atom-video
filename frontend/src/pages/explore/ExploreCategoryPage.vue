<!-- 探索分类页面 -->
<template>
  <div class="explore-category-page">
    <ExploreCategoryComponent />
  </div>
</template>

<script setup lang="ts">
  import ExploreCategoryComponent from '@/components/business/explore/ExploreCategoryComponent.vue';
</script>

<style scoped>
  .explore-category-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>