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
    theme: localStorage.getItem('theme') || 'system',
  }),

  getters: {
    naiveTheme() {
      return this.theme === 'dark' ? darkTheme : null;
    },
    themeOverrides(): GlobalThemeOverrides {
      return this.theme === 'dark' ? darkThemeOverrides : lightThemeOverrides;
    },
  },

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
      localStorage.setItem('theme', theme);

      // 应用主题
      if (
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    initTheme() {
      this.setTheme(this.theme);

      // 监听系统主题变化
      if (this.theme === 'system') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          if (this.theme === 'system') {
            if (e.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        });
      }
    },
  },
});
