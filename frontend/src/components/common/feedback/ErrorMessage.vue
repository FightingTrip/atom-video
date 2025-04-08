/**
* @file ErrorMessage.vue
* @description 显示错误消息的通用组件
*/

<template>
  <div v-if="message" :class="['error-message', size ? `error-message-${size}` : '']">
    <n-icon class="error-icon" v-if="showIcon">
      <AlertCircleOutline />
    </n-icon>
    <span class="error-text">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
  import { AlertCircleOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  defineProps({
    /**
     * 错误消息内容
     */
    message: {
      type: String,
      default: ''
    },
    /**
     * 组件大小
     */
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
    },
    /**
     * 是否显示图标
     */
    showIcon: {
      type: Boolean,
      default: true
    }
  })
</script>

<style scoped>
  .error-message {
    display: flex;
    align-items: center;
    color: var(--color-error);
    padding: 0.5rem;
    border-radius: var(--radius-md);
    background-color: var(--color-error-bg);
    font-size: 0.875rem;
    margin: 0.5rem 0;
  }

  .error-message-sm {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .error-message-lg {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }

  .error-icon {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  .error-text {
    flex: 1;
  }
</style>