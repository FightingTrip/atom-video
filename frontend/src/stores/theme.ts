import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { ThemeMode } from '@/types';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: useStorage<ThemeMode>('theme', 'system'),
  }),

  getters: {
    isDark(): boolean {
      if (this.mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return this.mode === 'dark';
    },
  },

  actions: {
    setMode(mode: ThemeMode) {
      this.mode = mode;
    },

    toggleTheme() {
      if (this.mode === 'light') {
        this.mode = 'dark';
      } else if (this.mode === 'dark') {
        this.mode = 'light';
      } else {
        this.mode = this.isDark ? 'light' : 'dark';
      }
    },
  },
});
