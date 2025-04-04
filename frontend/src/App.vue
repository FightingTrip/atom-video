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
  import { RouterView } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  // 导入 Naive UI 组件
  import { NConfigProvider, NMessageProvider, NButton, NDropdown, NAvatar } from 'naive-ui'
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'
  import { computed, ref, onMounted } from 'vue';
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

  const { t } = useI18n();

  const themeStore = useThemeStore();
  const i18nStore = useI18nStore();
  const videoStore = useVideoStore();

  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
  });

  const sidebarCollapsed = ref(false);
  const selectedTag = ref('全部');

  const tags = [
    '全部',
    'JavaScript',
    'TypeScript',
    'Vue',
    'React',
    'Node.js',
    'Python'
  ];

  const handleTagClick = (tag: string) => {
    selectedTag.value = tag;
    videoStore.setCategory(tag);
  };

  // 初始化主题
  onMounted(() => {
    themeStore.initTheme();

    // 设置初始语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18nStore.setLocale(savedLanguage);
    }
  });
</script>

<template>
  <n-config-provider :theme="themeStore.naiveTheme">
    <n-message-provider>
      <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        <!-- 侧边栏 -->
        <TheSidebar v-model:collapsed="sidebarCollapsed"
          class="fixed left-0 top-0 h-screen z-40 transition-all duration-300" />

        <!-- 主要内容区域 -->
        <div class="flex-1 flex flex-col min-h-screen transition-all duration-300"
          :class="[sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64']">
          <!-- 头部导航 -->
          <TheHeader class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm" />

          <!-- 标签导航 - 只保留这一个 -->
          <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div class="flex items-center h-12 px-4 overflow-x-auto no-scrollbar">
              <button v-for="tag in tags" :key="tag"
                class="px-4 py-1.5 mx-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors" :class="[
                  selectedTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                ]" @click="handleTagClick(tag)">
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- 主内容 -->
          <main class="flex-1">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </main>

          <!-- 页脚 -->
          <TheFooter />
        </div>
      </div>
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
</style>
