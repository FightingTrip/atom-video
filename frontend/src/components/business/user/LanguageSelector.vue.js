/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale, t } = useI18n();
const options = computed(() => [
    {
        label: '简体中文',
        key: 'zh-CN',
        disabled: locale.value === 'zh-CN'
    },
    {
        label: 'English',
        key: 'en-US',
        disabled: locale.value === 'en-US'
    }
]);
const handleSelect = (key) => {
    locale.value = key;
    localStorage.setItem('language', key);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['selector-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['language-option']} */ ;
/** @type {__VLS_StyleScopedClasses['language-option']} */ ;
/** @type {__VLS_StyleScopedClasses['language-option']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.NDropdown;
/** @type {[typeof __VLS_components.NDropdown, typeof __VLS_components.nDropdown, typeof __VLS_components.NDropdown, typeof __VLS_components.nDropdown, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onSelect': {} },
    trigger: "click",
    options: (__VLS_ctx.options),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSelect': {} },
    trigger: "click",
    options: (__VLS_ctx.options),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onSelect: (__VLS_ctx.handleSelect)
};
var __VLS_8 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "fas fa-globe text-xl" },
});
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-globe']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            options: options,
            handleSelect: handleSelect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=LanguageSelector.vue.js.map