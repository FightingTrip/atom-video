<!-- 顶部导航栏 -->
<template>
  <div class="flex items-center justify-between w-full">
    <!-- 标题 -->
    <h1 class="text-xl font-bold theme-title">
      Make Develop All In One
    </h1>

    <!-- 右侧工具栏 -->
    <div class="flex items-center">
      <!-- 搜索框 -->
      <div class="relative w-96 mr-8">
        <input type="text" :placeholder="t('header.search')"
          class="w-full h-9 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
        <i class="fas fa-search absolute left-4 top-2.5 text-gray-400"></i>
      </div>

      <!-- 语言切换 -->
      <n-dropdown :options="languageOptions" @select="handleLanguageChange" trigger="click">
        <n-button quaternary>
          <template #icon>
            <i class="fas fa-globe text-lg"></i>
          </template>
          <span class="ml-1">{{ currentLanguageLabel }}</span>
        </n-button>
      </n-dropdown>

      <!-- 主题切换 -->
      <n-button quaternary @click="toggleTheme">
        <template #icon>
          <i :class="['fas', themeStore.isDark ? 'fa-sun' : 'fa-moon', 'text-lg']"></i>
        </template>
      </n-button>

      <!-- 登录按钮 -->
      <n-button type="primary">
        {{ t('header.login') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useThemeStore } from '@/stores/theme'
  import { useI18nStore } from '@/stores/i18n'
  import { NButton, NDropdown, useMessage } from 'naive-ui'

  const { t } = useI18n()
  const message = useMessage()
  const themeStore = useThemeStore()
  const i18nStore = useI18nStore()

  const currentLanguageLabel = computed(() =>
    i18nStore.currentLocale === 'zh-CN' ? '简体中文' : 'English'
  )

  const languageOptions = [
    {
      label: '简体中文',
      key: 'zh-CN',
    },
    {
      label: 'English',
      key: 'en-US',
    }
  ]

  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key)
    if (message) {
      message.success(key === 'zh-CN' ? '已切换到简体中文' : 'Switched to English')
    }
  }

  const toggleTheme = () => {
    themeStore.toggleTheme()
    if (message) {
      message.success(themeStore.isDark ? '已切换到深色主题' : '已切换到浅色主题')
    }
  }

  // 监听主题变化，实现动画过渡效果
  watch(() => themeStore.isDark, () => {
    // 添加过渡效果
    document.documentElement.style.transition = 'background-color 0.5s, color 0.5s, border-color 0.5s'

    // 在过渡结束后移除过渡样式，避免影响其他操作
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 500)
  })
</script>

<style scoped>

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 添加悬浮动画 */
  .group:hover .absolute {
    animation: fadeIn 0.2s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -5px);
    }

    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .theme-title {
    color: var(--text-color);
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>