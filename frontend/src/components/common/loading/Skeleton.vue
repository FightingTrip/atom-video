/**
* @file Skeleton.vue
* @description 骨架屏加载组件，用于内容加载时的占位显示
* @features
* - 支持多种形状：圆形、矩形、视频
* - 可自定义尺寸
* - 支持暗色主题
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="skeleton" :class="{ 'is-animated': animated }">
    <div v-for="i in rows" :key="i" class="skeleton-row" :style="{
      width: width,
      height: height,
      borderRadius: rounded ? 'var(--border-radius)' : '0'
    }" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    width?: string
    height?: string
    rows?: number
    rounded?: boolean
    animated?: boolean
  }>(), {
    width: '100%',
    height: '16px',
    rows: 1,
    rounded: true,
    animated: true
  })
</script>

<style scoped>
  .skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .skeleton-row {
    background-color: var(--background-color-secondary);
    overflow: hidden;
  }

  .is-animated .skeleton-row {
    position: relative;
  }

  .is-animated .skeleton-row::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
        transparent,
        var(--background-color-hover),
        transparent);
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(100%);
    }
  }
</style>