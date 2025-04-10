/**
 * 主题状态管理
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { darkTheme } from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';

// 主题类型
type ThemeType = 'light' | 'dark' | 'system';

// 主题状态
export const useThemeStore = defineStore('theme', () => {
  // 状态
  const themeType = ref<ThemeType>((localStorage.getItem('theme') as ThemeType) || 'system');
  const systemDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 计算当前是否应该使用深色主题
  const isDark = computed(() => {
    if (themeType.value === 'system') {
      return systemDarkMode.value;
    }
    return themeType.value === 'dark';
  });

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', e => {
    systemDarkMode.value = e.matches;
  });

  // 根据主题类型计算主题覆盖配置
  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    // 默认主题覆盖配置
    return {
      common: {
        primaryColor: '#3b82f6',
        primaryColorHover: '#60a5fa',
        primaryColorPressed: '#2563eb',
      },
    };
  });

  // 设置主题类型
  function setTheme(type: ThemeType) {
    themeType.value = type;
    localStorage.setItem('theme', type);
  }

  // 切换主题
  function toggleTheme() {
    const newTheme = isDark.value ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // 初始化主题
  function initTheme() {
    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      themeType.value = savedTheme;
    }

    // 设置body的data-theme属性以支持CSS变量
    applyThemeClass();
  }

  // 应用主题类到body元素
  function applyThemeClass() {
    if (isDark.value) {
      document.body.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }

  // 监听主题变化，更新CSS变量
  watch(isDark, () => {
    applyThemeClass();
  });

  return {
    themeType,
    isDark,
    themeOverrides,
    setTheme,
    toggleTheme,
    initTheme,
  };
});
