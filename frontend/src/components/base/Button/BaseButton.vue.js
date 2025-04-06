/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    type: 'primary',
    size: 'medium',
    disabled: false,
    loading: false
});
const emit = defineEmits();
// 计算按钮类名
const buttonClasses = computed(() => [
    'base-button',
    `base-button--${props.type}`,
    `base-button--${props.size}`,
    {
        'base-button--disabled': props.disabled,
        'base-button--loading': props.loading
    }
]);
// 点击事件处理
const handleClick = (event) => {
    if (!props.disabled && !props.loading) {
        emit('click', event);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    type: 'primary',
    size: 'medium',
    disabled: false,
    loading: false
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['base-button--primary']} */ ;
/** @type {__VLS_StyleScopedClasses['base-button--disabled']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleClick) },
    ...{ class: (__VLS_ctx.buttonClasses) },
    disabled: (__VLS_ctx.disabled),
});
var __VLS_0 = {};
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.label);
}
var __VLS_2 = {};
var __VLS_4 = {};
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2, __VLS_5 = __VLS_4;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            buttonClasses: buttonClasses,
            handleClick: handleClick,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BaseButton.vue.js.map