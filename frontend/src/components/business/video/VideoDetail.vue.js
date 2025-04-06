/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { NButton, NButtonGroup, NIcon, NInput, NAvatar, NTag } from 'naive-ui';
import { ThumbsUp, Bookmark, Share, Chatbubble } from '@vicons/ionicons5';
import VideoPlayer from './VideoPlayer.vue';
import { useAuthStore } from '@/stores/auth';
const props = defineProps();
const emit = defineEmits();
// 状态
const authStore = useAuthStore();
const currentTime = ref(props.currentTime || 0);
const isLiked = ref(false);
const isFavorited = ref(false);
const isSubscribed = ref(false);
const commentText = ref('');
const comments = ref([]);
const loadingMore = ref(false);
const hasMoreComments = ref(true);
// 计算属性
const userAvatar = computed(() => authStore.user?.avatar);
const fallbackAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.video.author.id}`;
});
const fallbackUserAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.id}`;
});
// 方法
const handleTimeUpdate = (time) => {
    currentTime.value = time;
    emit('time-update', time);
};
const handlePlay = () => {
    emit('play');
};
const handlePause = () => {
    emit('pause');
};
const handleEnded = () => {
    emit('ended');
};
const handleLike = () => {
    isLiked.value = !isLiked.value;
    emit('like');
};
const handleFavorite = () => {
    isFavorited.value = !isFavorited.value;
    emit('favorite');
};
const handleSubscribe = () => {
    isSubscribed.value = !isSubscribed.value;
    emit('subscribe');
};
const handleComment = () => {
    if (!commentText.value.trim())
        return;
    emit('comment', commentText.value);
    commentText.value = '';
};
const loadMoreComments = async () => {
    if (loadingMore.value)
        return;
    loadingMore.value = true;
    await emit('load-more-comments');
    loadingMore.value = false;
};
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
};
const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) {
        return '刚刚';
    }
    else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
    }
    else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
    }
    else if (diff < 2592000000) {
        return `${Math.floor(diff / 86400000)}天前`;
    }
    else {
        return d.toLocaleDateString();
    }
};
const getFallbackAvatar = (id) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['author-header']} */ ;
/** @type {__VLS_StyleScopedClasses['author-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-detail" },
});
/** @type {[typeof VideoPlayer, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(VideoPlayer, new VideoPlayer({
    ...{ 'onTimeUpdate': {} },
    ...{ 'onPlay': {} },
    ...{ 'onPause': {} },
    ...{ 'onEnded': {} },
    video: (__VLS_ctx.video),
    currentTime: (__VLS_ctx.currentTime),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onTimeUpdate': {} },
    ...{ 'onPlay': {} },
    ...{ 'onPause': {} },
    ...{ 'onEnded': {} },
    video: (__VLS_ctx.video),
    currentTime: (__VLS_ctx.currentTime),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onTimeUpdate: (__VLS_ctx.handleTimeUpdate)
};
const __VLS_7 = {
    onPlay: (__VLS_ctx.handlePlay)
};
const __VLS_8 = {
    onPause: (__VLS_ctx.handlePause)
};
const __VLS_9 = {
    onEnded: (__VLS_ctx.handleEnded)
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "video-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "title" },
});
(__VLS_ctx.video.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "views" },
});
(__VLS_ctx.formatNumber(__VLS_ctx.video.views));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "date" },
});
(__VLS_ctx.formatDate(__VLS_ctx.video.createdAt));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_10 = {}.NButtonGroup;
/** @type {[typeof __VLS_components.NButtonGroup, typeof __VLS_components.nButtonGroup, typeof __VLS_components.NButtonGroup, typeof __VLS_components.nButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
const __VLS_14 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    ...{ 'onClick': {} },
    quaternary: true,
    type: (__VLS_ctx.isLiked ? 'primary' : 'default'),
}));
const __VLS_16 = __VLS_15({
    ...{ 'onClick': {} },
    quaternary: true,
    type: (__VLS_ctx.isLiked ? 'primary' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_18;
let __VLS_19;
let __VLS_20;
const __VLS_21 = {
    onClick: (__VLS_ctx.handleLike)
};
__VLS_17.slots.default;
{
    const { icon: __VLS_thisSlot } = __VLS_17.slots;
    const __VLS_22 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_25.slots.default;
    const __VLS_26 = {}.ThumbsUp;
    /** @type {[typeof __VLS_components.ThumbsUp, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
    const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
    var __VLS_25;
}
(__VLS_ctx.formatNumber(__VLS_ctx.video.likes));
var __VLS_17;
const __VLS_30 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    ...{ 'onClick': {} },
    quaternary: true,
    type: (__VLS_ctx.isFavorited ? 'primary' : 'default'),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClick': {} },
    quaternary: true,
    type: (__VLS_ctx.isFavorited ? 'primary' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onClick: (__VLS_ctx.handleFavorite)
};
__VLS_33.slots.default;
{
    const { icon: __VLS_thisSlot } = __VLS_33.slots;
    const __VLS_38 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
    const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
    __VLS_41.slots.default;
    const __VLS_42 = {}.Bookmark;
    /** @type {[typeof __VLS_components.Bookmark, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({}));
    const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
    var __VLS_41;
}
(__VLS_ctx.formatNumber(__VLS_ctx.video.favorites));
var __VLS_33;
const __VLS_46 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    quaternary: true,
}));
const __VLS_48 = __VLS_47({
    quaternary: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
{
    const { icon: __VLS_thisSlot } = __VLS_49.slots;
    const __VLS_50 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({}));
    const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
    __VLS_53.slots.default;
    const __VLS_54 = {}.Share;
    /** @type {[typeof __VLS_components.Share, ]} */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
    const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
    var __VLS_53;
}
var __VLS_49;
var __VLS_13;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-header" },
});
const __VLS_58 = {}.NAvatar;
/** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    round: true,
    size: (48),
    src: (__VLS_ctx.video.author.avatar),
    fallbackSrc: (__VLS_ctx.fallbackAvatar),
}));
const __VLS_60 = __VLS_59({
    round: true,
    size: (48),
    src: (__VLS_ctx.video.author.avatar),
    fallbackSrc: (__VLS_ctx.fallbackAvatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "author-name" },
});
(__VLS_ctx.video.author.nickname);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "author-bio" },
});
(__VLS_ctx.video.author.description);
const __VLS_62 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.isSubscribed ? 'primary' : 'default'),
}));
const __VLS_64 = __VLS_63({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.isSubscribed ? 'primary' : 'default'),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_66;
let __VLS_67;
let __VLS_68;
const __VLS_69 = {
    onClick: (__VLS_ctx.handleSubscribe)
};
__VLS_65.slots.default;
(__VLS_ctx.isSubscribed ? '已关注' : '关注');
var __VLS_65;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "author-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.formatNumber(__VLS_ctx.video.author.followersCount || 0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.formatNumber(__VLS_ctx.video.author.followingCount || 0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.formatNumber(__VLS_ctx.video.views));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "description" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.video.description);
if (__VLS_ctx.video.tags?.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tags" },
    });
    for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.video.tags))) {
        const __VLS_70 = {}.NTag;
        /** @type {[typeof __VLS_components.NTag, typeof __VLS_components.nTag, typeof __VLS_components.NTag, typeof __VLS_components.nTag, ]} */ ;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
            key: (tag),
            size: "small",
            round: true,
        }));
        const __VLS_72 = __VLS_71({
            key: (tag),
            size: "small",
            round: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        __VLS_73.slots.default;
        (tag);
        var __VLS_73;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comments" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "comments-title" },
});
(__VLS_ctx.formatNumber(__VLS_ctx.video.comments));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-input" },
});
const __VLS_74 = {}.NAvatar;
/** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    round: true,
    size: (40),
    src: (__VLS_ctx.userAvatar),
    fallbackSrc: (__VLS_ctx.fallbackUserAvatar),
}));
const __VLS_76 = __VLS_75({
    round: true,
    size: (40),
    src: (__VLS_ctx.userAvatar),
    fallbackSrc: (__VLS_ctx.fallbackUserAvatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const __VLS_78 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    ...{ 'onKeydown': {} },
    value: (__VLS_ctx.commentText),
    type: "textarea",
    placeholder: "添加评论...",
    autosize: ({ minRows: 2, maxRows: 6 }),
}));
const __VLS_80 = __VLS_79({
    ...{ 'onKeydown': {} },
    value: (__VLS_ctx.commentText),
    type: "textarea",
    placeholder: "添加评论...",
    autosize: ({ minRows: 2, maxRows: 6 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_82;
let __VLS_83;
let __VLS_84;
const __VLS_85 = {
    onKeydown: (__VLS_ctx.handleComment)
};
var __VLS_81;
const __VLS_86 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.commentText.trim()),
}));
const __VLS_88 = __VLS_87({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.commentText.trim()),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
let __VLS_90;
let __VLS_91;
let __VLS_92;
const __VLS_93 = {
    onClick: (__VLS_ctx.handleComment)
};
__VLS_89.slots.default;
var __VLS_89;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-list" },
});
for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (comment.id),
        ...{ class: "comment-item" },
    });
    const __VLS_94 = {}.NAvatar;
    /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        round: true,
        size: (40),
        src: (comment.author.avatar),
        fallbackSrc: (__VLS_ctx.getFallbackAvatar(comment.author.id)),
    }));
    const __VLS_96 = __VLS_95({
        round: true,
        size: (40),
        src: (comment.author.avatar),
        fallbackSrc: (__VLS_ctx.getFallbackAvatar(comment.author.id)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "comment-author" },
    });
    (comment.author.nickname);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "comment-date" },
    });
    (__VLS_ctx.formatDate(comment.createdAt));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "comment-text" },
    });
    (comment.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-actions" },
    });
    const __VLS_98 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        quaternary: true,
        size: "small",
    }));
    const __VLS_100 = __VLS_99({
        quaternary: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    {
        const { icon: __VLS_thisSlot } = __VLS_101.slots;
        const __VLS_102 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({}));
        const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
        __VLS_105.slots.default;
        const __VLS_106 = {}.ThumbsUp;
        /** @type {[typeof __VLS_components.ThumbsUp, ]} */ ;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({}));
        const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
        var __VLS_105;
    }
    (__VLS_ctx.formatNumber(comment.likes));
    var __VLS_101;
    const __VLS_110 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
        quaternary: true,
        size: "small",
    }));
    const __VLS_112 = __VLS_111({
        quaternary: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    {
        const { icon: __VLS_thisSlot } = __VLS_113.slots;
        const __VLS_114 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({}));
        const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
        __VLS_117.slots.default;
        const __VLS_118 = {}.Chatbubble;
        /** @type {[typeof __VLS_components.Chatbubble, ]} */ ;
        // @ts-ignore
        const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({}));
        const __VLS_120 = __VLS_119({}, ...__VLS_functionalComponentArgsRest(__VLS_119));
        var __VLS_117;
    }
    var __VLS_113;
}
if (__VLS_ctx.hasMoreComments) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "load-more" },
    });
    const __VLS_122 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loadingMore),
        disabled: (__VLS_ctx.loadingMore),
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loadingMore),
        disabled: (__VLS_ctx.loadingMore),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_126;
    let __VLS_127;
    let __VLS_128;
    const __VLS_129 = {
        onClick: (__VLS_ctx.loadMoreComments)
    };
    __VLS_125.slots.default;
    var __VLS_125;
}
/** @type {__VLS_StyleScopedClasses['video-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['video-info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
/** @type {__VLS_StyleScopedClasses['views']} */ ;
/** @type {__VLS_StyleScopedClasses['date']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['author-info']} */ ;
/** @type {__VLS_StyleScopedClasses['author-header']} */ ;
/** @type {__VLS_StyleScopedClasses['author-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['author-bio']} */ ;
/** @type {__VLS_StyleScopedClasses['author-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['description']} */ ;
/** @type {__VLS_StyleScopedClasses['tags']} */ ;
/** @type {__VLS_StyleScopedClasses['comments']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-title']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-content']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-header']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-author']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-date']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NButton: NButton,
            NButtonGroup: NButtonGroup,
            NIcon: NIcon,
            NInput: NInput,
            NAvatar: NAvatar,
            NTag: NTag,
            ThumbsUp: ThumbsUp,
            Bookmark: Bookmark,
            Share: Share,
            Chatbubble: Chatbubble,
            VideoPlayer: VideoPlayer,
            currentTime: currentTime,
            isLiked: isLiked,
            isFavorited: isFavorited,
            isSubscribed: isSubscribed,
            commentText: commentText,
            comments: comments,
            loadingMore: loadingMore,
            hasMoreComments: hasMoreComments,
            userAvatar: userAvatar,
            fallbackAvatar: fallbackAvatar,
            fallbackUserAvatar: fallbackUserAvatar,
            handleTimeUpdate: handleTimeUpdate,
            handlePlay: handlePlay,
            handlePause: handlePause,
            handleEnded: handleEnded,
            handleLike: handleLike,
            handleFavorite: handleFavorite,
            handleSubscribe: handleSubscribe,
            handleComment: handleComment,
            loadMoreComments: loadMoreComments,
            formatNumber: formatNumber,
            formatDate: formatDate,
            getFallbackAvatar: getFallbackAvatar,
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
//# sourceMappingURL=VideoDetail.vue.js.map