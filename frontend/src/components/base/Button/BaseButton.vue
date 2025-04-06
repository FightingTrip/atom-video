<template>
  <button :class="buttonClasses" @click="handleClick" :disabled="disabled">
    <slot name="icon-left"></slot>
    <span v-if="label">{{ label }}</span>
    <slot></slot>
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  // Props 定义
  const props = withDefaults(defineProps<{
    label?: string
    type?: 'primary' | 'secondary' | 'tertiary' | 'danger'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
    loading?: boolean
  }>(), {
    type: 'primary',
    size: 'medium',
    disabled: false,
    loading: false
  })

  // 事件定义
  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()

  // 计算按钮类名
  const buttonClasses = computed(() => [
    'base-button',
    `base-button--${props.type}`,
    `base-button--${props.size}`,
    {
      'base-button--disabled': props.disabled,
      'base-button--loading': props.loading
    }
  ])

  // 点击事件处理
  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
      emit('click', event)
    }
  }
</script>

<style scoped>
  .base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    outline: none;
  }

  .base-button--primary {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
  }

  .base-button--primary:hover:not(.base-button--disabled) {
    background-color: var(--primary-color-hover);
  }

  .base-button--secondary {
    background-color: var(--secondary-color);
    color: var(--text-on-secondary);
  }

  .base-button--tertiary {
    background-color: transparent;
    color: var(--primary-color);
  }

  .base-button--danger {
    background-color: var(--error-color);
    color: var(--text-on-error);
  }

  .base-button--small {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .base-button--medium {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-md);
  }

  .base-button--large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
  }

  .base-button--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .base-button--loading {
    position: relative;
    cursor: wait;
  }
</style>