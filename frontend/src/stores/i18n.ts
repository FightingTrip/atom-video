import { defineStore } from 'pinia';
import { i18n } from '@/plugins/i18n';

// 导入语言包
import zh from '@/locales/zh-CN';
import en from '@/locales/en-US';

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    currentLocale: localStorage.getItem('language') || 'zh-CN',
  }),

  getters: {
    locale: state => state.currentLocale,
  },

  actions: {
    setLocale(locale: string) {
      console.log('Setting locale to:', locale); // 调试日志
      this.currentLocale = locale;
      i18n.global.locale.value = locale;
      localStorage.setItem('language', locale);

      // 更新页面上的文本
      document.querySelector('html')?.setAttribute('lang', locale);
    },

    initLocale() {
      const savedLocale = localStorage.getItem('language');
      if (savedLocale) {
        this.setLocale(savedLocale);
      }
    },
  },

  getters: {
    isZhCN(): boolean {
      return this.currentLocale === 'zh-CN';
    },
  },
});
