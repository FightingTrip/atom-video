import { createI18n } from 'vue-i18n';
import zh from '@/locales/zh';
import en from '@/locales/en';

// 获取浏览器语言设置
const getBrowserLanguage = () => {
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
};

// 获取存储的语言设置或使用浏览器语言
const getStoredLanguage = () => {
  return localStorage.getItem('locale') || getBrowserLanguage();
};

const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
});

export default i18n;
