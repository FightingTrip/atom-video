/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { useRouter } from 'vue-router';
import { NButton, NButtonGroup, NIcon, NAvatar, NCollapse, NCollapseItem } from 'naive-ui';
import { ThumbsUp, ThumbsUpOutline, Bookmark, BookmarkOutline, Share } from '@vicons/ionicons5';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
const props = defineProps();
const emit = defineEmits();
const router = useRouter();
// 格式化数字
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
};
// 格式化日期
const formatDate = (date) => {
    if (!date)
        return '';
    return dayjs(date).fromNow();
};
// 处理点击作者
const handleAuthorClick = () => {
    if (props.video?.author.id) {
        router.push(`/user/${props.video.author.id}`);
    }
};
// 处理互动
const handleLike = () => {
    emit('like');
};
const handleFavorite = () => {
    emit('favorite');
};
const handleShare = () => {
    emit('share');
};
const handleFollow = () => {
    emit('follow');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-interaction']} */ ;
/** @type {__VLS_StyleScopedClasses['video-title']} */ ;
/** @type {__VLS_StyleScopedClasses['author-info']} */ ;
/** @type {__VLS_StyleScopedClasses['author-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['interaction-buttons']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-interaction" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "video-title" },
});
(__VLS_ctx.video?.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.formatNumber(__VLS_ctx.video?.views || 0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.formatDate(__VLS_ctx.video?.createdAt));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "interaction-buttons" },
});
const __VLS_0 = {}.NButtonGroup;
/** @type {[typeof __VLS_components.NButtonGroup, typeof __VLS_components.nButtonGroup, typeof __VLS_components.NButtonGroup, typeof __VLS_components.nButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.isLiked ? 'primary' : 'default'),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.isLiked ? 'primary' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.handleLike)
};
__VLS_7.slots.default;
{
    const { icon: __VLS_thisSlot } = __VLS_7.slots;
    const __VLS_12 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    if (__VLS_ctx.isLiked) {
        const __VLS_16 = {}.ThumbsUp;
        /** @type {[typeof __VLS_components.ThumbsUp, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
        const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    }
    else {
        const __VLS_20 = {}.ThumbsUpOutline;
        /** @type {[typeof __VLS_components.ThumbsUpOutline, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
        const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    var __VLS_15;
}
(__VLS_ctx.formatNumber(__VLS_ctx.video?.likes || 0));
var __VLS_7;
const __VLS_24 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.isFavorited ? 'primary' : 'default'),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.isFavorited ? 'primary' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.handleFavorite)
};
__VLS_27.slots.default;
{
    const { icon: __VLS_thisSlot } = __VLS_27.slots;
    const __VLS_32 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    if (__VLS_ctx.isFavorited) {
        const __VLS_36 = {}.Bookmark;
        /** @type {[typeof __VLS_components.Bookmark, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
        const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    }
    else {
        const __VLS_40 = {}.BookmarkOutline;
        /** @type {[typeof __VLS_components.BookmarkOutline, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
        const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    }
    var __VLS_35;
}
(__VLS_ctx.formatNumber(__VLS_ctx.video?.favorites || 0));
var __VLS_27;
const __VLS_44 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.handleShare)
};
__VLS_47.slots.default;
{
    const { icon: __VLS_thisSlot } = __VLS_47.slots;
    const __VLS_52 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.Share;
    /** @type {[typeof __VLS_components.Share, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
    const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
    var __VLS_55;
}
var __VLS_47;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-profile" },
});
const __VLS_60 = {}.NAvatar;
/** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    round: true,
    size: (48),
    src: (__VLS_ctx.video?.author.avatar),
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    round: true,
    size: (48),
    src: (__VLS_ctx.video?.author.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.handleAuthorClick)
};
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ onClick: (__VLS_ctx.handleAuthorClick) },
    ...{ class: "author-name" },
});
(__VLS_ctx.video?.author.nickname);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "author-stats" },
});
(__VLS_ctx.formatNumber(__VLS_ctx.video?.author.followers || 0));
const __VLS_68 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.video?.author.isFollowed ? 'default' : 'primary'),
    ghost: (__VLS_ctx.video?.author.isFollowed),
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.video?.author.isFollowed ? 'default' : 'primary'),
    ghost: (__VLS_ctx.video?.author.isFollowed),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onClick: (__VLS_ctx.handleFollow)
};
__VLS_71.slots.default;
(__VLS_ctx.video?.author.isFollowed ? '已关注' : '关注');
var __VLS_71;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-description" },
});
const __VLS_76 = {}.NCollapse;
/** @type {[typeof __VLS_components.NCollapse, typeof __VLS_components.nCollapse, typeof __VLS_components.NCollapse, typeof __VLS_components.nCollapse, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.NCollapseItem;
/** @type {[typeof __VLS_components.NCollapseItem, typeof __VLS_components.nCollapseItem, typeof __VLS_components.NCollapseItem, typeof __VLS_components.nCollapseItem, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    name: "description",
}));
const __VLS_82 = __VLS_81({
    name: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_83.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "description-header" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "description-content" },
});
(__VLS_ctx.video?.description || '暂无简介');
var __VLS_83;
var __VLS_79;
/** @type {__VLS_StyleScopedClasses['video-interaction']} */ ;
/** @type {__VLS_StyleScopedClasses['video-info']} */ ;
/** @type {__VLS_StyleScopedClasses['video-title']} */ ;
/** @type {__VLS_StyleScopedClasses['video-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['interaction-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['author-info']} */ ;
/** @type {__VLS_StyleScopedClasses['author-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['author-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['author-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['video-description']} */ ;
/** @type {__VLS_StyleScopedClasses['description-header']} */ ;
/** @type {__VLS_StyleScopedClasses['description-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NButtonGroup: NButtonGroup,
            NIcon: NIcon,
            NAvatar: NAvatar,
            NCollapse: NCollapse,
            NCollapseItem: NCollapseItem,
            ThumbsUp: ThumbsUp,
            ThumbsUpOutline: ThumbsUpOutline,
            Bookmark: Bookmark,
            BookmarkOutline: BookmarkOutline,
            Share: Share,
            formatNumber: formatNumber,
            formatDate: formatDate,
            handleAuthorClick: handleAuthorClick,
            handleLike: handleLike,
            handleFavorite: handleFavorite,
            handleShare: handleShare,
            handleFollow: handleFollow,
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
//# sourceMappingURL=VideoInteraction.vue.js.map