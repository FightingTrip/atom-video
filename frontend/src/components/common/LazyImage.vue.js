/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import { NIcon, NSpin } from 'naive-ui';
import { Image as ImageIcon } from '@vicons/ionicons5';
const props = defineProps();
const loading = ref(true);
const error = ref(false);
const handleLoad = () => {
    loading.value = false;
    error.value = false;
};
const handleError = () => {
    loading.value = false;
    error.value = true;
};
// 使用 Intersection Observer 实现懒加载
let observer = null;
onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = props.src;
                observer?.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
});
onUnmounted(() => {
    observer?.disconnect();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['image']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lazy-image" },
    ...{ style: ({ width: __VLS_ctx.width, height: __VLS_ctx.height }) },
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
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-state" },
    });
    const __VLS_4 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        size: "24",
    }));
    const __VLS_6 = __VLS_5({
        size: "24",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ImageIcon;
    /** @type {[typeof __VLS_components.ImageIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_7;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        ...{ onLoad: (__VLS_ctx.handleLoad) },
        ...{ onError: (__VLS_ctx.handleError) },
        src: (__VLS_ctx.src),
        alt: (__VLS_ctx.alt),
        width: (__VLS_ctx.width),
        height: (__VLS_ctx.height),
        ...{ class: "image" },
    });
}
/** @type {__VLS_StyleScopedClasses['lazy-image']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['image']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NIcon: NIcon,
            NSpin: NSpin,
            ImageIcon: ImageIcon,
            loading: loading,
            error: error,
            handleLoad: handleLoad,
            handleError: handleError,
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
//# sourceMappingURL=LazyImage.vue.js.map