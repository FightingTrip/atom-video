/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useVideoStore } from '@/stores/video';
import { videoCategories } from '@/mock/videos';
import { debounce } from 'lodash-es';
const router = useRouter();
const { t } = useI18n();
const videoStore = useVideoStore();
const searchQuery = ref('');
const showSuggestions = ref(false);
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'));
const isSearching = ref(false);
// 搜索建议
const searchSuggestions = computed(() => {
    if (!searchQuery.value)
        return [];
    const query = searchQuery.value.toLowerCase();
    const suggestions = [];
    // 从历史记录中匹配
    suggestions.push(...searchHistory.value
        .filter(item => item.toLowerCase().includes(query))
        .map(item => ({
        text: item,
        type: 'history',
        icon: 'fa-history',
        description: t('common.searchHistory')
    })));
    // 从视频标题中匹配
    suggestions.push(...videoStore.videos
        .filter(video => video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query))
        .slice(0, 5)
        .map(video => ({
        text: video.title,
        type: 'video',
        icon: 'fa-play-circle',
        description: `${formatViews(video.views)} 次观看`,
        thumbnail: video.thumbnail,
        id: video.id
    })));
    // 从标签中匹配
    const tags = videoCategories.map(cat => cat.name);
    suggestions.push(...tags
        .filter(tag => tag.toLowerCase().includes(query))
        .map(tag => ({
        text: tag,
        type: 'tag',
        icon: 'fa-tag',
        description: t('common.category')
    })));
    return suggestions;
});
// 格式化观看次数
const formatViews = (views) => {
    if (views >= 10000) {
        return (views / 10000).toFixed(1) + '万';
    }
    return views.toString();
};
// 处理搜索
const handleSearch = debounce(() => {
    if (searchQuery.value) {
        isSearching.value = true;
        // 模拟搜索延迟
        setTimeout(() => {
            isSearching.value = false;
        }, 500);
    }
}, 300);
// 选择建议
const selectSuggestion = (suggestion) => {
    searchQuery.value = suggestion.text;
    showSuggestions.value = false;
    // 保存到历史记录
    if (!searchHistory.value.includes(suggestion.text)) {
        searchHistory.value.unshift(suggestion.text);
        if (searchHistory.value.length > 10) {
            searchHistory.value.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
    }
    // 根据类型处理跳转
    if (suggestion.type === 'video' && suggestion.id) {
        router.push(`/video/${suggestion.id}`);
    }
    else if (suggestion.type === 'tag') {
        router.push({
            path: '/',
            query: { tag: suggestion.text }
        });
    }
    else {
        router.push({
            path: '/search',
            query: { q: suggestion.text }
        });
    }
};
// 清除历史
const clearHistory = () => {
    searchHistory.value = [];
    localStorage.removeItem('searchHistory');
};
// 点击外部关闭建议
const handleClickOutside = (event) => {
    const target = event.target;
    if (!target.closest('.search-container')) {
        showSuggestions.value = false;
    }
};
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative w-full max-w-xl" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (__VLS_ctx.handleSearch) },
    ...{ onFocus: (...[$event]) => {
            __VLS_ctx.showSuggestions = true;
        } },
    type: "text",
    value: (__VLS_ctx.searchQuery),
    placeholder: (__VLS_ctx.t('common.searchPlaceholder')),
    ...{ class: "w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "fas fa-search absolute left-4 top-3 text-gray-400" },
});
if (__VLS_ctx.searchQuery) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        ...{ onClick: (__VLS_ctx.clearHistory) },
        ...{ class: "fas fa-times absolute right-4 top-3 text-gray-400 cursor-pointer hover:text-gray-600" },
    });
}
if (__VLS_ctx.showSuggestions && (__VLS_ctx.searchSuggestions.length > 0 || __VLS_ctx.searchHistory.length > 0)) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50" },
    });
    if (!__VLS_ctx.searchQuery && __VLS_ctx.searchHistory.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between px-3 py-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm text-gray-500" },
        });
        (__VLS_ctx.t('common.searchHistory'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.clearHistory) },
            ...{ class: "text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" },
        });
        (__VLS_ctx.t('common.clearHistory'));
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.searchHistory))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showSuggestions && (__VLS_ctx.searchSuggestions.length > 0 || __VLS_ctx.searchHistory.length > 0)))
                            return;
                        if (!(!__VLS_ctx.searchQuery && __VLS_ctx.searchHistory.length > 0))
                            return;
                        __VLS_ctx.selectSuggestion({
                            text: item,
                            type: 'history',
                            icon: 'fa-history',
                            description: __VLS_ctx.t('common.searchHistory')
                        });
                    } },
                key: (item),
                ...{ class: "flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
                ...{ class: "fas fa-history text-gray-400 mr-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item);
        }
    }
    if (__VLS_ctx.searchSuggestions.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-2" },
        });
        for (const [suggestion] of __VLS_getVForSourceType((__VLS_ctx.searchSuggestions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showSuggestions && (__VLS_ctx.searchSuggestions.length > 0 || __VLS_ctx.searchHistory.length > 0)))
                            return;
                        if (!(__VLS_ctx.searchSuggestions.length > 0))
                            return;
                        __VLS_ctx.selectSuggestion(suggestion);
                    } },
                key: (suggestion.text),
                ...{ class: "flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" },
            });
            if (suggestion.type === 'video' && suggestion.thumbnail) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
                    src: (suggestion.thumbnail),
                    alt: (suggestion.text),
                    ...{ class: "w-16 h-9 object-cover rounded mr-3" },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
                    ...{ class: (['fas', suggestion.icon, 'text-gray-400 mr-2']) },
                });
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex-1 min-w-0" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "text-sm font-medium text-gray-900 dark:text-gray-100 truncate" },
            });
            (suggestion.text);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "text-xs text-gray-500 dark:text-gray-400" },
            });
            (suggestion.description);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ml-2 text-xs text-gray-400" },
            });
            (__VLS_ctx.t(`common.${suggestion.type}`));
        }
    }
    if (__VLS_ctx.isSearching) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-4 text-center text-gray-500" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
            ...{ class: "fas fa-spinner fa-spin mr-2" },
        });
        (__VLS_ctx.t('common.loading'));
    }
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-times']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-history']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-9']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            searchQuery: searchQuery,
            showSuggestions: showSuggestions,
            searchHistory: searchHistory,
            isSearching: isSearching,
            searchSuggestions: searchSuggestions,
            handleSearch: handleSearch,
            selectSuggestion: selectSuggestion,
            clearHistory: clearHistory,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SearchBar.vue.js.map