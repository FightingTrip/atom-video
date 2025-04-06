/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const props = withDefaults(defineProps(), {
    width: '100%',
    height: '16px',
    rows: 1,
    rounded: true,
    animated: true
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    width: '100%',
    height: '16px',
    rows: 1,
    rounded: true,
    animated: true
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['skeleton-row']} */ ;
/** @type {__VLS_StyleScopedClasses['is-animated']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "skeleton" },
    ...{ class: ({ 'is-animated': __VLS_ctx.animated }) },
});
for (const [i] of __VLS_getVForSourceType((__VLS_ctx.rows))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        key: (i),
        ...{ class: "skeleton-row" },
        ...{ style: ({
                width: __VLS_ctx.width,
                height: __VLS_ctx.height,
                borderRadius: __VLS_ctx.rounded ? 'var(--border-radius)' : '0'
            }) },
    });
}
/** @type {__VLS_StyleScopedClasses['skeleton']} */ ;
/** @type {__VLS_StyleScopedClasses['is-animated']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-row']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Skeleton.vue.js.map