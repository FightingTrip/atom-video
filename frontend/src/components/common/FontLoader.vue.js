/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { NIcon, NSpin, NProgress, NButton } from 'naive-ui';
import { Warning as WarningIcon, Checkmark as CheckmarkIcon } from '@vicons/ionicons5';
const props = defineProps();
const loading = ref(true);
const error = ref(null);
const progress = ref(0);
const loadFont = async () => {
    try {
        loading.value = true;
        error.value = null;
        progress.value = 0;
        // 创建字体加载对象
        const font = new FontFace(props.fontFamily, `url(${props.fontUrl})`);
        // 监听加载进度
        const xhr = new XMLHttpRequest();
        xhr.open('GET', props.fontUrl);
        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                progress.value = Math.round((event.loaded / event.total) * 100);
            }
        };
        // 加载字体
        await font.load();
        document.fonts.add(font);
        loading.value = false;
    }
    catch (err) {
        error.value = '字体加载失败';
        console.error('Font loading error:', err);
        loading.value = false;
    }
};
const retry = () => {
    loadFont();
};
onMounted(() => {
    loadFont();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['success-state']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-loader" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
    const __VLS_0 = {}.NSpin;
    /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        size: "small",
    }));
    const __VLS_2 = __VLS_1({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "loading-text" },
    });
    const __VLS_4 = {}.NProgress;
    /** @type {[typeof __VLS_components.NProgress, typeof __VLS_components.nProgress, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        type: "line",
        percentage: (__VLS_ctx.progress),
        processing: (true),
        indicatorPlacement: ('inside'),
    }));
    const __VLS_6 = __VLS_5({
        type: "line",
        percentage: (__VLS_ctx.progress),
        processing: (true),
        indicatorPlacement: ('inside'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-state" },
    });
    const __VLS_8 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        size: "24",
    }));
    const __VLS_10 = __VLS_9({
        size: "24",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = {}.WarningIcon;
    /** @type {[typeof __VLS_components.WarningIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-text" },
    });
    (__VLS_ctx.error);
    const __VLS_16 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.retry)
    };
    __VLS_19.slots.default;
    var __VLS_19;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "success-state" },
    });
    const __VLS_24 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        size: "24",
    }));
    const __VLS_26 = __VLS_25({
        size: "24",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.CheckmarkIcon;
    /** @type {[typeof __VLS_components.CheckmarkIcon, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "success-text" },
    });
}
/** @type {__VLS_StyleScopedClasses['font-loader']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['error-text']} */ ;
/** @type {__VLS_StyleScopedClasses['success-state']} */ ;
/** @type {__VLS_StyleScopedClasses['success-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NIcon: NIcon,
            NSpin: NSpin,
            NProgress: NProgress,
            NButton: NButton,
            WarningIcon: WarningIcon,
            CheckmarkIcon: CheckmarkIcon,
            loading: loading,
            error: error,
            progress: progress,
            retry: retry,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FontLoader.vue.js.map