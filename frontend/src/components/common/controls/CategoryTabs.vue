/**
* @file CategoryTabs.vue
* @description 分类标签组件 - 提供分类选择的标签组
* @author Atom Video Team
* @date 2025-04-10
*/

<template>
  <div class="category-tabs" :class="[{ 'inline': inline }, customClass]">
    <button v-for="tab in tabs" :key="tab.id || tab.value" class="tab-btn"
      :class="{ 'active': modelValue === (tab.id || tab.value) }" @click="handleTabClick(tab.id || tab.value)">
      {{ tab.name || tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Tab {
    id?: string;
    value?: string;
    name?: string;
    label?: string;
  }

  const props = defineProps({
    /**
     * 标签列表，支持 {id, name} 或 {value, label} 格式
     */
    tabs: {
      type: Array as () => Tab[],
      required: true
    },
    /**
     * 当前选中的标签 ID
     */
    modelValue: {
      type: String,
      required: true
    },
    /**
     * 是否内联显示（无背景）
     */
    inline: {
      type: Boolean,
      default: false
    },
    /**
     * 自定义样式类名
     */
    customClass: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  /**
   * 处理标签点击事件
   */
  const handleTabClick = (id: string) => {
    emit('update:modelValue', id);
    emit('change', id);
  };
</script>

<style scoped>
  .category-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 8px 16px;
    background-color: var(--bg-color-secondary);
    border-radius: var(--radius-lg);
    margin-bottom: 1rem;
    flex: 1;
  }

  .inline {
    background-color: transparent;
    padding: 0;
  }

  .tab-btn {
    padding: 0.35rem 0.8rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: var(--bg-color-tertiary);
    color: var(--text-color-secondary);
    border: 1px solid var(--border-color);
  }

  .tab-btn:hover {
    background-color: var(--hover-color);
    color: var(--text-color);
  }

  .tab-btn.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  /* 深色模式优化 */
  :root.dark .category-tabs,
  .dark-mode .category-tabs {
    background-color: rgba(40, 40, 40, 0.6);
    border: 1px solid rgba(70, 70, 70, 0.5);
  }

  :root.dark .inline,
  .dark-mode .inline {
    background-color: transparent;
    border: none;
  }

  :root.dark .tab-btn,
  .dark-mode .tab-btn {
    background-color: rgba(60, 60, 60, 0.5);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(80, 80, 80, 0.3);
  }

  :root.dark .tab-btn:hover,
  .dark-mode .tab-btn:hover {
    background-color: rgba(80, 80, 80, 0.7);
    color: rgba(255, 255, 255, 0.9);
  }

  :root.dark .tab-btn.active,
  .dark-mode .tab-btn.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .category-tabs {
      padding: 8px 12px;
    }

    .tab-btn {
      padding: 0.25rem 0.6rem;
      font-size: 0.8rem;
    }
  }
</style>