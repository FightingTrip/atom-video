import { defineStore } from 'pinia';
import { darkTheme, lightTheme } from 'naive-ui';
// 浅色主题 - 简洁大气
const lightThemeOverrides = {
    common: {
        primaryColor: '#2080f0',
        primaryColorHover: '#4098fc',
        primaryColorPressed: '#1060c9',
        infoColor: '#0284C7',
        successColor: '#10B981',
        warningColor: '#F59E0B',
        errorColor: '#EF4444',
        borderRadius: '3px',
    },
    Button: {
        borderRadius: '6px',
    },
    Card: {
        borderRadius: '8px',
    },
};
// 深色主题 - 高端沉稳
const darkThemeOverrides = {
    common: {
        primaryColor: '#2080f0',
        primaryColorHover: '#4098fc',
        primaryColorPressed: '#1060c9',
        infoColor: '#38BDF8',
        successColor: '#34D399',
        warningColor: '#FBBF24',
        errorColor: '#F87171',
        borderRadius: '3px',
    },
    Button: {
        borderRadius: '6px',
    },
    Card: {
        borderRadius: '8px',
    },
};
export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: false,
    }),
    getters: {
        theme() {
            return this.isDark ? darkTheme : lightTheme;
        },
        themeOverrides() {
            return this.isDark ? darkThemeOverrides : lightThemeOverrides;
        },
    },
    actions: {
        toggleTheme() {
            this.isDark = !this.isDark;
            // 更新 body class
            if (this.isDark) {
                document.documentElement.classList.add('dark');
            }
            else {
                document.documentElement.classList.remove('dark');
            }
        },
        initTheme() {
            // 从系统主题初始化
            const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDark = darkMode;
            if (darkMode) {
                document.documentElement.classList.add('dark');
            }
        },
    },
});
//# sourceMappingURL=theme.js.map