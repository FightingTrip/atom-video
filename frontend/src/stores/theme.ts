import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { darkTheme } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui';

export const useThemeStore = defineStore('theme', () => {
  // 初始化时从 localStorage 获取主题设置
  const isDark = ref(localStorage.getItem('theme') === 'dark');
  const theme = ref<GlobalTheme | null>(isDark.value ? darkTheme : null);

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    theme.value = isDark.value ? darkTheme : null;
    // 保存到 localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    // 更新 HTML 的 class
    updateHtmlClass();
  };

  // 更新 HTML 的 class
  const updateHtmlClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 监听主题变化
  watch(
    isDark,
    () => {
      updateHtmlClass();
    },
    { immediate: true }
  );

  return {
    isDark,
    theme,
    toggleTheme,
  };
});
