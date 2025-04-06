/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { NTag, NAvatar } from 'naive-ui';
import { useVideoStore } from '@/stores/video';
const videoStore = useVideoStore();
// 选中的标签
const selectedTags = ref([]);
// 标签分类数据
const categories = [
    {
        id: 'languages',
        name: '编程语言',
        tags: [
            { id: 'javascript', name: 'JavaScript', icon: '/icons/javascript.svg' },
            { id: 'typescript', name: 'TypeScript', icon: '/icons/typescript.svg' },
            { id: 'python', name: 'Python', icon: '/icons/python.svg' },
            { id: 'java', name: 'Java', icon: '/icons/java.svg' },
            { id: 'cpp', name: 'C++', icon: '/icons/cpp.svg' }
        ]
    },
    {
        id: 'frameworks',
        name: '框架',
        tags: [
            { id: 'vue', name: 'Vue.js', icon: '/icons/vue.svg' },
            { id: 'react', name: 'React', icon: '/icons/react.svg' },
            { id: 'angular', name: 'Angular', icon: '/icons/angular.svg' },
            { id: 'node', name: 'Node.js', icon: '/icons/nodejs.svg' },
            { id: 'spring', name: 'Spring', icon: '/icons/spring.svg' }
        ]
    },
    {
        id: 'topics',
        name: '主题',
        tags: [
            { id: 'frontend', name: '前端开发' },
            { id: 'backend', name: '后端开发' },
            { id: 'database', name: '数据库' },
            { id: 'devops', name: 'DevOps' },
            { id: 'security', name: '安全' }
        ]
    },
    {
        id: 'level',
        name: '难度',
        tags: [
            { id: 'beginner', name: '入门' },
            { id: 'intermediate', name: '中级' },
            { id: 'advanced', name: '高级' }
        ]
    }
];
// 检查标签是否被选中
const isTagSelected = (tagId) => selectedTags.value.includes(tagId);
// 切换标签选中状态
const toggleTag = (tagId) => {
    const index = selectedTags.value.indexOf(tagId);
    if (index === -1) {
        selectedTags.value.push(tagId);
    }
    else {
        selectedTags.value.splice(index, 1);
    }
    // 更新视频列表
    videoStore.filterByTags(selectedTags.value);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-list" },
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (category.id),
        ...{ class: "mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 dark:text-white mb-3" },
    });
    (category.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap gap-2" },
    });
    for (const [tag] of __VLS_getVForSourceType((category.tags))) {
        const __VLS_0 = {}.NTag;
        /** @type {[typeof __VLS_components.NTag, typeof __VLS_components.nTag, typeof __VLS_components.NTag, typeof __VLS_components.nTag, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onClick': {} },
            key: (tag.id),
            type: (__VLS_ctx.isTagSelected(tag.id) ? 'primary' : 'default'),
            bordered: (false),
            size: "medium",
            round: true,
            clickable: true,
            ...{ class: "cursor-pointer transition-all duration-200 hover:scale-105" },
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onClick': {} },
            key: (tag.id),
            type: (__VLS_ctx.isTagSelected(tag.id) ? 'primary' : 'default'),
            bordered: (false),
            size: "medium",
            round: true,
            clickable: true,
            ...{ class: "cursor-pointer transition-all duration-200 hover:scale-105" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_4;
        let __VLS_5;
        let __VLS_6;
        const __VLS_7 = {
            onClick: (...[$event]) => {
                __VLS_ctx.toggleTag(tag.id);
            }
        };
        __VLS_3.slots.default;
        (tag.name);
        {
            const { avatar: __VLS_thisSlot } = __VLS_3.slots;
            if (tag.icon) {
                const __VLS_8 = {}.NAvatar;
                /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
                // @ts-ignore
                const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                    src: (tag.icon),
                    round: true,
                    size: "small",
                }));
                const __VLS_10 = __VLS_9({
                    src: (tag.icon),
                    round: true,
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_9));
            }
        }
        var __VLS_3;
    }
}
/** @type {__VLS_StyleScopedClasses['tag-list']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NTag: NTag,
            NAvatar: NAvatar,
            categories: categories,
            isTagSelected: isTagSelected,
            toggleTag: toggleTag,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagList.vue.js.map