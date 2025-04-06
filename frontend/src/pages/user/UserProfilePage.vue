<template>
  <div class="user-profile-page">
    <h1>用户资料页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[UserProfilePage] 组件已挂载');
  });
</script>

<style scoped>
  .user-profile-page {
    padding: 20px;
  }
</style>