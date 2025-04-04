import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';

// 浅色主题 - 简洁大气
const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0F172A',
    primaryColorHover: '#1E293B',
    primaryColorPressed: '#0F172A',
    infoColor: '#0284C7',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
  },
  Button: {
    borderRadius: '6px',
  },
  Card: {
    borderRadius: '8px',
  },
};

// 深色主题 - 高端沉稳
const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#3B82F6',
    primaryColorHover: '#60A5FA',
    primaryColorPressed: '#2563EB',
    infoColor: '#38BDF8',
    successColor: '#34D399',
    warningColor: '#FBBF24',
    errorColor: '#F87171',
  },
  Button: {
    borderRadius: '6px',
  },
  Card: {
    borderRadius: '8px',
  },
};

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('isDark') === 'true',
  }),

  getters: {
    naiveTheme() {
      return this.isDark ? darkTheme : null;
    },
    themeOverrides(): GlobalThemeOverrides {
      return this.isDark ? darkThemeOverrides : lightThemeOverrides;
    },
  },

  actions: {
    toggleTheme() {
      // 添加过渡动画类
      document.documentElement.classList.add('theme-transitioning');

      // 切换深色/浅色主题
      this.isDark = !this.isDark;
      localStorage.setItem('isDark', this.isDark.toString());

      // 应用主题
      this.applyTheme();

      // 在动画完成后移除过渡类
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    },

    initTheme() {
      // 从本地存储中获取主题设置
      const savedDarkMode = localStorage.getItem('isDark');

      if (savedDarkMode !== null) {
        this.isDark = savedDarkMode === 'true';
      } else {
        // 默认匹配系统主题
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      this.applyTheme();
    },

    applyTheme() {
      // 应用主题到文档根元素
      document.documentElement.classList.toggle('dark', this.isDark);
    },
  },
});
