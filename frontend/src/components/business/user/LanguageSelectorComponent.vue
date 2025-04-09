/**
* @file LanguageSelector.vue
* @description 语言选择器组件，用于切换网站语言
* @author Atom Video Team
* @date 2025-04-09
*
* @features
* - 语言切换功能
* - 当前语言状态显示
* - 语言持久化存储
* - 响应式布局
* - 黑白主题适配
* - 切换反馈提示
* - 过渡动画效果
*/

<template>
  <div class="language-selector">
    <n-dropdown trigger="click" :options="options" @select="handleSelect">
      <button class="selector-trigger" :title="$t('settings.language')">
        <transition name="fade" mode="out-in">
          <n-icon :key="locale" class="globe-icon">
            <LanguageOutline />
          </n-icon>
        </transition>
        <span class="language-text">{{ currentLanguageLabel }}</span>
        <n-icon class="dropdown-icon">
          <ChevronDownOutline />
        </n-icon>
      </button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { DropdownOption } from 'naive-ui';
  import { useMessage, NIcon, NDropdown } from 'naive-ui';
  import { ChevronDownOutline, LanguageOutline } from '@vicons/ionicons5';

  const message = useMessage();
  const { locale, t } = useI18n();

  const currentLanguageLabel = computed(() => {
    return locale.value === 'zh-CN' ? '简体中文' : 'English';
  });

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

  const handleSelect = async (key: string) => {
    try {
      locale.value = key;
      localStorage.setItem('language', key);
      message.success(t('settings.languageChanged'));
    } catch (error) {
      message.error(t('settings.languageChangeFailed'));
      console.error('Language change failed:', error);
    }
  };
</script>

<style scoped>
  .language-selector {
    position: relative;
    margin-right: 0.5rem;
  }

  .selector-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-color-primary);
    background-color: var(--primary-color-light, #e6f7ff);
    border: 1px solid var(--primary-color, #1890ff);
  }

  .selector-trigger:hover {
    background-color: var(--primary-color, #1890ff);
    color: #fff;
    transform: translateY(-1px);
  }

  .globe-icon {
    font-size: 1.25rem;
  }

  .selector-trigger:active {
    transform: translateY(0);
  }

  .language-text {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .dropdown-icon {
    font-size: 1rem;
    opacity: 0.7;
    transition: transform 0.3s ease;
  }

  .selector-trigger:hover .dropdown-icon {
    transform: translateY(2px);
    opacity: 1;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 768px) {
    .language-text {
      display: none;
    }

    .selector-trigger {
      padding: 0.5rem;
    }

    .dropdown-icon {
      display: none;
    }
  }

  /* 深色模式优化 */
  :root.dark .selector-trigger,
  .dark-mode .selector-trigger {
    background-color: var(--primary-color-dark, #003a8c);
    border-color: var(--primary-color, #1890ff);
    color: #fff;
  }

  :root.dark .selector-trigger:hover,
  .dark-mode .selector-trigger:hover {
    background-color: var(--primary-color, #1890ff);
  }
</style>