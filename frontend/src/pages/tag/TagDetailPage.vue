/**
* @file TagDetailPage.vue
* @description 标签详情页面，使用 TagDetail 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="tag-detail-page">
    <TagDetail />
  </div>
</template>

<script setup lang="ts">
  import TagDetail from '@/components/business/tag/TagDetail.vue'
</script>

<style scoped>
  .tag-detail-page {
    min-height: 100vh;
  }
</style>