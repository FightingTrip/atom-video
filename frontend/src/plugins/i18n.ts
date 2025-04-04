import { createI18n } from 'vue-i18n';
import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';

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

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
});

export default i18n;
