import { defineStore } from 'pinia';
import { createI18n } from 'vue-i18n';

// 导入语言包
import zh from '@/locales/zh-CN';
import en from '@/locales/en-US';

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en,
  },
});

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    currentLocale: localStorage.getItem('language') || 'zh-CN',
  }),

  actions: {
    setLocale(locale: string) {
      this.currentLocale = locale;
      localStorage.setItem('language', locale);

      // 更新页面上的文本
      document.querySelector('html')?.setAttribute('lang', locale);

      // 如果使用了 vue-i18n，还需要更新 i18n 实例的 locale
      // i18n.global.locale.value = locale
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
