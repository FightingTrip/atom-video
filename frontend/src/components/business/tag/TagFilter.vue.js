/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const categories = [
    {
        name: 'languages',
        label: '编程语言',
        tags: [
            'JAVASCRIPT',
            'TYPESCRIPT',
            'PYTHON',
            'JAVA',
            'C_SHARP',
            'C_PLUS_PLUS',
            'GO',
            'RUST',
            'SWIFT',
            'KOTLIN',
            'PHP',
            'RUBY'
        ]
    },
    {
        name: 'frontend',
        label: '前端技术',
        tags: [
            'REACT',
            'VUE',
            'ANGULAR',
            'SVELTE',
            'HTML',
            'CSS',
            'SASS',
            'WEBPACK',
            'VITE'
        ]
    },
    {
        name: 'backend',
        label: '后端技术',
        tags: [
            'NODEJS',
            'EXPRESS',
            'NESTJS',
            'SPRING',
            'DJANGO',
            'FLASK',
            'LARAVEL',
            'GRAPHQL',
            'REST'
        ]
    },
    {
        name: 'database',
        label: '数据库',
        tags: [
            'POSTGRESQL',
            'MYSQL',
            'MONGODB',
            'REDIS',
            'SQLITE'
        ]
    },
    {
        name: 'cloud',
        label: '云服务',
        tags: [
            'AWS',
            'AZURE',
            'GCP',
            'DOCKER',
            'KUBERNETES'
        ]
    },
    {
        name: 'tools',
        label: '开发工具',
        tags: [
            'GIT',
            'VSCODE',
            'JETBRAINS',
            'POSTMAN'
        ]
    },
    {
        name: 'cs',
        label: '计算机科学',
        tags: [
            'ALGORITHMS',
            'DATA_STRUCTURES',
            'DESIGN_PATTERNS',
            'SYSTEM_DESIGN',
            'COMPILER',
            'OPERATING_SYSTEM'
        ]
    },
    {
        name: 'other',
        label: '其他',
        tags: [
            'TUTORIAL',
            'BEST_PRACTICES',
            'PERFORMANCE',
            'SECURITY',
            'TESTING',
            'DEVOPS'
        ]
    }
];
const selectedCategories = ref([]);
const selectedTags = ref(props.modelValue);
const filteredCategories = computed(() => {
    if (selectedCategories.value.length === 0) {
        return categories;
    }
    return categories.filter(category => selectedCategories.value.includes(category.name));
});
const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category);
    if (index === -1) {
        selectedCategories.value.push(category);
    }
    else {
        selectedCategories.value.splice(index, 1);
    }
};
const toggleTag = (tag) => {
    const index = selectedTags.value.indexOf(tag);
    if (index === -1) {
        selectedTags.value.push(tag);
    }
    else {
        selectedTags.value.splice(index, 1);
    }
    emit('update:modelValue', selectedTags.value);
};
const removeTag = (tag) => {
    const index = selectedTags.value.indexOf(tag);
    if (index !== -1) {
        selectedTags.value.splice(index, 1);
        emit('update:modelValue', selectedTags.value);
    }
};
const formatTagName = (tag) => {
    return tag.toLowerCase().replace(/_/g, ' ');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['category-button']} */ ;
/** @type {__VLS_StyleScopedClasses['category-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-button']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-tag']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-filter" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap gap-2 mb-4" },
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.toggleCategory(category.name);
            } },
        key: (category.name),
        ...{ class: "category-button" },
        ...{ class: ({ active: __VLS_ctx.selectedCategories.includes(category.name) }) },
    });
    (category.label);
}
if (__VLS_ctx.selectedTags.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "selected-tags mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap gap-2" },
    });
    for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.selectedTags))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (tag),
            ...{ class: "selected-tag" },
        });
        (__VLS_ctx.formatTagName(tag));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.selectedTags.length > 0))
                        return;
                    __VLS_ctx.removeTag(tag);
                } },
            ...{ class: "remove-tag" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-categories" },
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.filteredCategories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (category.name),
        ...{ class: "category-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "category-title" },
    });
    (category.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-wrap gap-2" },
    });
    for (const [tag] of __VLS_getVForSourceType((category.tags))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.toggleTag(tag);
                } },
            key: (tag),
            ...{ class: "tag-button" },
            ...{ class: ({ active: __VLS_ctx.selectedTags.includes(tag) }) },
        });
        (__VLS_ctx.formatTagName(tag));
    }
}
/** @type {__VLS_StyleScopedClasses['tag-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['category-button']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['selected-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-categories']} */ ;
/** @type {__VLS_StyleScopedClasses['category-section']} */ ;
/** @type {__VLS_StyleScopedClasses['category-title']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-button']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            categories: categories,
            selectedCategories: selectedCategories,
            selectedTags: selectedTags,
            filteredCategories: filteredCategories,
            toggleCategory: toggleCategory,
            toggleTag: toggleTag,
            removeTag: removeTag,
            formatTagName: formatTagName,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagFilter.vue.js.map