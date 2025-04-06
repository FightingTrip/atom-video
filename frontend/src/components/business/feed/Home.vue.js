/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVideo } from '@/composables/useVideo';
import VideoGrid from '@/components/common/video/VideoGrid.vue';
import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
const router = useRouter();
// 状态
const loading = ref(false);
const error = ref(null);
const recommendedVideos = ref([]);
const trendingVideos = ref([]);
const latestVideos = ref([]);
// 组合式函数
const { fetchRecommendedVideos, fetchTrendingVideos, fetchLatestVideos } = useVideo();
// 方法
const handleVideoClick = (video) => {
    router.push(`/video/${video.id}`);
};
// 初始化
onMounted(async () => {
    try {
        loading.value = true;
        error.value = null;
        // 并行加载数据
        const [recommended, trending, latest] = await Promise.all([
            fetchRecommendedVideos(),
            fetchTrendingVideos(),
            fetchLatestVideos(),
        ]);
        recommendedVideos.value = recommended;
        trendingVideos.value = trending;
        latestVideos.value = latest;
    }
    catch (err) {
        error.value = '加载数据失败';
        console.error('加载数据失败:', err);
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['home']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "home" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "recommended-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
/** @type {[typeof VideoGrid, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(VideoGrid, new VideoGrid({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.recommendedVideos),
    loading: (__VLS_ctx.loading),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.recommendedVideos),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onVideoClick: (__VLS_ctx.handleVideoClick)
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "trending-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
/** @type {[typeof VideoGrid, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(VideoGrid, new VideoGrid({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.trendingVideos),
    loading: (__VLS_ctx.loading),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.trendingVideos),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    onVideoClick: (__VLS_ctx.handleVideoClick)
};
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "latest-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
/** @type {[typeof VideoGrid, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(VideoGrid, new VideoGrid({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.latestVideos),
    loading: (__VLS_ctx.loading),
}));
const __VLS_15 = __VLS_14({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.latestVideos),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onVideoClick: (__VLS_ctx.handleVideoClick)
};
var __VLS_16;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-container" },
    });
    /** @type {[typeof LoadingSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(LoadingSpinner, new LoadingSpinner({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-container" },
    });
    /** @type {[typeof ErrorMessage, ]} */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(ErrorMessage, new ErrorMessage({
        message: (__VLS_ctx.error),
    }));
    const __VLS_25 = __VLS_24({
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
}
/** @type {__VLS_StyleScopedClasses['home']} */ ;
/** @type {__VLS_StyleScopedClasses['recommended-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['trending-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['latest-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VideoGrid: VideoGrid,
            LoadingSpinner: LoadingSpinner,
            ErrorMessage: ErrorMessage,
            loading: loading,
            error: error,
            recommendedVideos: recommendedVideos,
            trendingVideos: trendingVideos,
            latestVideos: latestVideos,
            handleVideoClick: handleVideoClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Home.vue.js.map