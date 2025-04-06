/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { NIcon, NButton } from 'naive-ui';
import { CheckmarkCircle as SuccessIcon, Warning as WarningIcon, AlertCircle as ErrorIcon, InformationCircle as InfoIcon, Close as CloseIcon } from '@vicons/ionicons5';
const props = withDefaults(defineProps(), {
    position: 'top-right'
});
const toasts = ref([]);
let toastId = 0;
const getIcon = (type) => {
    switch (type) {
        case 'success':
            return SuccessIcon;
        case 'warning':
            return WarningIcon;
        case 'error':
            return ErrorIcon;
        case 'info':
            return InfoIcon;
        default:
            return InfoIcon;
    }
};
const addToast = (toast) => {
    const id = ++toastId;
    toasts.value.push({ ...toast, id });
    if (toast.duration !== 0) {
        setTimeout(() => {
            removeToast(id);
        }, toast.duration || 3000);
    }
};
const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
        toasts.value.splice(index, 1);
    }
};
// 导出方法供外部使用
const __VLS_exposed = {
    addToast
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    position: 'top-right'
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-close']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.TransitionGroup, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: (__VLS_ctx.position),
    tag: "div",
    ...{ class: "toast-container" },
    ...{ class: (__VLS_ctx.position) },
}));
const __VLS_6 = __VLS_5({
    name: (__VLS_ctx.position),
    tag: "div",
    ...{ class: "toast-container" },
    ...{ class: (__VLS_ctx.position) },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
var __VLS_8 = {};
__VLS_7.slots.default;
for (const [toast] of __VLS_getVForSourceType((__VLS_ctx.toasts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (toast.id),
        ...{ class: "toast" },
        ...{ class: (toast.type) },
    });
    const __VLS_9 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        size: "20",
        ...{ class: "toast-icon" },
    }));
    const __VLS_11 = __VLS_10({
        size: "20",
        ...{ class: "toast-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    const __VLS_13 = ((__VLS_ctx.getIcon(toast.type)));
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    var __VLS_12;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "toast-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "toast-title" },
    });
    (toast.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "toast-message" },
    });
    (toast.message);
    const __VLS_17 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        quaternary: true,
        circle: true,
        size: "small",
        ...{ class: "toast-close" },
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        quaternary: true,
        circle: true,
        size: "small",
        ...{ class: "toast-close" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeToast(toast.id);
        }
    };
    __VLS_20.slots.default;
    {
        const { icon: __VLS_thisSlot } = __VLS_20.slots;
        const __VLS_25 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
        const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
        __VLS_28.slots.default;
        const __VLS_29 = {}.CloseIcon;
        /** @type {[typeof __VLS_components.CloseIcon, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
        const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
        var __VLS_28;
    }
    var __VLS_20;
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['toast-container']} */ ;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-content']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-title']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-message']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-close']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NIcon: NIcon,
            NButton: NButton,
            CloseIcon: CloseIcon,
            toasts: toasts,
            getIcon: getIcon,
            removeToast: removeToast,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Toast.vue.js.map