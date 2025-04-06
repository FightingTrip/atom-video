/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
// 导入路由视图
import { RouterView, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
// 导入布局组件
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
// 导入功能组件
import Toast from '@/components/common/Toast.vue';
import LanguageSelector from '@/components/business/user/LanguageSelector.vue';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import UserMenu from '@/components/business/user/UserMenu.vue';
import SearchBar from '@/components/common/search/SearchBar.vue';
import TheHeader from '@/layouts/TheHeader.vue';
import TheSidebar from '@/layouts/TheSidebar.vue';
import TheFooter from '@/layouts/TheFooter.vue';
import TagList from '@/components/business/tag/TagList.vue';
// 导入状态管理
import { useThemeStore } from '@/stores/theme';
import { useI18nStore } from '@/stores/i18n';
import { useVideoStore } from '@/stores/video';
import { useUserStore } from '@/stores/user';
// 导入工具函数
import { computed, ref, onMounted, markRaw } from 'vue';
import { darkTheme, lightTheme } from 'naive-ui';
// 声明使用的组件
const components = {
    RouterView,
    Toast,
    LanguageSelector,
    ThemeToggle,
    UserMenu,
    SearchBar,
    TheHeader,
    TheSidebar,
    TheFooter,
    TagList
};
// 状态管理
const { t, locale } = useI18n();
const route = useRoute();
const themeStore = useThemeStore();
const i18nStore = useI18nStore();
const videoStore = useVideoStore();
const userStore = useUserStore();
// 计算属性
const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
});
const sidebarCollapsed = ref(false);
const selectedTag = ref('all');
const currentLanguageLabel = computed(() => i18nStore.currentLocale === 'zh-CN' ? '简体中文' : 'English');
// 语言选项
const languageOptions = [
    {
        label: '简体中文',
        key: 'zh-CN',
    },
    {
        label: 'English',
        key: 'en-US',
    }
];
// 标签数据
const tags = [
    { id: 'all', name: 'all' },
    { id: 'javascript', name: 'javascript' },
    { id: 'typescript', name: 'typescript' },
    { id: 'vue', name: 'vue' },
    { id: 'react', name: 'react' },
    { id: 'nodejs', name: 'nodejs' },
    { id: 'python', name: 'python' },
];
// 方法
const handleLanguageChange = (key) => {
    i18nStore.setLocale(key);
};
const toggleTheme = () => {
    themeStore.toggleTheme();
};
const selectTag = (tagId) => {
    selectedTag.value = tagId;
    videoStore.setCategory(tagId);
};
// 根据路由元数据选择布局
const layout = computed(() => {
    const layoutName = route.meta.layout || 'default';
    return markRaw(layoutName === 'blank' ? BlankLayout : DefaultLayout);
});
// 生命周期钩子
onMounted(() => {
    i18nStore.initLocale();
    themeStore.initTheme();
    userStore.initUser();
    // 设置初始语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        i18nStore.setLocale(savedLanguage);
        locale.value = savedLanguage;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
__VLS_ctx.themeStore.isDark ? "var(--primary-color)" : "var(--text-color)";
// CSS variable injection end 
const __VLS_0 = {}.NConfigProvider;
/** @type {[typeof __VLS_components.NConfigProvider, typeof __VLS_components.nConfigProvider, typeof __VLS_components.NConfigProvider, typeof __VLS_components.nConfigProvider, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    theme: (__VLS_ctx.themeStore.theme),
    themeOverrides: (__VLS_ctx.themeStore.themeOverrides),
}));
const __VLS_2 = __VLS_1({
    theme: (__VLS_ctx.themeStore.theme),
    themeOverrides: (__VLS_ctx.themeStore.themeOverrides),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.NMessageProvider;
/** @type {[typeof __VLS_components.NMessageProvider, typeof __VLS_components.nMessageProvider, typeof __VLS_components.NMessageProvider, typeof __VLS_components.nMessageProvider, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
{
    const { default: __VLS_thisSlot } = __VLS_12.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_13 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        name: "fade",
        mode: "out-in",
    }));
    const __VLS_15 = __VLS_14({
        name: "fade",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    const __VLS_17 = ((Component));
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    var __VLS_16;
    __VLS_12.slots['' /* empty slot name completion */];
}
var __VLS_12;
var __VLS_8;
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterView: RouterView,
            themeStore: themeStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map