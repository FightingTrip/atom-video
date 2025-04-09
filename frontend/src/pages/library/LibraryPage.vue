/**
* @file LibraryPage.vue
* @description 视频库页面，使用LibraryComponent组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="library-page">
    <LibraryComponent />
  </div>
</template>

<script setup lang="ts">
  import LibraryComponent from '@/components/business/library/LibraryComponent.vue'
</script>

<style scoped>
  .library-page {
    min-height: 100vh;
  }
</style>