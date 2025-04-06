/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
const props = withDefaults(defineProps(), {
    type: 'text',
    id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    disabled: false,
    required: false,
    autocomplete: 'off'
});
const emit = defineEmits();
// 更新值
const updateValue = (event) => {
    const target = event.target;
    emit('update:modelValue', target.value);
};
// 失焦事件
const onBlur = (event) => {
    emit('blur', event);
};
// 聚焦事件
const onFocus = (event) => {
    emit('focus', event);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    type: 'text',
    id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    disabled: false,
    required: false,
    autocomplete: 'off'
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['base-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input--error']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__field']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__field']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "base-input" },
    ...{ class: ({ 'base-input--error': __VLS_ctx.error }) },
});
if (__VLS_ctx.label) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "base-input__label" },
        for: (__VLS_ctx.id),
    });
    (__VLS_ctx.label);
    if (__VLS_ctx.required) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "base-input__required" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "base-input__wrapper" },
});
var __VLS_0 = {};
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.updateValue) },
    ...{ onBlur: (__VLS_ctx.onBlur) },
    ...{ onFocus: (__VLS_ctx.onFocus) },
    id: (__VLS_ctx.id),
    ...{ class: "base-input__field" },
    type: (__VLS_ctx.type),
    value: (__VLS_ctx.modelValue),
    placeholder: (__VLS_ctx.placeholder),
    disabled: (__VLS_ctx.disabled),
    required: (__VLS_ctx.required),
    autocomplete: (__VLS_ctx.autocomplete),
});
var __VLS_2 = {};
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-input__error" },
    });
    (__VLS_ctx.error);
}
else if (__VLS_ctx.hint) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-input__hint" },
    });
    (__VLS_ctx.hint);
}
/** @type {__VLS_StyleScopedClasses['base-input']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input--error']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__label']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__required']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__field']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__error']} */ ;
/** @type {__VLS_StyleScopedClasses['base-input__hint']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            updateValue: updateValue,
            onBlur: onBlur,
            onFocus: onFocus,
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
//# sourceMappingURL=BaseInput.vue.js.map