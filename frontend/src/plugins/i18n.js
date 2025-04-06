import { createI18n } from 'vue-i18n';
import zhCN from '@/locales/zh-CN';
import enUS from '@/locales/en-US';
// 检测浏览器语言
function getLanguage() {
    // 先从本地存储获取
    const cachedLanguage = localStorage.getItem('language');
    if (cachedLanguage)
        return cachedLanguage;
    // 否则检测浏览器语言
    const language = navigator.language;
    if (language.includes('zh')) {
        return 'zh-CN';
    }
    return 'en-US';
}
const messages = {
    'zh-CN': zhCN,
    'en-US': enUS,
};
const i18n = createI18n({
    legacy: false,
    locale: getLanguage(),
    fallbackLocale: 'zh-CN',
    messages,
});
export default i18n;
//# sourceMappingURL=i18n.js.map