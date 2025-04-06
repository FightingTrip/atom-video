/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NButton, NEmpty, NAlert, NSpin, NVirtualList, NIcon } from 'naive-ui';
import { Close } from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/auth';
import { useVideoStore } from '@/stores/video';
import { useBreakpoint } from '@/composables/useBreakpoint';
import VideoCard from '@/components/business/video/VideoCard.vue';
import { formatDate } from '@/utils/format';
import { useHistoryStore } from '@/stores/history';
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const videoStore = useVideoStore();
const historyStore = useHistoryStore();
const { breakpoint } = useBreakpoint();
// 状态
const videos = ref([]);
const loading = ref(false);
const error = ref(null);
// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated);
// 按日期分组的视频
const groupedVideos = computed(() => {
    const groups = {};
    videos.value.forEach(video => {
        const date = formatDate(video.watchedAt || video.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(video);
    });
    return groups;
});
// 响应式网格列数
const gridCols = computed(() => {
    switch (breakpoint.value) {
        case 'xs': return 1;
        case 'sm': return 2;
        case 'md': return 3;
        case 'lg': return 4;
        default: return 4;
    }
});
// 获取历史记录
const fetchHistory = async () => {
    if (loading.value || !isAuthenticated.value)
        return;
    try {
        loading.value = true;
        error.value = null;
        await historyStore.getWatchHistory();
    }
    catch (err) {
        error.value = err instanceof Error ? err.message : t('errors.fetchFailed');
        console.error('获取历史记录失败:', err);
    }
    finally {
        loading.value = false;
    }
};
// 清除历史记录
const handleClearHistory = async () => {
    try {
        await historyStore.clearWatchHistory();
        videos.value = [];
    }
    catch (err) {
        error.value = err instanceof Error ? err.message : t('errors.clearFailed');
        console.error('清除历史记录失败:', err);
    }
};
// 从历史记录中移除视频
const handleRemoveFromHistory = async (videoId) => {
    try {
        await historyStore.removeFromWatchHistory(videoId);
        videos.value = videos.value.filter(v => v.id !== videoId);
    }
    catch (err) {
        error.value = err instanceof Error ? err.message : t('errors.removeFailed');
        console.error('移除视频失败:', err);
    }
};
// 处理点赞
const handleLike = (videoId) => {
    const video = videos.value.find(v => v.id === videoId);
    if (video) {
        video.isLiked = !video.isLiked;
        video.likes += video.isLiked ? 1 : -1;
    }
};
// 处理错误
const handleError = (err) => {
    error.value = err.message;
};
// 生命周期钩子
onMounted(() => {
    if (isAuthenticated.value) {
        fetchHistory();
    }
});
onUnmounted(() => {
    // 清理工作
    videos.value = [];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-card-hover']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "history-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 py-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold" },
});
(__VLS_ctx.t('nav.history'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600 dark:text-gray-400 mt-2" },
});
(__VLS_ctx.t('history.description'));
if (__VLS_ctx.videos.length > 0) {
    const __VLS_0 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        type: "error",
        ghost: true,
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        type: "error",
        ghost: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (__VLS_ctx.handleClearHistory)
    };
    __VLS_3.slots.default;
    (__VLS_ctx.t('history.clearAll'));
    var __VLS_3;
}
if (!__VLS_ctx.isAuthenticated) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col items-center justify-center py-16" },
    });
    const __VLS_8 = {}.NEmpty;
    /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        description: (__VLS_ctx.t('auth.loginRequired')),
    }));
    const __VLS_10 = __VLS_9({
        description: (__VLS_ctx.t('auth.loginRequired')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    {
        const { extra: __VLS_thisSlot } = __VLS_11.slots;
        const __VLS_12 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_16;
        let __VLS_17;
        let __VLS_18;
        const __VLS_19 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isAuthenticated))
                    return;
                __VLS_ctx.router.push('/auth/login');
            }
        };
        __VLS_15.slots.default;
        (__VLS_ctx.t('user.login'));
        var __VLS_15;
    }
    var __VLS_11;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
        ...{ class: "max-w-screen-2xl mx-auto" },
    });
    if (__VLS_ctx.error) {
        const __VLS_20 = {}.NAlert;
        /** @type {[typeof __VLS_components.NAlert, typeof __VLS_components.nAlert, typeof __VLS_components.NAlert, typeof __VLS_components.nAlert, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            ...{ 'onClose': {} },
            type: "error",
            ...{ class: "mx-4 my-4" },
            closable: true,
        }));
        const __VLS_22 = __VLS_21({
            ...{ 'onClose': {} },
            type: "error",
            ...{ class: "mx-4 my-4" },
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        let __VLS_24;
        let __VLS_25;
        let __VLS_26;
        const __VLS_27 = {
            onClose: (...[$event]) => {
                if (!!(!__VLS_ctx.isAuthenticated))
                    return;
                if (!(__VLS_ctx.error))
                    return;
                __VLS_ctx.error = null;
            }
        };
        __VLS_23.slots.default;
        (__VLS_ctx.error);
        var __VLS_23;
    }
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex justify-center items-center py-8" },
        });
        const __VLS_28 = {}.NSpin;
        /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            size: "large",
        }));
        const __VLS_30 = __VLS_29({
            size: "large",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    }
    else {
        if (__VLS_ctx.videos.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex flex-col items-center justify-center py-16" },
            });
            const __VLS_32 = {}.NEmpty;
            /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                description: (__VLS_ctx.t('history.noHistory')),
            }));
            const __VLS_34 = __VLS_33({
                description: (__VLS_ctx.t('history.noHistory')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            __VLS_35.slots.default;
            {
                const { extra: __VLS_thisSlot } = __VLS_35.slots;
                const __VLS_36 = {}.NButton;
                /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
                // @ts-ignore
                const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
                    ...{ 'onClick': {} },
                }));
                const __VLS_38 = __VLS_37({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                let __VLS_40;
                let __VLS_41;
                let __VLS_42;
                const __VLS_43 = {
                    onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.isAuthenticated))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.videos.length === 0))
                            return;
                        __VLS_ctx.router.push('/explore');
                    }
                };
                __VLS_39.slots.default;
                (__VLS_ctx.t('history.exploreVideos'));
                var __VLS_39;
            }
            var __VLS_35;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "px-4" },
            });
            for (const [group, date] of __VLS_getVForSourceType((__VLS_ctx.groupedVideos))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (date),
                    ...{ class: "mb-8" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
                    ...{ class: "text-lg font-semibold mb-4" },
                });
                (date);
                const __VLS_44 = {}.NVirtualList;
                /** @type {[typeof __VLS_components.NVirtualList, typeof __VLS_components.nVirtualList, typeof __VLS_components.NVirtualList, typeof __VLS_components.nVirtualList, ]} */ ;
                // @ts-ignore
                const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
                    items: (group),
                    itemSize: (300),
                    containerStyle: ({ height: 'auto' }),
                    grid: ({ cols: __VLS_ctx.gridCols, itemSize: 300 }),
                }));
                const __VLS_46 = __VLS_45({
                    items: (group),
                    itemSize: (300),
                    containerStyle: ({ height: 'auto' }),
                    grid: ({ cols: __VLS_ctx.gridCols, itemSize: 300 }),
                }, ...__VLS_functionalComponentArgsRest(__VLS_45));
                __VLS_47.slots.default;
                {
                    const { default: __VLS_thisSlot } = __VLS_47.slots;
                    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "relative" },
                    });
                    /** @type {[typeof VideoCard, ]} */ ;
                    // @ts-ignore
                    const __VLS_48 = __VLS_asFunctionalComponent(VideoCard, new VideoCard({
                        ...{ 'onLike': {} },
                        ...{ 'onError': {} },
                        video: (item),
                        ...{ class: "video-card-hover" },
                    }));
                    const __VLS_49 = __VLS_48({
                        ...{ 'onLike': {} },
                        ...{ 'onError': {} },
                        video: (item),
                        ...{ class: "video-card-hover" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
                    let __VLS_51;
                    let __VLS_52;
                    let __VLS_53;
                    const __VLS_54 = {
                        onLike: (__VLS_ctx.handleLike)
                    };
                    const __VLS_55 = {
                        onError: (__VLS_ctx.handleError)
                    };
                    var __VLS_50;
                    const __VLS_56 = {}.NButton;
                    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                        ...{ 'onClick': {} },
                        circle: true,
                        type: "error",
                        ghost: true,
                        ...{ class: "absolute top-2 right-2 z-10" },
                    }));
                    const __VLS_58 = __VLS_57({
                        ...{ 'onClick': {} },
                        circle: true,
                        type: "error",
                        ghost: true,
                        ...{ class: "absolute top-2 right-2 z-10" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                    let __VLS_60;
                    let __VLS_61;
                    let __VLS_62;
                    const __VLS_63 = {
                        onClick: (...[$event]) => {
                            if (!!(!__VLS_ctx.isAuthenticated))
                                return;
                            if (!!(__VLS_ctx.loading))
                                return;
                            if (!!(__VLS_ctx.videos.length === 0))
                                return;
                            __VLS_ctx.handleRemoveFromHistory(item.id);
                        }
                    };
                    __VLS_59.slots.default;
                    {
                        const { icon: __VLS_thisSlot } = __VLS_59.slots;
                        const __VLS_64 = {}.NIcon;
                        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
                        // @ts-ignore
                        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
                        const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
                        __VLS_67.slots.default;
                        const __VLS_68 = {}.Close;
                        /** @type {[typeof __VLS_components.Close, ]} */ ;
                        // @ts-ignore
                        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
                        const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
                        var __VLS_67;
                    }
                    var __VLS_59;
                }
                var __VLS_47;
            }
        }
    }
}
/** @type {__VLS_StyleScopedClasses['history-container']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-screen-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['video-card-hover']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NEmpty: NEmpty,
            NAlert: NAlert,
            NSpin: NSpin,
            NVirtualList: NVirtualList,
            NIcon: NIcon,
            Close: Close,
            VideoCard: VideoCard,
            router: router,
            t: t,
            videos: videos,
            loading: loading,
            error: error,
            isAuthenticated: isAuthenticated,
            groupedVideos: groupedVideos,
            gridCols: gridCols,
            handleClearHistory: handleClearHistory,
            handleRemoveFromHistory: handleRemoveFromHistory,
            handleLike: handleLike,
            handleError: handleError,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=History.vue.js.map