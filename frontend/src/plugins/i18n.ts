import { createI18n } from 'vue-i18n';
import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';

export type Language = 'zh-CN' | 'en-US';

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

export function setLanguage(lang: Language) {
  i18n.global.locale.value = lang;
  document.querySelector('html')?.setAttribute('lang', lang);
  localStorage.setItem('language', lang);
}

// 初始化语言设置
const savedLanguage = localStorage.getItem('language') as Language;
if (savedLanguage && ['zh-CN', 'en-US'].includes(savedLanguage)) {
  setLanguage(savedLanguage);
} else {
  setLanguage('zh-CN');
}

export default i18n;
