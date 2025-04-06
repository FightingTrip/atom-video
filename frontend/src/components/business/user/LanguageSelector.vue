/**
* @file LanguageSelector.vue
* @description 语言选择器组件，用于切换网站语言
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 语言切换功能
* - 当前语言状态显示
* - 语言持久化存储
* - 响应式布局
* - 黑白主题适配
*/

<template>
  <n-dropdown trigger="click" :options="options" @select="handleSelect">
    <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500">
      <i class="fas fa-globe text-xl"></i>
    </button>
  </n-dropdown>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { DropdownOption } from 'naive-ui';

  const { locale, t } = useI18n();

  const options = computed<DropdownOption[]>(() => [
    {
      label: '简体中文',
      key: 'zh-CN',
      disabled: locale.value === 'zh-CN'
    },
    {
      label: 'English',
      key: 'en-US',
      disabled: locale.value === 'en-US'
    }
  ]);

  const handleSelect = (key: string) => {
    locale.value = key;
    localStorage.setItem('language', key);
  };
</script>

<style scoped>
  .language-selector {
    position: relative;
  }

  .selector-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-normal);
    color: var(--text-primary);
  }

  .selector-trigger:hover {
    background-color: var(--tertiary-bg);
  }

  .language-icon {
    font-size: var(--text-xl);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--spacing-sm);
    background-color: var(--primary-bg);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    min-width: 150px;
    z-index: 50;
  }

  .language-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color var(--transition-normal);
  }

  .language-option:hover {
    background-color: var(--tertiary-bg);
  }

  .language-option.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .language-option.disabled:hover {
    background-color: transparent;
  }

  @media (max-width: 768px) {
    .language-text {
      display: none;
    }
  }
</style>