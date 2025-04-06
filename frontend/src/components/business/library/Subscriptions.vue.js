/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import VideoCard from '@/components/business/video/VideoCard.vue';
import api from '@/utils/api';
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const videos = ref([]);
onMounted(async () => {
    if (isAuthenticated.value) {
        try {
            const response = await api.get('/videos/subscriptions');
            videos.value = response.data;
        }
        catch (error) {
            console.error('Failed to fetch subscription videos:', error);
        }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
/** @type {__VLS_StyleScopedClasses['subscriptions-container']} */ ;
/** @type {__VLS_StyleScopedClasses['subscriptions-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "subscriptions-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
(__VLS_ctx.$t('nav.subscriptions'));
if (!__VLS_ctx.isAuthenticated) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "login-prompt" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "prompt-text" },
    });
    (__VLS_ctx.$t('auth.loginRequired'));
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/auth/login",
        ...{ class: "login-button" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/auth/login",
        ...{ class: "login-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (__VLS_ctx.$t('user.login'));
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "subscriptions-grid" },
    });
    for (const [video] of __VLS_getVForSourceType((__VLS_ctx.videos))) {
        /** @type {[typeof VideoCard, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(VideoCard, new VideoCard({
            key: (video.id),
            video: (video),
        }));
        const __VLS_5 = __VLS_4({
            key: (video.id),
            video: (video),
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    }
}
/** @type {__VLS_StyleScopedClasses['subscriptions-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['prompt-text']} */ ;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
/** @type {__VLS_StyleScopedClasses['subscriptions-grid']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VideoCard: VideoCard,
            isAuthenticated: isAuthenticated,
            videos: videos,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Subscriptions.vue.js.map