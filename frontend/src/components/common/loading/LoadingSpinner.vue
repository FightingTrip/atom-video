/**
* @file LoadingSpinner.vue
* @description 通用加载动画组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="loading-spinner-container">
    <div class="loading-spinner" :style="{
      width: size + 'px',
      height: size + 'px',
      borderWidth: borderWidth + 'px'
    }"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    size?: number
    borderWidth?: number
    text?: string
    color?: string
  }>(), {
    size: 32,
    borderWidth: 3,
    text: '',
    color: 'var(--color-accent-primary)'
  })
</script>

<style scoped>
  .loading-spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .loading-spinner {
    border-radius: 50%;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: v-bind('color');
    animation: spin 1s linear infinite;
  }

  .loading-text {
    margin-top: 12px;
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>