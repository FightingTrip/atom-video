/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVideo } from '@/composables/useVideo';
import VideoCard from '@/components/common/video/VideoCard.vue';
import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
import EmptyState from '@/components/common/feedback/EmptyState.vue';
const router = useRouter();
const { videos, loading, error, fetchVideos, } = useVideo();
// 处理视频点击
const handleVideoClick = (video) => {
    router.push(`/video/${video.id}`);
};
// 初始化加载视频列表
onMounted(async () => {
    await fetchVideos({
        page: 1,
        pageSize: 12,
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-container']} */ ;
/** @type {__VLS_StyleScopedClasses['video-list']} */ ;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-grid" },
});
for (const [video] of __VLS_getVForSourceType((__VLS_ctx.videos))) {
    /** @type {[typeof VideoCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(VideoCard, new VideoCard({
        ...{ 'onClick': {} },
        key: (video.id),
        video: (video),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClick': {} },
        key: (video.id),
        video: (video),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleVideoClick(video);
        }
    };
    var __VLS_2;
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-container" },
    });
    /** @type {[typeof LoadingSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(LoadingSpinner, new LoadingSpinner({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-container" },
    });
    /** @type {[typeof ErrorMessage, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(ErrorMessage, new ErrorMessage({
        message: (__VLS_ctx.error),
    }));
    const __VLS_11 = __VLS_10({
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
if (!__VLS_ctx.loading && !__VLS_ctx.error && __VLS_ctx.videos.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-container" },
    });
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        message: "暂无视频",
    }));
    const __VLS_14 = __VLS_13({
        message: "暂无视频",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
/** @type {__VLS_StyleScopedClasses['video-list']} */ ;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VideoCard: VideoCard,
            LoadingSpinner: LoadingSpinner,
            ErrorMessage: ErrorMessage,
            EmptyState: EmptyState,
            videos: videos,
            loading: loading,
            error: error,
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
//# sourceMappingURL=VideoList.vue.js.map