<!-- 
  @file App.vue
  @description 应用程序根组件
  @created 2024-04-05
-->

<script setup lang="ts">
  // 导入路由视图
  import { RouterView, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  // 导入布局组件
  import DefaultLayout from '@/layouts/DefaultLayout.vue'
  import BlankLayout from '@/layouts/BlankLayout.vue'

  // 导入功能组件
  import Toast from '@/components/common/Toast.vue'
  import LanguageSelector from '@/components/user/LanguageSelector.vue'
  import ThemeToggle from '@/components/common/ThemeToggle.vue'
  import UserMenu from '@/components/user/UserMenu.vue'
  import SearchBar from '@/components/search/SearchBar.vue'
  import TheHeader from '@/layouts/TheHeader.vue'
  import TheSidebar from '@/layouts/TheSidebar.vue'
  import TheFooter from '@/layouts/TheFooter.vue'
  import TagList from '@/components/tag/TagList.vue'

  // 导入状态管理
  import { useThemeStore } from '@/stores/theme'
  import { useI18nStore } from '@/stores/i18n'
  import { useVideoStore } from '@/stores/video'
  import { useUserStore } from '@/stores/user'

  // 导入工具函数
  import { computed, ref, onMounted, markRaw } from 'vue'
  import { darkTheme, lightTheme } from 'naive-ui'

  // 声明使用的组件
  const components = {
    RouterView,
    Toast,
    LanguageSelector,
    ThemeToggle,
    UserMenu,
    SearchBar,
    TheHeader,
    TheSidebar,
    TheFooter,
    TagList
  }

  // 状态管理
  const { t, locale } = useI18n()
  const route = useRoute()
  const themeStore = useThemeStore()
  const i18nStore = useI18nStore()
  const videoStore = useVideoStore()
  const userStore = useUserStore()

  // 计算属性
  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme
  })

  const sidebarCollapsed = ref(false)
  const selectedTag = ref('all')

  const currentLanguageLabel = computed(() =>
    i18nStore.currentLocale === 'zh-CN' ? '简体中文' : 'English'
  )

  // 语言选项
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

  // 标签数据
  const tags = [
    { id: 'all', name: 'all' },
    { id: 'javascript', name: 'javascript' },
    { id: 'typescript', name: 'typescript' },
    { id: 'vue', name: 'vue' },
    { id: 'react', name: 'react' },
    { id: 'nodejs', name: 'nodejs' },
    { id: 'python', name: 'python' },
  ]

  // 方法
  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key)
  }

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  const selectTag = (tagId: string) => {
    selectedTag.value = tagId
    videoStore.setCategory(tagId)
  }

  // 根据路由元数据选择布局
  const layout = computed(() => {
    const layoutName = route.meta.layout || 'default'
    return markRaw(layoutName === 'blank' ? BlankLayout : DefaultLayout)
  })

  // 生命周期钩子
  onMounted(() => {
    i18nStore.initLocale()
    themeStore.initTheme()
    userStore.initUser()

    // 设置初始语言
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      i18nStore.setLocale(savedLanguage)
      locale.value = savedLanguage
    }
  })
</script>

<template>
  <n-config-provider :theme="themeStore.theme" :theme-overrides="themeStore.themeOverrides">
    <n-message-provider>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';

  /* 滚动条样式 */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* 过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--text-color-secondary);
    border-radius: 3px;
  }

  /* 主题相关样式 */
  .theme-title {
    color: var(--text-color);
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .theme-search-bar {
    background-color: var(--bg-color);
    border-color: var(--border-color);
    transition: background-color var(--transition-duration),
      border-color var(--transition-duration);
  }

  /* 全局基础样式 */
  body {
    font-family: var(--font-family);
    color: var(--text-color);
    background-color: var(--bg-color-secondary);
    line-height: 1.5;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
