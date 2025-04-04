<!-- 
  技术栈说明：
  - Vue 3: 使用 Composition API 和 <script setup> 语法
  - TypeScript: 强类型支持
  - Tailwind CSS: 样式框架
  - Vue Router: 路由管理
  - Pinia: 状态管理
-->

<script setup lang="ts">
  // 导入路由视图
  import { RouterView, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  // 导入 Naive UI 组件
  import { NConfigProvider, NMessageProvider, NButton, NDropdown, NAvatar } from 'naive-ui'
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'
  import { computed, ref, onMounted, markRaw } from 'vue';
  import { useThemeStore } from '@/stores/theme';
  import { darkTheme, lightTheme } from 'naive-ui';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  import UserMenu from '@/components/UserMenu.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import TheHeader from '@/components/layout/TheHeader.vue';
  import TheSidebar from '@/components/layout/TheSidebar.vue';
  import TheFooter from '@/components/layout/TheFooter.vue';
  import TagList from '@/components/TagList.vue'
  import { useI18nStore } from '@/stores/i18n'
  import { useVideoStore } from '@/stores/video'
  import { useUserStore } from '@/stores/user'
  import DefaultLayout from '@/layouts/DefaultLayout.vue'
  import BlankLayout from '@/layouts/BlankLayout.vue'

  // 声明使用的组件
  const components = {
    NConfigProvider,
    NMessageProvider,
    RouterView,
    Toast,
    LanguageSelector,
    ThemeToggle,
    UserMenu,
    Sidebar,
    SearchBar,
    TheHeader,
    TheSidebar,
    TheFooter,
    TagList
  };

  const { t, locale } = useI18n();
  const route = useRoute();

  const themeStore = useThemeStore();
  const i18nStore = useI18nStore();
  const videoStore = useVideoStore();
  const userStore = useUserStore();

  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
  });

  const sidebarCollapsed = ref(false);
  const selectedTag = ref('all');

  const currentLanguageLabel = computed(() =>
    i18nStore.currentLocale === 'zh-CN' ? '简体中文' : 'English'
  );

  const languageOptions = [
    {
      label: '简体中文',
      key: 'zh-CN',
    },
    {
      label: 'English',
      key: 'en-US',
    }
  ];

  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key);
  };

  const toggleTheme = () => {
    themeStore.toggleTheme();
  };

  const tags = [
    { id: 'all', name: 'all' },
    { id: 'javascript', name: 'javascript' },
    { id: 'typescript', name: 'typescript' },
    { id: 'vue', name: 'vue' },
    { id: 'react', name: 'react' },
    { id: 'nodejs', name: 'nodejs' },
    { id: 'python', name: 'python' },
  ];

  const selectTag = (tagId: string) => {
    selectedTag.value = tagId;
    videoStore.setCategory(tagId);
  };

  // 根据路由元数据选择布局
  const layout = computed(() => {
    const layoutName = route.meta.layout || 'default'
    return markRaw(layoutName === 'blank' ? BlankLayout : DefaultLayout)
  })

  // 初始化主题
  onMounted(() => {
    i18nStore.initLocale();
    themeStore.initTheme();
    userStore.initUser();

    // 设置初始语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18nStore.setLocale(savedLanguage);
      locale.value = savedLanguage;
    }
  });
</script>

<template>
  <n-config-provider :theme="themeStore.naiveTheme" :theme-overrides="themeStore.themeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #666;
  }

  /* 深色模式滚动条 */
  .dark ::-webkit-scrollbar-thumb {
    background: #666;
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background: #888;
  }

  .theme-title {
    color: var(--text-color);
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .theme-search-bar {
    background-color: var(--header-bg);
    border-color: var(--border-color);
    transition: background-color var(--transition-duration), border-color var(--transition-duration);
  }
</style>
