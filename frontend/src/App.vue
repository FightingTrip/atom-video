// 技术栈说明：
// - Vue 3: 使用 Composition API 和
<script setup>  语法
    // - TypeScript: 强类型支持
    // - Tailwind CSS: 样式框架
    // - Vue Router: 路由管理
    // - Pinia: 状态管理

    < script setup lang = "ts" >
  // 导入路由视图
  import { RouterView } from 'vue-router'
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <RouterView />
    <Toast />
  </div>
</template>

<style>
  /* 全局样式 */
</style>
