<!-- 搜索结果页面 -->
<template>
  <div class="search-results-page">
    <SearchResults />
  </div>
</template>

<script setup lang="ts">
  import SearchResults from '@/components/business/search/SearchResults.vue';
</script>

<style scoped>
  .search-results-page {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }
</style>