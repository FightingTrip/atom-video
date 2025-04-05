/**
* @file BlankLayout.vue
* @description 空白布局组件，用于不需要导航栏和侧边栏的页面
* @features
* - 最小化布局
* - 响应式设计
* - 主题适配
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="blank-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
  // 空白布局组件，不包含任何导航元素
</script>

<style scoped>
  .blank-layout {
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--text-color);
  }
</style>