/**
* @file NotFoundPage.vue
* @description 404页面，使用 NotFound 组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="not-found-page">
    <h1>404 - 页面未找到</h1>
    <p>您访问的页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[NotFoundPage] 组件已挂载');
  });
</script>

<style scoped>
  .not-found-page {
    padding: 40px;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    font-size: 32px;
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 24px;
    color: #666;
  }

  a {
    color: #7c3aed;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>