/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, watch } from 'vue';
import TheSidebar from '@/layouts/components/TheSidebar.vue';
import TheHeader from '@/layouts/components/TheHeader.vue';
import TheFooter from '@/layouts/components/TheFooter.vue';
// 布局状态持久化
const LAYOUT_STORAGE_KEY = 'atom-video-layout-state';
// 侧边栏折叠状态
const sidebarCollapsed = ref(false);
// 从本地存储加载布局状态
const loadLayoutState = () => {
    const savedState = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            sidebarCollapsed.value = state.sidebarCollapsed;
        }
        catch (error) {
            console.error('Failed to load layout state:', error);
        }
    }
};
// 保存布局状态到本地存储
const saveLayoutState = () => {
    const state = {
        sidebarCollapsed: sidebarCollapsed.value
    };
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(state));
};
// 监听侧边栏状态变化
watch(sidebarCollapsed, () => {
    saveLayoutState();
});
// 组件挂载时加载布局状态
onMounted(() => {
    loadLayoutState();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex h-screen bg-gray-100 dark:bg-gray-900" },
});
/** @type {[typeof TheSidebar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(TheSidebar, new TheSidebar({
    collapsed: (__VLS_ctx.sidebarCollapsed),
}));
const __VLS_1 = __VLS_0({
    collapsed: (__VLS_ctx.sidebarCollapsed),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 flex flex-col overflow-hidden" },
});
/** @type {[typeof TheHeader, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(TheHeader, new TheHeader({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "flex-1 overflow-auto p-4" },
});
const __VLS_6 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
{
    const { default: __VLS_thisSlot } = __VLS_9.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_10 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        name: "fade",
        mode: "out-in",
    }));
    const __VLS_12 = __VLS_11({
        name: "fade",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_13.slots.default;
    const __VLS_14 = ((Component));
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
    var __VLS_13;
    __VLS_9.slots['' /* empty slot name completion */];
}
var __VLS_9;
/** @type {[typeof TheFooter, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(TheFooter, new TheFooter({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TheSidebar: TheSidebar,
            TheHeader: TheHeader,
            TheFooter: TheFooter,
            sidebarCollapsed: sidebarCollapsed,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DefaultLayout.vue.js.map