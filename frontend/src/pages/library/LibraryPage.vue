/**
* @file LibraryPage.vue
* @description 媒体库页面，使用 Library 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="library-page">
    <Library />
  </div>
</template>

<script setup lang="ts">
  import Library from '@/components/business/library/Library.vue'
</script>

<style scoped>
  .library-page {
    min-height: 100vh;
  }
</style>