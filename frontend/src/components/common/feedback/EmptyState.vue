/**
* @file EmptyState.vue
* @description 空状态组件，用于在没有数据时显示
*/

<template>
  <div class="empty-state">
    <div class="empty-state-icon" v-if="icon">
      <n-icon :size="iconSize">
        <component :is="icon" />
      </n-icon>
    </div>
    <img v-else-if="image" :src="image" :alt="title" class="empty-state-image" />
    <img v-else src="@/assets/images/empty-state.svg" alt="Empty state" class="empty-state-image" />

    <h3 class="empty-state-title">{{ title }}</h3>
    <p class="empty-state-description" v-if="description">{{ description }}</p>

    <div class="empty-state-action" v-if="$slots.action">
      <slot name="action"></slot>
    </div>
    <n-button v-else-if="actionText" :type="actionType" @click="$emit('actionClick')">
      {{ actionText }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
  import { NIcon, NButton } from 'naive-ui'
  import { Component, computed } from 'vue'

  const props = defineProps({
    /**
     * 标题
     */
    title: {
      type: String,
      default: '没有数据'
    },
    /**
     * 描述
     */
    description: {
      type: String,
      default: ''
    },
    /**
     * 图标组件
     */
    icon: {
      type: Object as () => Component,
      default: null
    },
    /**
     * 图标大小
     */
    iconSize: {
      type: [String, Number],
      default: 48
    },
    /**
     * 图片路径
     */
    image: {
      type: String,
      default: ''
    },
    /**
     * 按钮文字
     */
    actionText: {
      type: String,
      default: ''
    },
    /**
     * 按钮类型
     */
    actionType: {
      type: String,
      default: 'primary'
    }
  })

  defineEmits(['actionClick'])
</script>

<style scoped>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    width: 100%;
  }

  .empty-state-icon {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  .empty-state-image {
    max-width: 150px;
    height: auto;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0.5rem 0;
  }

  .empty-state-description {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
    max-width: 400px;
  }

  .empty-state-action {
    margin-top: 1rem;
  }
</style>