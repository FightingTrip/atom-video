<!-- 顶部导航栏 -->
<template>
  <header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
    <div class="h-14 px-4 flex items-center justify-between">
      <!-- 左侧区域 -->
      <div class="flex items-center space-x-4">
        <button class="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          @click="$emit('toggle-sidebar')">
          <i class="fas fa-bars"></i>
        </button>
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Make Develop All In One
          </span>
        </router-link>
      </div>

      <!-- 中间搜索区域 -->
      <div class="flex-1 max-w-2xl mx-4">
        <div class="relative">
          <input type="text" v-model="searchQuery"
            :placeholder="i18nStore.currentLocale === 'zh-CN' ? '搜索视频...' : 'Search videos...'"
            class="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- 右侧功能区 -->
      <div class="flex items-center space-x-4">
        <!-- 语言切换 -->
        <n-dropdown :options="languageOptions" placement="bottom-end" trigger="click" @select="handleLanguageChange">
          <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <i class="fas fa-globe"></i>
          </button>
        </n-dropdown>

        <!-- 主题切换 -->
        <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" @click="handleThemeChange">
          <i :class="['fas', isDark ? 'fa-sun' : 'fa-moon']"></i>
        </button>

        <!-- 用户头像/登录按钮 -->
        <n-button type="primary" size="small">
          {{ currentLocale === 'zh-CN' ? '登录' : 'Login' }}
        </n-button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useThemeStore } from '@/stores/theme'
  import { useI18nStore } from '@/stores/i18n'

  const themeStore = useThemeStore()
  const i18nStore = useI18nStore()

  const isDark = computed(() => themeStore.isDark)
  const currentLocale = computed(() => i18nStore.currentLocale)

  const searchQuery = ref('')

  const languageOptions = [
    {
      label: '简体中文',
      key: 'zh-CN'
    },
    {
      label: 'English',
      key: 'en-US'
    }
  ]

  // 处理主题切换
  const handleThemeChange = () => {
    themeStore.toggleTheme()
  }

  // 处理语言切换
  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key)
  }
</script>