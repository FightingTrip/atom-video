/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { NInput, NInputGroup, NIcon, NButton, NDrawer, NDrawerContent, NSelect } from 'naive-ui';
import { SearchOutline, FilterOutline, TimeOutline, TrashOutline, VideocamOutline, PersonOutline, PricetagOutline } from '@vicons/ionicons5';
import { useVideoStore } from '../stores/video';
const router = useRouter();
const { t } = useI18n();
const videoStore = useVideoStore();
const searchQuery = ref('');
const showAdvanced = ref(true);
const showAdvancedDrawer = ref(false);
const showSuggestions = ref(false);
// 搜索历史
const searchHistory = useStorage('searchHistory', []);
// 高级筛选选项
const advancedFilters = ref({
    timeRange: null,
    duration: null,
    sort: 'relevance'
});
// 时间范围选项
const timeRangeOptions = computed(() => [
    { label: t('search.timeRange.all'), value: 'all' },
    { label: t('search.timeRange.today'), value: 'today' },
    { label: t('search.timeRange.week'), value: 'week' },
    { label: t('search.timeRange.month'), value: 'month' },
    { label: t('search.timeRange.year'), value: 'year' }
]);
// 视频时长选项
const durationOptions = computed(() => [
    { label: t('search.duration.all'), value: 'all' },
    { label: t('search.duration.short'), value: 'short' },
    { label: t('search.duration.medium'), value: 'medium' },
    { label: t('search.duration.long'), value: 'long' }
]);
// 排序方式选项
const sortOptions = computed(() => [
    { label: t('search.sortBy.relevance'), value: 'relevance' },
    { label: t('search.sortBy.date'), value: 'date' },
    { label: t('search.sortBy.views'), value: 'views' },
    { label: t('search.sortBy.likes'), value: 'likes' }
]);
// 搜索建议
const suggestions = computed(() => {
    if (!searchQuery.value)
        return [];
    const query = searchQuery.value.toLowerCase();
    const results = [];
    // 从视频标题中搜索
    results.push(...videoStore.videos
        .filter(video => video.title.toLowerCase().includes(query))
        .map(video => ({
        text: video.title,
        type: t('search.type.video'),
        icon: VideocamOutline
    })));
    // 从标签中搜索
    results.push(...videoStore.allTags
        .filter(tag => tag.toLowerCase().includes(query))
        .map(tag => ({
        text: tag,
        type: t('search.type.tag'),
        icon: PricetagOutline
    })));
    // 从创作者中搜索
    results.push(...videoStore.creators
        .filter(creator => creator.name.toLowerCase().includes(query))
        .map(creator => ({
        text: creator.name,
        type: t('search.type.creator'),
        icon: PersonOutline
    })));
    return results;
});
// 过滤后的建议（最多显示 8 个）
const filteredSuggestions = computed(() => {
    return suggestions.value.slice(0, 8);
});
// 处理输入
const handleInput = () => {
    showSuggestions.value = true;
};
// 选择建议
const selectSuggestion = (text) => {
    searchQuery.value = text;
    showSuggestions.value = false;
    addToHistory(text);
    router.push({
        name: 'Search',
        query: {
            q: text,
            ...advancedFilters.value
        }
    });
};
// 添加到搜索历史
const addToHistory = (text) => {
    if (!searchHistory.value.includes(text)) {
        searchHistory.value.unshift(text);
        if (searchHistory.value.length > 10) {
            searchHistory.value.pop();
        }
    }
};
// 清除搜索历史
const clearHistory = () => {
    searchHistory.value = [];
};
// 清除搜索
const clearSearch = () => {
    searchQuery.value = '';
    showSuggestions.value = false;
};
// 切换高级搜索抽屉
const toggleAdvanced = () => {
    showAdvancedDrawer.value = true;
};
// 重置高级筛选
const resetAdvancedFilters = () => {
    advancedFilters.value = {
        timeRange: null,
        duration: null,
        sort: 'relevance'
    };
};
// 应用高级筛选
const applyAdvancedFilters = () => {
    router.push({
        name: 'Search',
        query: {
            q: searchQuery.value,
            ...advancedFilters.value
        }
    });
    showAdvancedDrawer.value = false;
};
// 点击外部关闭建议框
const handleClickOutside = (event) => {
    if (!event.target.closest('.search-container')) {
        showSuggestions.value = false;
    }
};
// 监听点击事件
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
    ...{ class: "relative" },
});
const __VLS_0 = {}.NInputGroup;
/** @type {[typeof __VLS_components.NInputGroup, typeof __VLS_components.nInputGroup, typeof __VLS_components.NInputGroup, typeof __VLS_components.nInputGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onInput': {} },
    ...{ 'onClear': {} },
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: (__VLS_ctx.t('header.search')),
    clearable: true,
    ...{ class: "search-input" },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onInput': {} },
    ...{ 'onClear': {} },
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: (__VLS_ctx.t('header.search')),
    clearable: true,
    ...{ class: "search-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onInput: (__VLS_ctx.handleInput)
};
const __VLS_12 = {
    onClear: (__VLS_ctx.clearSearch)
};
__VLS_7.slots.default;
{
    const { prefix: __VLS_thisSlot } = __VLS_7.slots;
    const __VLS_13 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        component: (__VLS_ctx.SearchOutline),
    }));
    const __VLS_15 = __VLS_14({
        component: (__VLS_ctx.SearchOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
if (__VLS_ctx.showAdvanced) {
    {
        const { suffix: __VLS_thisSlot } = __VLS_7.slots;
        const __VLS_17 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            ...{ 'onClick': {} },
            quaternary: true,
            circle: true,
        }));
        const __VLS_19 = __VLS_18({
            ...{ 'onClick': {} },
            quaternary: true,
            circle: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        let __VLS_21;
        let __VLS_22;
        let __VLS_23;
        const __VLS_24 = {
            onClick: (__VLS_ctx.toggleAdvanced)
        };
        __VLS_20.slots.default;
        {
            const { icon: __VLS_thisSlot } = __VLS_20.slots;
            const __VLS_25 = {}.NIcon;
            /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
                component: (__VLS_ctx.FilterOutline),
            }));
            const __VLS_27 = __VLS_26({
                component: (__VLS_ctx.FilterOutline),
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        }
        var __VLS_20;
    }
}
var __VLS_7;
var __VLS_3;
if (__VLS_ctx.showSuggestions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "suggestions-dropdown" },
    });
    if (__VLS_ctx.searchHistory.length && !__VLS_ctx.searchQuery) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "suggestions-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "suggestions-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.t('search.history'));
        const __VLS_29 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_33;
        let __VLS_34;
        let __VLS_35;
        const __VLS_36 = {
            onClick: (__VLS_ctx.clearHistory)
        };
        __VLS_32.slots.default;
        {
            const { icon: __VLS_thisSlot } = __VLS_32.slots;
            const __VLS_37 = {}.NIcon;
            /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
            // @ts-ignore
            const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
                component: (__VLS_ctx.TrashOutline),
            }));
            const __VLS_39 = __VLS_38({
                component: (__VLS_ctx.TrashOutline),
            }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        }
        (__VLS_ctx.t('search.clearHistory'));
        var __VLS_32;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "suggestions-list" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.searchHistory))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showSuggestions))
                            return;
                        if (!(__VLS_ctx.searchHistory.length && !__VLS_ctx.searchQuery))
                            return;
                        __VLS_ctx.selectSuggestion(item);
                    } },
                key: (item),
                ...{ class: "suggestion-item" },
            });
            const __VLS_41 = {}.NIcon;
            /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                component: (__VLS_ctx.TimeOutline),
                ...{ class: "suggestion-icon" },
            }));
            const __VLS_43 = __VLS_42({
                component: (__VLS_ctx.TimeOutline),
                ...{ class: "suggestion-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item);
        }
    }
    if (__VLS_ctx.searchQuery) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "suggestions-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "suggestions-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.t('search.suggestions'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "suggestions-list" },
        });
        for (const [suggestion] of __VLS_getVForSourceType((__VLS_ctx.filteredSuggestions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showSuggestions))
                            return;
                        if (!(__VLS_ctx.searchQuery))
                            return;
                        __VLS_ctx.selectSuggestion(suggestion.text);
                    } },
                key: (suggestion.text),
                ...{ class: "suggestion-item" },
            });
            const __VLS_45 = {}.NIcon;
            /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
                component: (suggestion.icon),
                ...{ class: "suggestion-icon" },
            }));
            const __VLS_47 = __VLS_46({
                component: (suggestion.icon),
                ...{ class: "suggestion-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (suggestion.text);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "suggestion-type" },
            });
            (suggestion.type);
        }
    }
}
const __VLS_49 = {}.NDrawer;
/** @type {[typeof __VLS_components.NDrawer, typeof __VLS_components.nDrawer, typeof __VLS_components.NDrawer, typeof __VLS_components.nDrawer, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    show: (__VLS_ctx.showAdvancedDrawer),
    width: (300),
    placement: "right",
}));
const __VLS_51 = __VLS_50({
    show: (__VLS_ctx.showAdvancedDrawer),
    width: (300),
    placement: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.NDrawerContent;
/** @type {[typeof __VLS_components.NDrawerContent, typeof __VLS_components.nDrawerContent, typeof __VLS_components.NDrawerContent, typeof __VLS_components.nDrawerContent, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    title: (__VLS_ctx.t('search.advancedSearch')),
}));
const __VLS_55 = __VLS_54({
    title: (__VLS_ctx.t('search.advancedSearch')),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-sm font-medium mb-2" },
});
(__VLS_ctx.t('search.timeRange'));
const __VLS_57 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    value: (__VLS_ctx.advancedFilters.timeRange),
    options: (__VLS_ctx.timeRangeOptions),
    placeholder: (__VLS_ctx.t('search.selectTimeRange')),
}));
const __VLS_59 = __VLS_58({
    value: (__VLS_ctx.advancedFilters.timeRange),
    options: (__VLS_ctx.timeRangeOptions),
    placeholder: (__VLS_ctx.t('search.selectTimeRange')),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-sm font-medium mb-2" },
});
(__VLS_ctx.t('search.duration'));
const __VLS_61 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    value: (__VLS_ctx.advancedFilters.duration),
    options: (__VLS_ctx.durationOptions),
    placeholder: (__VLS_ctx.t('search.selectDuration')),
}));
const __VLS_63 = __VLS_62({
    value: (__VLS_ctx.advancedFilters.duration),
    options: (__VLS_ctx.durationOptions),
    placeholder: (__VLS_ctx.t('search.selectDuration')),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "text-sm font-medium mb-2" },
});
(__VLS_ctx.t('search.sortBy'));
const __VLS_65 = {}.NSelect;
/** @type {[typeof __VLS_components.NSelect, typeof __VLS_components.nSelect, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    value: (__VLS_ctx.advancedFilters.sort),
    options: (__VLS_ctx.sortOptions),
    placeholder: (__VLS_ctx.t('search.selectSortBy')),
}));
const __VLS_67 = __VLS_66({
    value: (__VLS_ctx.advancedFilters.sort),
    options: (__VLS_ctx.sortOptions),
    placeholder: (__VLS_ctx.t('search.selectSortBy')),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end space-x-2" },
});
const __VLS_69 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ 'onClick': {} },
}));
const __VLS_71 = __VLS_70({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
let __VLS_75;
const __VLS_76 = {
    onClick: (__VLS_ctx.resetAdvancedFilters)
};
__VLS_72.slots.default;
(__VLS_ctx.t('common.reset'));
var __VLS_72;
const __VLS_77 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_79 = __VLS_78({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_81;
let __VLS_82;
let __VLS_83;
const __VLS_84 = {
    onClick: (__VLS_ctx.applyAdvancedFilters)
};
__VLS_80.slots.default;
(__VLS_ctx.t('common.apply'));
var __VLS_80;
var __VLS_56;
var __VLS_52;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-section']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-header']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-list']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestion-item']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestion-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-section']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-header']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestions-list']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestion-item']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestion-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['suggestion-type']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NInput: NInput,
            NInputGroup: NInputGroup,
            NIcon: NIcon,
            NButton: NButton,
            NDrawer: NDrawer,
            NDrawerContent: NDrawerContent,
            NSelect: NSelect,
            SearchOutline: SearchOutline,
            FilterOutline: FilterOutline,
            TimeOutline: TimeOutline,
            TrashOutline: TrashOutline,
            t: t,
            searchQuery: searchQuery,
            showAdvanced: showAdvanced,
            showAdvancedDrawer: showAdvancedDrawer,
            showSuggestions: showSuggestions,
            searchHistory: searchHistory,
            advancedFilters: advancedFilters,
            timeRangeOptions: timeRangeOptions,
            durationOptions: durationOptions,
            sortOptions: sortOptions,
            filteredSuggestions: filteredSuggestions,
            handleInput: handleInput,
            selectSuggestion: selectSuggestion,
            clearHistory: clearHistory,
            clearSearch: clearSearch,
            toggleAdvanced: toggleAdvanced,
            resetAdvancedFilters: resetAdvancedFilters,
            applyAdvancedFilters: applyAdvancedFilters,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HeaderSearch.vue.js.map