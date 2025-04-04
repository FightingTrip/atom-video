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
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'
  import { computed } from 'vue';
  import { useThemeStore } from '@/stores/theme';
  import { darkTheme, lightTheme } from 'naive-ui';

  const { t } = useI18n();

  const themeStore = useThemeStore();

  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
  });
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <router-view />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
