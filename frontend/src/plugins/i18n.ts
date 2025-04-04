import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

// 获取浏览器语言设置
const getBrowserLanguage = () => {
  const lang = navigator.language;
  if (lang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en-US';
};

// 获取存储的语言设置或使用浏览器语言
const getLanguage = () => {
  return localStorage.getItem('language') || getBrowserLanguage();
};

export default createI18n({
  legacy: false, // 使用 Composition API
  locale: getLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'en-US': en,
    'zh-CN': zh,
  },
});
