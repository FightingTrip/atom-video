<template>
  <div class="user-settings-page">
    <h1>用户设置页</h1>
    <p>此页面正在开发中...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[UserSettingsPage] 组件已挂载');
  });
</script>

<style scoped>
  .user-settings-page {
    padding: 20px;
  }
</style>