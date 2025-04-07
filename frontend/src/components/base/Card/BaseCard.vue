/**
* @file BaseCard.vue
* @description 基础卡片组件，用于展示内容的容器组件
* @author Atom Video Team
* @date 2025-04-06
*/
<template>
  <div class="base-card" :class="cardClasses">
    <div v-if="$slots.header || title" class="base-card__header">
      <slot name="header">
        <h3 class="base-card__title">{{ title }}</h3>
      </slot>
    </div>
    <div class="base-card__content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  // Props 定义
  const props = withDefaults(defineProps<{
    title?: string
    variant?: 'default' | 'outlined' | 'elevated'
    padded?: boolean
  }>(), {
    variant: 'default',
    padded: true
  })

  // 计算卡片类名
  const cardClasses = computed(() => [
    `base-card--${props.variant}`,
    { 'base-card--padded': props.padded }
  ])
</script>

<style scoped>
  .base-card {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .base-card--default {
    border: 1px solid var(--border-light);
  }

  .base-card--outlined {
    border: 1px solid var(--border-light);
    background-color: transparent;
  }

  .base-card--elevated {
    box-shadow: var(--shadow-md);
    border: none;
  }

  .base-card--padded .base-card__content {
    padding: var(--spacing-md);
  }

  .base-card__header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-light);
  }

  .base-card__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .base-card__footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-light);
    background-color: var(--bg-tertiary);
  }
</style>