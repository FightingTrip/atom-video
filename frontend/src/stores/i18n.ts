import { defineStore } from 'pinia';
import i18n from '@/plugins/i18n';

// 导入语言包
import zh from '@/locales/zh-CN';
import en from '@/locales/en-US';

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: localStorage.getItem('locale') || 'zh-CN',
  }),

  getters: {
    currentLocale(): string {
      return this.locale;
    },
    isZhCN(): boolean {
      return this.locale === 'zh-CN';
    },
  },

  actions: {
    setLocale(locale: string) {
      this.locale = locale;
      localStorage.setItem('locale', locale);
      i18n.global.locale.value = locale;

      // 更新页面上的文本
      document.querySelector('html')?.setAttribute('lang', locale);
    },

    initLocale() {
      this.setLocale(this.locale);
    },
  },
});
