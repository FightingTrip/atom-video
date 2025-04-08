<template>
  <div class="test-component">
    <h1>测试组件已加载！</h1>
    <p>如果您能看到这条消息，表示组件系统正常工作。</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log('[TestComponent] 测试组件已挂载');
  });
</script>

<style scoped>
  .test-component {
    padding: 20px;
    margin: 20px;
    background-color: #4CAF50;
    color: white;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
  }
</style>