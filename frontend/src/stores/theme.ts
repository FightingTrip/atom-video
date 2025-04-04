import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import type { GlobalTheme } from 'naive-ui';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark',
    naiveTheme: localStorage.getItem('theme') === 'dark' ? darkTheme : null,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.naiveTheme = this.isDark ? darkTheme : null;

      // 保存主题设置
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');

      // 更新 HTML 类以支持 Tailwind 暗色模式
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    initTheme() {
      // 从 localStorage 或系统偏好获取主题设置
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.naiveTheme = this.isDark ? darkTheme : null;

      // 初始化时设置 HTML 类
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      }
    },
  },
});
