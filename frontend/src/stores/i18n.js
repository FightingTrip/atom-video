import { defineStore } from 'pinia';
import i18n from '@/plugins/i18n';
export const useI18nStore = defineStore('i18n', {
    state: () => ({
        locale: localStorage.getItem('locale') || 'zh-CN',
    }),
    getters: {
        currentLocale() {
            return this.locale;
        },
        isZhCN() {
            return this.locale === 'zh-CN';
        },
    },
    actions: {
        setLocale(locale) {
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
//# sourceMappingURL=i18n.js.map