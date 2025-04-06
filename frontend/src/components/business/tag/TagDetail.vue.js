/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/utils/api';
import VideoCard from '@/components/business/video/VideoCard.vue';
import TagStats from '@/components/business/tag/TagStats.vue';
const route = useRoute();
const videos = ref([]);
const tag = ref(null);
const currentPage = ref(1);
const total = ref(0);
const totalPages = ref(0);
const relatedTags = ref([]);
const fetchTagVideos = async () => {
    try {
        const response = await api.get('/videos', {
            params: {
                tag: route.params.id,
                page: currentPage.value,
                limit: 12
            }
        });
        if (response.data.success) {
            videos.value = response.data.data.videos;
            total.value = response.data.data.total;
            totalPages.value = response.data.data.totalPages;
        }
    }
    catch (error) {
        console.error('获取标签视频失败:', error);
    }
};
const fetchRelatedTags = async () => {
    try {
        const response = await api.get('/api/tags/popular');
        if (response.data.success) {
            // 过滤掉当前标签，并取前5个相关标签
            relatedTags.value = response.data.data
                .filter((t) => t.tag !== route.params.id)
                .slice(0, 5);
        }
    }
    catch (error) {
        console.error('获取相关标签失败:', error);
    }
};
const formatTagName = (tag) => {
    return tag.toLowerCase().replace(/_/g, ' ');
};
const getTagClass = (count) => {
    if (count > 100)
        return 'tag-large';
    if (count > 50)
        return 'tag-medium';
    return 'tag-small';
};
const handlePageChange = (page) => {
    currentPage.value = page;
};
onMounted(async () => {
    try {
        const [tagResponse, videosResponse] = await Promise.all([
            api.get(`/tags/${route.params.id}`),
            api.get('/videos', {
                params: {
                    tag: route.params.id,
                },
            }),
        ]);
        tag.value = tagResponse.data;
        videos.value = videosResponse.data.videos;
        fetchTagVideos();
        fetchRelatedTags();
    }
    catch (error) {
        console.error('Failed to fetch tag details:', error);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['page-button']} */ ;
/** @type {__VLS_StyleScopedClasses['page-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-detail" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold" },
});
(__VLS_ctx.formatTagName(__VLS_ctx.tag));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-600 mt-2" },
});
(__VLS_ctx.total);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg:col-span-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-grid" },
});
for (const [video] of __VLS_getVForSourceType((__VLS_ctx.videos))) {
    /** @type {[typeof VideoCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(VideoCard, new VideoCard({
        key: (video.id),
        video: (video),
        ...{ class: "video-card" },
    }));
    const __VLS_1 = __VLS_0({
        key: (video.id),
        video: (video),
        ...{ class: "video-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
if (__VLS_ctx.totalPages > 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pagination mt-8" },
    });
    for (const [page] of __VLS_getVForSourceType((__VLS_ctx.totalPages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.totalPages > 1))
                        return;
                    __VLS_ctx.handlePageChange(page);
                } },
            key: (page),
            ...{ class: "page-button" },
            ...{ class: ({ active: __VLS_ctx.currentPage === page }) },
        });
        (page);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-8" },
});
/** @type {[typeof TagStats, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(TagStats, new TagStats({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "related-tags" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-bold mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap gap-2" },
});
for (const [relatedTag] of __VLS_getVForSourceType((__VLS_ctx.relatedTags))) {
    const __VLS_6 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        key: (relatedTag.tag),
        to: (`/tags/${relatedTag.tag}`),
        ...{ class: "tag-item" },
        ...{ class: (__VLS_ctx.getTagClass(relatedTag.count)) },
    }));
    const __VLS_8 = __VLS_7({
        key: (relatedTag.tag),
        to: (`/tags/${relatedTag.tag}`),
        ...{ class: "tag-item" },
        ...{ class: (__VLS_ctx.getTagClass(relatedTag.count)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_9.slots.default;
    (__VLS_ctx.formatTagName(relatedTag.tag));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tag-count" },
    });
    (relatedTag.count);
    var __VLS_9;
}
/** @type {__VLS_StyleScopedClasses['tag-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-header']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['video-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['video-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['page-button']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
/** @type {__VLS_StyleScopedClasses['related-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-count']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VideoCard: VideoCard,
            TagStats: TagStats,
            videos: videos,
            tag: tag,
            currentPage: currentPage,
            total: total,
            totalPages: totalPages,
            relatedTags: relatedTags,
            formatTagName: formatTagName,
            getTagClass: getTagClass,
            handlePageChange: handlePageChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagDetail.vue.js.map