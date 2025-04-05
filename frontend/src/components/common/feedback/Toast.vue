/**
* @file Toast.vue
* @description 通知提示组件，用于显示操作反馈、提示信息等
* @features
* - 支持多种类型：success、error、info、warning
* - 自动消失
* - 手动关闭
* - 响应式设计
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <Teleport to="body">
    <TransitionGroup :name="position" tag="div" class="toast-container" :class="position">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
        <n-icon size="20" class="toast-icon">
          <component :is="getIcon(toast.type)" />
        </n-icon>
        <div class="toast-content">
          <p class="toast-title">{{ toast.title }}</p>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <n-button quaternary circle size="small" class="toast-close" @click="removeToast(toast.id)">
          <template #icon>
            <n-icon>
              <CloseIcon />
            </n-icon>
          </template>
        </n-button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { NIcon, NButton } from 'naive-ui'
  import {
    CheckmarkCircle as SuccessIcon,
    Warning as WarningIcon,
    AlertCircle as ErrorIcon,
    InformationCircle as InfoIcon,
    Close as CloseIcon
  } from '@vicons/ionicons5'

  interface Toast {
    id: number
    type: 'success' | 'warning' | 'error' | 'info'
    title: string
    message: string
    duration?: number
  }

  const props = withDefaults(defineProps<{
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }>(), {
    position: 'top-right'
  })

  const toasts = ref<Toast[]>([])
  let toastId = 0

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return SuccessIcon
      case 'warning':
        return WarningIcon
      case 'error':
        return ErrorIcon
      case 'info':
        return InfoIcon
      default:
        return InfoIcon
    }
  }

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = ++toastId
    toasts.value.push({ ...toast, id })

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // 导出方法供外部使用
  defineExpose({
    addToast
  })
</script>

<style scoped>
  .toast-container {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }

  .top-right {
    top: 0;
    right: 0;
  }

  .top-left {
    top: 0;
    left: 0;
  }

  .bottom-right {
    bottom: 0;
    right: 0;
  }

  .bottom-left {
    bottom: 0;
    left: 0;
  }

  .toast {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    min-width: 300px;
    max-width: 400px;
  }

  .toast.success {
    border-left: 4px solid var(--success-color);
  }

  .toast.warning {
    border-left: 4px solid var(--warning-color);
  }

  .toast.error {
    border-left: 4px solid var(--error-color);
  }

  .toast.info {
    border-left: 4px solid var(--info-color);
  }

  .toast-icon {
    flex-shrink: 0;
  }

  .toast-content {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-color);
  }

  .toast-message {
    margin: var(--spacing-xs) 0 0;
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
    line-height: 1.4;
  }

  .toast-close {
    flex-shrink: 0;
    opacity: 0.5;
    transition: opacity var(--transition-duration);
  }

  .toast-close:hover {
    opacity: 1;
  }

  /* 动画效果 */
  .top-right-enter-active,
  .top-right-leave-active,
  .top-left-enter-active,
  .top-left-leave-active,
  .bottom-right-enter-active,
  .bottom-right-leave-active,
  .bottom-left-enter-active,
  .bottom-left-leave-active {
    transition: all var(--transition-duration);
  }

  .top-right-enter-from,
  .top-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .top-left-enter-from,
  .top-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .bottom-right-enter-from,
  .bottom-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .bottom-left-enter-from,
  .bottom-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
</style>