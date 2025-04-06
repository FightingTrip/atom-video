/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';
const router = useRouter();
const tags = ref([]);
const fetchTags = async () => {
    try {
        const response = await api.get('/api/tags/popular');
        if (response.data.success) {
            tags.value = response.data.data;
        }
    }
    catch (error) {
        console.error('获取标签失败:', error);
    }
};
const getTagClass = (count) => {
    if (count > 100)
        return 'tag-large';
    if (count > 50)
        return 'tag-medium';
    return 'tag-small';
};
const formatTagName = (tag) => {
    return tag.toLowerCase().replace(/_/g, ' ');
};
const handleTagClick = (tag) => {
    router.push(`/tags/${tag}`);
};
onMounted(() => {
    fetchTags();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['tag-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-cloud" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-bold mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap gap-2" },
});
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        key: (tag.tag),
        to: (`/tags/${tag.tag}`),
        ...{ class: "tag-item" },
        ...{ class: (__VLS_ctx.getTagClass(tag.count)) },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        key: (tag.tag),
        to: (`/tags/${tag.tag}`),
        ...{ class: "tag-item" },
        ...{ class: (__VLS_ctx.getTagClass(tag.count)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleTagClick(tag.tag);
        }
    };
    __VLS_3.slots.default;
    (__VLS_ctx.formatTagName(tag.tag));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tag-count" },
    });
    (tag.count);
    var __VLS_3;
}
/** @type {__VLS_StyleScopedClasses['tag-cloud']} */ ;
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
            tags: tags,
            getTagClass: getTagClass,
            formatTagName: formatTagName,
            handleTagClick: handleTagClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagCloud.vue.js.map