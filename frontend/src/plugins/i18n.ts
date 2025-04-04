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

// 获取用户设置的语言或浏览器语言
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('language');
  if (savedLang && ['en-US', 'zh-CN'].includes(savedLang)) {
    return savedLang;
  }
  return getBrowserLanguage();
};

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
});

// 提供切换语言的函数
export const setLanguage = (lang: 'en-US' | 'zh-CN') => {
  i18n.global.locale.value = lang;
  localStorage.setItem('language', lang);
  document.querySelector('html')?.setAttribute('lang', lang);
};
