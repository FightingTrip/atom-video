/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    variant: 'default',
    padded: true
});
// 计算卡片类名
const cardClasses = computed(() => [
    `base-card--${props.variant}`,
    { 'base-card--padded': props.padded }
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    variant: 'default',
    padded: true
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "base-card" },
    ...{ class: (__VLS_ctx.cardClasses) },
});
if (__VLS_ctx.$slots.header || __VLS_ctx.title) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-card__header" },
    });
    var __VLS_0 = {};
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "base-card__title" },
    });
    (__VLS_ctx.title);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "base-card__content" },
});
var __VLS_2 = {};
if (__VLS_ctx.$slots.footer) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-card__footer" },
    });
    var __VLS_4 = {};
}
/** @type {__VLS_StyleScopedClasses['base-card']} */ ;
/** @type {__VLS_StyleScopedClasses['base-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['base-card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['base-card__content']} */ ;
/** @type {__VLS_StyleScopedClasses['base-card__footer']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2, __VLS_5 = __VLS_4;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cardClasses: cardClasses,
        };
    },
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BaseCard.vue.js.map