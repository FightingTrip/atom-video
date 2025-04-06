/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import { NTabs, NTabPane, NButton, NAvatar, NIcon, NSpin, NEmpty } from 'naive-ui';
import { EyeOutline, HeartOutline } from '@vicons/ionicons5';
const router = useRouter();
const loading = ref(false);
const videos = ref([]);
const hasMore = ref(true);
const currentPage = ref(1);
const currentCategoryId = ref('');
// 分类数据
const categories = ref([
    { id: 'all', name: '全部' },
    { id: 'music', name: '音乐' },
    { id: 'gaming', name: '游戏' },
    { id: 'education', name: '教育' },
    { id: 'entertainment', name: '娱乐' },
    { id: 'sports', name: '体育' },
    { id: 'technology', name: '科技' },
    { id: 'lifestyle', name: '生活' }
]);
// 当前分类
const currentCategory = computed(() => {
    return categories.value.find(c => c.id === currentCategoryId.value);
});
// 加载更多元素引用
const loadMoreRef = ref(null);
// 设置交叉观察
useIntersectionObserver(loadMoreRef, ([{ isIntersecting }]) => {
    if (isIntersecting && !loading.value && hasMore.value) {
        handleLoadMore();
    }
}, { threshold: 0.5 });
// 格式化数字
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
};
// 格式化时长
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
// 获取分类视频
const fetchVideos = async () => {
    loading.value = true;
    try {
        // TODO: 实现获取分类视频的API调用
        const result = await fetch(`/api/videos/category/${currentCategoryId.value}?page=${currentPage.value}`);
        const data = await result.json();
        videos.value.push(...data.videos);
        hasMore.value = data.hasMore;
    }
    catch (error) {
        console.error('获取分类视频失败:', error);
    }
    finally {
        loading.value = false;
    }
};
// 处理分类切换
const handleCategoryChange = (categoryId) => {
    currentCategoryId.value = categoryId;
    currentPage.value = 1;
    videos.value = [];
    hasMore.value = true;
    fetchVideos();
};
// 处理加载更多
const handleLoadMore = () => {
    if (!loading.value && hasMore.value) {
        currentPage.value++;
        fetchVideos();
    }
};
// 处理视频点击
const handleVideoClick = (video) => {
    router.push(`/video/${video.id}`);
};
onMounted(() => {
    currentCategoryId.value = categories.value[0].id;
    fetchVideos();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-card']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
/** @type {__VLS_StyleScopedClasses['explore']} */ ;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "explore-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "category-tabs" },
});
const __VLS_0 = {}.NTabs;
/** @type {[typeof __VLS_components.NTabs, typeof __VLS_components.nTabs, typeof __VLS_components.NTabs, typeof __VLS_components.nTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:value': {} },
    type: "line",
    animated: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:value': {} },
    type: "line",
    animated: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:value': (__VLS_ctx.handleCategoryChange)
};
__VLS_3.slots.default;
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_8 = {}.NTabPane;
    /** @type {[typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, typeof __VLS_components.NTabPane, typeof __VLS_components.nTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        key: (category.id),
        name: (category.id),
        tab: (category.name),
    }));
    const __VLS_10 = __VLS_9({
        key: (category.id),
        name: (category.id),
        tab: (category.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "category-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "video-grid" },
    });
    for (const [video] of __VLS_getVForSourceType((__VLS_ctx.videos))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.handleVideoClick(video);
                } },
            key: (video.id),
            ...{ class: "video-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "video-thumbnail" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (video.thumbnail),
            alt: (video.title),
            ...{ class: "thumbnail-image" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "video-duration" },
        });
        (__VLS_ctx.formatDuration(video.duration));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "video-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "video-title" },
        });
        (video.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "video-meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "author-info" },
        });
        const __VLS_12 = {}.NAvatar;
        /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            round: true,
            size: (24),
            src: (video.author.avatar),
            ...{ class: "author-avatar" },
        }));
        const __VLS_14 = __VLS_13({
            round: true,
            size: (24),
            src: (video.author.avatar),
            ...{ class: "author-avatar" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "author-name" },
        });
        (video.author.nickname);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "video-stats" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "stat-item" },
        });
        const __VLS_16 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
        const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        const __VLS_20 = {}.EyeOutline;
        /** @type {[typeof __VLS_components.EyeOutline, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
        const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
        var __VLS_19;
        (__VLS_ctx.formatNumber(video.views));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "stat-item" },
        });
        const __VLS_24 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
        const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        const __VLS_28 = {}.HeartOutline;
        /** @type {[typeof __VLS_components.HeartOutline, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
        const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
        var __VLS_27;
        (__VLS_ctx.formatNumber(video.likes));
    }
    if (__VLS_ctx.hasMore) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ref: "loadMoreRef",
            ...{ class: "load-more" },
        });
        /** @type {typeof __VLS_ctx.loadMoreRef} */ ;
        if (__VLS_ctx.loading) {
            const __VLS_32 = {}.NSpin;
            /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
            const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
        }
        else {
            const __VLS_36 = {}.NButton;
            /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
                ...{ 'onClick': {} },
                text: true,
                ...{ class: "load-more-button" },
            }));
            const __VLS_38 = __VLS_37({
                ...{ 'onClick': {} },
                text: true,
                ...{ class: "load-more-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            let __VLS_40;
            let __VLS_41;
            let __VLS_42;
            const __VLS_43 = {
                onClick: (__VLS_ctx.handleLoadMore)
            };
            __VLS_39.slots.default;
            var __VLS_39;
        }
    }
    else if (!__VLS_ctx.loading && __VLS_ctx.videos.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty-state" },
        });
        const __VLS_44 = {}.NEmpty;
        /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            description: (`暂无${__VLS_ctx.currentCategory?.name || ''}视频`),
        }));
        const __VLS_46 = __VLS_45({
            description: (`暂无${__VLS_ctx.currentCategory?.name || ''}视频`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    }
    var __VLS_11;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['explore-section']} */ ;
/** @type {__VLS_StyleScopedClasses['category-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['category-content']} */ ;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['video-card']} */ ;
/** @type {__VLS_StyleScopedClasses['video-thumbnail']} */ ;
/** @type {__VLS_StyleScopedClasses['thumbnail-image']} */ ;
/** @type {__VLS_StyleScopedClasses['video-duration']} */ ;
/** @type {__VLS_StyleScopedClasses['video-info']} */ ;
/** @type {__VLS_StyleScopedClasses['video-title']} */ ;
/** @type {__VLS_StyleScopedClasses['video-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['author-info']} */ ;
/** @type {__VLS_StyleScopedClasses['author-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['video-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NTabs: NTabs,
            NTabPane: NTabPane,
            NButton: NButton,
            NAvatar: NAvatar,
            NIcon: NIcon,
            NSpin: NSpin,
            NEmpty: NEmpty,
            EyeOutline: EyeOutline,
            HeartOutline: HeartOutline,
            loading: loading,
            videos: videos,
            hasMore: hasMore,
            categories: categories,
            currentCategory: currentCategory,
            loadMoreRef: loadMoreRef,
            formatNumber: formatNumber,
            formatDuration: formatDuration,
            handleCategoryChange: handleCategoryChange,
            handleLoadMore: handleLoadMore,
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
//# sourceMappingURL=Explore.vue.js.map