/**
* @file AboutPage.vue
* @description 关于页面，使用 About 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="about-page">
    <About />
  </div>
</template>

<script setup lang="ts">
  import About from '@/components/business/static/About.vue'
</script>

<style scoped>
  .about-page {
    min-height: 100vh;
  }
</style>