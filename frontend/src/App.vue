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
  import { NConfigProvider, NMessageProvider } from 'naive-ui'
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'
  import { computed } from 'vue';
  import { useThemeStore } from '@/stores/theme';
  import { darkTheme, lightTheme } from 'naive-ui';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  import UserMenu from '@/components/UserMenu.vue';

  // 声明使用的组件
  const components = {
    NConfigProvider,
    NMessageProvider,
    RouterView,
    Toast,
    LanguageSelector,
    ThemeToggle,
    UserMenu,
  };

  const { t } = useI18n();

  const themeStore = useThemeStore();

  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
  });
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <div class="min-h-screen" :class="{ 'dark': themeStore.isDark }">
        <nav
          class="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
          <div class="flex items-center justify-between h-full px-4">
            <router-link to="/" class="flex items-center gap-2">
              <img src="/logo-192.png" alt="Atom Video" class="h-8 w-8" />
              <span class="text-xl font-semibold">Atom Video</span>
            </router-link>
            <div class="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSelector />
              <UserMenu />
            </div>
          </div>
        </nav>
        <main class="pt-14">
          <router-view />
        </main>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
