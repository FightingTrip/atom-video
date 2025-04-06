/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NButton, NEmpty, NAlert, NSpin, NVirtualList, NTabs, NTabPane } from 'naive-ui';
import { VideocamOutline, GameControllerOutline, MusicalNotesOutline, FastFoodOutline, HeartOutline, SchoolOutline, HappyOutline, FootballOutline } from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/auth';
import { useVideoStore } from '@/stores/video';
import { useBreakpoint } from '@/composables/useBreakpoint';
import VideoCard from '@/components/business/video/VideoCard.vue';
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const videoStore = useVideoStore();
const { breakpoint } = useBreakpoint();
// 状态
const videos = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);
const activeTab = ref('favorites');
const searchQuery = ref('');
// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated);
const filteredVideos = computed(() => {
    let result = videos.value;
    // 分类过滤
    if (activeTab.value !== 'all') {
        result = result.filter(video => video.category === activeTab.value);
    }
    // 搜索过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(video => video.title.toLowerCase().includes(query) ||
            video.description?.toLowerCase().includes(query));
    }
    return result;
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
// 分类配置
const categories = [
    { label: t('categories.all'), value: 'all', icon: VideocamOutline },
    { label: t('categories.gaming'), value: 'gaming', icon: GameControllerOutline },
    { label: t('categories.music'), value: 'music', icon: MusicalNotesOutline },
    { label: t('categories.food'), value: 'food', icon: FastFoodOutline },
    { label: t('categories.lifestyle'), value: 'lifestyle', icon: HeartOutline },
    { label: t('categories.education'), value: 'education', icon: SchoolOutline },
    { label: t('categories.entertainment'), value: 'entertainment', icon: HappyOutline },
    { label: t('categories.sports'), value: 'sports', icon: FootballOutline }
];
// 获取收藏视频
const fetchLibraryVideos = async () => {
    try {
        await videoStore.getLibraryVideos();
    }
    catch (err) {
        console.error('获取收藏视频失败:', err);
    }
};
// 切换收藏状态
const handleToggleFavorite = async (videoId) => {
    try {
        await videoStore.toggleFavorite(videoId);
    }
    catch (err) {
        console.error('切换收藏状态失败:', err);
    }
};
// 处理搜索
const handleSearch = () => {
    currentPage.value = 1;
    fetchLibraryVideos();
};
// 处理滚动加载
const handleScroll = (e) => {
    const target = e.target;
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading.value && hasMore.value) {
        currentPage.value++;
        fetchLibraryVideos();
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
// 切换标签
const handleTabChange = (tab) => {
    activeTab.value = tab;
    fetchLibraryVideos();
};
// 生命周期钩子
onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchLibraryVideos();
    }
});
onUnmounted(() => {
    // 清理工作
    videos.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    searchQuery.value = '';
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-card-hover']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "library-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-4 py-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold" },
});
(__VLS_ctx.t('nav.library'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600 dark:text-gray-400 mt-2" },
});
(__VLS_ctx.t('library.description'));
if (!__VLS_ctx.isAuthenticated) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col items-center justify-center py-16" },
    });
    const __VLS_0 = {}.NEmpty;
    /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        description: (__VLS_ctx.t('auth.loginRequired')),
    }));
    const __VLS_2 = __VLS_1({
        description: (__VLS_ctx.t('auth.loginRequired')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    {
        const { extra: __VLS_thisSlot } = __VLS_3.slots;
        const __VLS_4 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_6 = __VLS_5({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        let __VLS_8;
        let __VLS_9;
        let __VLS_10;
        const __VLS_11 = {
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isAuthenticated))
                    return;
                __VLS_ctx.router.push('/auth/login');
            }
        };
        __VLS_7.slots.default;
        (__VLS_ctx.t('user.login'));
        var __VLS_7;
    }
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
        ...{ class: "max-w-screen-2xl mx-auto" },
    });
    if (__VLS_ctx.error) {
        const __VLS_12 = {}.NAlert;
        /** @type {[typeof __VLS_components.NAlert, typeof __VLS_components.nAlert, typeof __VLS_components.NAlert, typeof __VLS_components.nAlert, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ 'onClose': {} },
            type: "error",
            ...{ class: "mx-4 my-4" },
            closable: true,
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClose': {} },
            type: "error",
            ...{ class: "mx-4 my-4" },
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_16;
        let __VLS_17;
        let __VLS_18;
        const __VLS_19 = {
            onClose: (...[$event]) => {
                if (!!(!__VLS_ctx.isAuthenticated))
                    return;
                if (!(__VLS_ctx.error))
                    return;
                __VLS_ctx.error = null;
            }
        };
        __VLS_15.slots.default;
        (__VLS_ctx.error);
        var __VLS_15;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-4 mb-6" },
    });
    const __VLS_20 = {}.NTabs;
    /** @type {[typeof __VLS_components.NTabs, typeof __VLS_components.nTabs, typeof __VLS_components.NTabs, typeof __VLS_components.nTabs, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onUpdate:value': {} },
        value: (__VLS_ctx.activeTab),
        type: "line",
        animated: true,
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onUpdate:value': {} },
        value: (__VLS_ctx.activeTab),
        type: "line",
        animated: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        'onUpdate:value': (__VLS_ctx.handleTabChange)
    };
    __VLS_23.slots.default;
    const __VLS_28 = {}.NTabPane;
    /** @type {[typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        name: "favorites",
        tab: (__VLS_ctx.t('library.favorites')),
    }));
    const __VLS_30 = __VLS_29({
        name: "favorites",
        tab: (__VLS_ctx.t('library.favorites')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_32 = {}.NTabPane;
    /** @type {[typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        name: "playlists",
        tab: (__VLS_ctx.t('library.playlists')),
    }));
    const __VLS_34 = __VLS_33({
        name: "playlists",
        tab: (__VLS_ctx.t('library.playlists')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-4" },
    });
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex justify-center items-center py-8" },
        });
        const __VLS_36 = {}.NSpin;
        /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            size: "large",
        }));
        const __VLS_38 = __VLS_37({
            size: "large",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    }
    else {
        const __VLS_40 = {}.NVirtualList;
        /** @type {[typeof __VLS_components.NVirtualList, typeof __VLS_components.nVirtualList, typeof __VLS_components.NVirtualList, typeof __VLS_components.nVirtualList, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            ...{ 'onScroll': {} },
            items: (__VLS_ctx.filteredVideos),
            itemSize: (300),
            containerStyle: ({ height: 'calc(100vh - 300px)' }),
            grid: ({ cols: __VLS_ctx.gridCols, itemSize: 300 }),
        }));
        const __VLS_42 = __VLS_41({
            ...{ 'onScroll': {} },
            items: (__VLS_ctx.filteredVideos),
            itemSize: (300),
            containerStyle: ({ height: 'calc(100vh - 300px)' }),
            grid: ({ cols: __VLS_ctx.gridCols, itemSize: 300 }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        let __VLS_44;
        let __VLS_45;
        let __VLS_46;
        const __VLS_47 = {
            onScroll: (__VLS_ctx.handleScroll)
        };
        __VLS_43.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_43.slots;
            const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
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
        }
        var __VLS_43;
        if (!__VLS_ctx.loading && __VLS_ctx.filteredVideos.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex flex-col items-center justify-center py-16" },
            });
            const __VLS_56 = {}.NEmpty;
            /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                description: (__VLS_ctx.t('common.noData')),
            }));
            const __VLS_58 = __VLS_57({
                description: (__VLS_ctx.t('common.noData')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            __VLS_59.slots.default;
            {
                const { extra: __VLS_thisSlot } = __VLS_59.slots;
                const __VLS_60 = {}.NButton;
                /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
                // @ts-ignore
                const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                    ...{ 'onClick': {} },
                }));
                const __VLS_62 = __VLS_61({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                let __VLS_64;
                let __VLS_65;
                let __VLS_66;
                const __VLS_67 = {
                    onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.isAuthenticated))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(!__VLS_ctx.loading && __VLS_ctx.filteredVideos.length === 0))
                            return;
                        __VLS_ctx.router.push('/explore');
                    }
                };
                __VLS_63.slots.default;
                (__VLS_ctx.t('library.exploreVideos'));
                var __VLS_63;
            }
            var __VLS_59;
        }
    }
}
/** @type {__VLS_StyleScopedClasses['library-container']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
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
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['video-card-hover']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NEmpty: NEmpty,
            NAlert: NAlert,
            NSpin: NSpin,
            NVirtualList: NVirtualList,
            NTabs: NTabs,
            NTabPane: NTabPane,
            VideoCard: VideoCard,
            router: router,
            t: t,
            loading: loading,
            error: error,
            activeTab: activeTab,
            isAuthenticated: isAuthenticated,
            filteredVideos: filteredVideos,
            gridCols: gridCols,
            handleScroll: handleScroll,
            handleLike: handleLike,
            handleError: handleError,
            handleTabChange: handleTabChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Library.vue.js.map