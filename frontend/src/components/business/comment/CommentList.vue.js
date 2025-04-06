/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import { NInput, NButton, NAvatar, NIcon, NSpin, NEmpty } from 'naive-ui';
import { ThumbsUp, ThumbsUpOutline, ChatbubbleOutline } from '@vicons/ionicons5';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
const props = withDefaults(defineProps(), {
    loading: false,
    hasMore: false
});
const emit = defineEmits();
const router = useRouter();
// 状态管理
const commentText = ref('');
const replyText = ref('');
const replyingTo = ref(null);
// 加载更多元素引用
const loadMoreRef = ref(null);
// 设置交叉观察
useIntersectionObserver(loadMoreRef, ([{ isIntersecting }]) => {
    if (isIntersecting && !props.loading && props.hasMore) {
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
// 格式化日期
const formatDate = (date) => {
    return dayjs(date).fromNow();
};
// 处理评论
const handlePostComment = () => {
    const content = commentText.value.trim();
    if (!content)
        return;
    emit('post', content);
    commentText.value = '';
};
// 处理回复
const handleReply = (comment, replyTo) => {
    replyingTo.value = {
        id: comment.id,
        replyTo: replyTo
            ? {
                id: replyTo.id,
                author: { nickname: replyTo.author.nickname }
            }
            : undefined
    };
    replyText.value = replyTo ? `@${replyTo.author.nickname} ` : '';
};
const handlePostReply = () => {
    if (!replyingTo.value)
        return;
    const content = replyText.value.trim();
    if (!content)
        return;
    emit('reply', replyingTo.value.id, content, replyingTo.value.replyTo?.id);
    cancelReply();
};
const cancelReply = () => {
    replyingTo.value = null;
    replyText.value = '';
};
// 处理点赞
const handleLike = (item) => {
    emit('like', item.id);
};
// 处理加载更多
const handleLoadMore = () => {
    if (!props.loading && props.hasMore) {
        emit('load-more');
    }
};
// 处理作者点击
const handleAuthorClick = (authorId) => {
    router.push(`/user/${authorId}`);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    loading: false,
    hasMore: false
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-input" },
});
const __VLS_0 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onKeydown': {} },
    value: (__VLS_ctx.commentText),
    type: "textarea",
    autosize: ({ minRows: 2, maxRows: 5 }),
    placeholder: "写下你的评论...",
    ...{ class: "comment-textarea" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onKeydown': {} },
    value: (__VLS_ctx.commentText),
    type: "textarea",
    autosize: ({ minRows: 2, maxRows: 5 }),
    placeholder: "写下你的评论...",
    ...{ class: "comment-textarea" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onKeydown: (__VLS_ctx.handlePostComment)
};
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "input-tip" },
});
const __VLS_8 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.commentText.trim()),
    ...{ class: "submit-button" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.commentText.trim()),
    ...{ class: "submit-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.handlePostComment)
};
__VLS_11.slots.default;
var __VLS_11;
if (__VLS_ctx.comments.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-list" },
    });
    for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (comment.id),
            ...{ class: "comment-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "comment-content" },
        });
        const __VLS_16 = {}.NAvatar;
        /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            ...{ 'onClick': {} },
            round: true,
            size: (40),
            src: (comment.author.avatar),
            ...{ class: "user-avatar" },
        }));
        const __VLS_18 = __VLS_17({
            ...{ 'onClick': {} },
            round: true,
            size: (40),
            src: (comment.author.avatar),
            ...{ class: "user-avatar" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        let __VLS_20;
        let __VLS_21;
        let __VLS_22;
        const __VLS_23 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.comments.length > 0))
                    return;
                __VLS_ctx.handleAuthorClick(comment.author.id);
            }
        };
        var __VLS_19;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "comment-main" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "comment-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.comments.length > 0))
                        return;
                    __VLS_ctx.handleAuthorClick(comment.author.id);
                } },
            ...{ class: "author-name" },
        });
        (comment.author.nickname);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "comment-time" },
        });
        (__VLS_ctx.formatDate(comment.createdAt));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "comment-text" },
        });
        (comment.content);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "comment-actions" },
        });
        const __VLS_24 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "action-button" },
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "action-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.comments.length > 0))
                    return;
                __VLS_ctx.handleLike(comment);
            }
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
            if (comment.isLiked) {
                const __VLS_36 = {}.ThumbsUp;
                /** @type {[typeof __VLS_components.ThumbsUp, ]} */ ;
                // @ts-ignore
                const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
                const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
            }
            else {
                const __VLS_40 = {}.ThumbsUpOutline;
                /** @type {[typeof __VLS_components.ThumbsUpOutline, ]} */ ;
                // @ts-ignore
                const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
                const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
            }
            var __VLS_35;
        }
        (__VLS_ctx.formatNumber(comment.likes));
        var __VLS_27;
        const __VLS_44 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "action-button" },
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "action-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_48;
        let __VLS_49;
        let __VLS_50;
        const __VLS_51 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.comments.length > 0))
                    return;
                __VLS_ctx.handleReply(comment);
            }
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
            const __VLS_56 = {}.ChatbubbleOutline;
            /** @type {[typeof __VLS_components.ChatbubbleOutline, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
            const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
            var __VLS_55;
        }
        var __VLS_47;
        if (__VLS_ctx.replyingTo?.id === comment.id) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "reply-input" },
            });
            const __VLS_60 = {}.NInput;
            /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                ...{ 'onKeydown': {} },
                value: (__VLS_ctx.replyText),
                type: "textarea",
                autosize: ({ minRows: 2, maxRows: 5 }),
                placeholder: "回复评论...",
                ...{ class: "reply-textarea" },
            }));
            const __VLS_62 = __VLS_61({
                ...{ 'onKeydown': {} },
                value: (__VLS_ctx.replyText),
                type: "textarea",
                autosize: ({ minRows: 2, maxRows: 5 }),
                placeholder: "回复评论...",
                ...{ class: "reply-textarea" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            let __VLS_64;
            let __VLS_65;
            let __VLS_66;
            const __VLS_67 = {
                onKeydown: (__VLS_ctx.handlePostReply)
            };
            var __VLS_63;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "input-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "input-tip" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "button-group" },
            });
            const __VLS_68 = {}.NButton;
            /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                ...{ 'onClick': {} },
                ...{ class: "cancel-button" },
            }));
            const __VLS_70 = __VLS_69({
                ...{ 'onClick': {} },
                ...{ class: "cancel-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            let __VLS_72;
            let __VLS_73;
            let __VLS_74;
            const __VLS_75 = {
                onClick: (__VLS_ctx.cancelReply)
            };
            __VLS_71.slots.default;
            var __VLS_71;
            const __VLS_76 = {}.NButton;
            /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                ...{ 'onClick': {} },
                type: "primary",
                disabled: (!__VLS_ctx.replyText.trim()),
                ...{ class: "submit-button" },
            }));
            const __VLS_78 = __VLS_77({
                ...{ 'onClick': {} },
                type: "primary",
                disabled: (!__VLS_ctx.replyText.trim()),
                ...{ class: "submit-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
            let __VLS_80;
            let __VLS_81;
            let __VLS_82;
            const __VLS_83 = {
                onClick: (__VLS_ctx.handlePostReply)
            };
            __VLS_79.slots.default;
            var __VLS_79;
        }
        if (comment.replies?.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "reply-list" },
            });
            for (const [reply] of __VLS_getVForSourceType((comment.replies))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (reply.id),
                    ...{ class: "reply-item" },
                });
                const __VLS_84 = {}.NAvatar;
                /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
                // @ts-ignore
                const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                    ...{ 'onClick': {} },
                    round: true,
                    size: (32),
                    src: (reply.author.avatar),
                    ...{ class: "user-avatar-small" },
                }));
                const __VLS_86 = __VLS_85({
                    ...{ 'onClick': {} },
                    round: true,
                    size: (32),
                    src: (reply.author.avatar),
                    ...{ class: "user-avatar-small" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                let __VLS_88;
                let __VLS_89;
                let __VLS_90;
                const __VLS_91 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.comments.length > 0))
                            return;
                        if (!(comment.replies?.length))
                            return;
                        __VLS_ctx.handleAuthorClick(reply.author.id);
                    }
                };
                var __VLS_87;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "reply-main" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "reply-header" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.comments.length > 0))
                                return;
                            if (!(comment.replies?.length))
                                return;
                            __VLS_ctx.handleAuthorClick(reply.author.id);
                        } },
                    ...{ class: "author-name" },
                });
                (reply.author.nickname);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "reply-time" },
                });
                (__VLS_ctx.formatDate(reply.createdAt));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "reply-text" },
                });
                (reply.content);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "reply-actions" },
                });
                const __VLS_92 = {}.NButton;
                /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
                // @ts-ignore
                const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
                    ...{ 'onClick': {} },
                    text: true,
                    ...{ class: "action-button" },
                }));
                const __VLS_94 = __VLS_93({
                    ...{ 'onClick': {} },
                    text: true,
                    ...{ class: "action-button" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_93));
                let __VLS_96;
                let __VLS_97;
                let __VLS_98;
                const __VLS_99 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.comments.length > 0))
                            return;
                        if (!(comment.replies?.length))
                            return;
                        __VLS_ctx.handleLike(reply);
                    }
                };
                __VLS_95.slots.default;
                {
                    const { icon: __VLS_thisSlot } = __VLS_95.slots;
                    const __VLS_100 = {}.NIcon;
                    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
                    const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
                    __VLS_103.slots.default;
                    if (reply.isLiked) {
                        const __VLS_104 = {}.ThumbsUp;
                        /** @type {[typeof __VLS_components.ThumbsUp, ]} */ ;
                        // @ts-ignore
                        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
                        const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
                    }
                    else {
                        const __VLS_108 = {}.ThumbsUpOutline;
                        /** @type {[typeof __VLS_components.ThumbsUpOutline, ]} */ ;
                        // @ts-ignore
                        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
                        const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
                    }
                    var __VLS_103;
                }
                (__VLS_ctx.formatNumber(reply.likes));
                var __VLS_95;
                const __VLS_112 = {}.NButton;
                /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
                // @ts-ignore
                const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
                    ...{ 'onClick': {} },
                    text: true,
                    ...{ class: "action-button" },
                }));
                const __VLS_114 = __VLS_113({
                    ...{ 'onClick': {} },
                    text: true,
                    ...{ class: "action-button" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                let __VLS_116;
                let __VLS_117;
                let __VLS_118;
                const __VLS_119 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.comments.length > 0))
                            return;
                        if (!(comment.replies?.length))
                            return;
                        __VLS_ctx.handleReply(comment, reply);
                    }
                };
                __VLS_115.slots.default;
                {
                    const { icon: __VLS_thisSlot } = __VLS_115.slots;
                    const __VLS_120 = {}.NIcon;
                    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
                    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
                    __VLS_123.slots.default;
                    const __VLS_124 = {}.ChatbubbleOutline;
                    /** @type {[typeof __VLS_components.ChatbubbleOutline, ]} */ ;
                    // @ts-ignore
                    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
                    const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
                    var __VLS_123;
                }
                var __VLS_115;
            }
        }
    }
}
if (__VLS_ctx.hasMore) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "loadMoreRef",
        ...{ class: "load-more" },
    });
    /** @type {typeof __VLS_ctx.loadMoreRef} */ ;
    if (__VLS_ctx.loading) {
        const __VLS_128 = {}.NSpin;
        /** @type {[typeof __VLS_components.NSpin, typeof __VLS_components.nSpin, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
        const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
    }
    else {
        const __VLS_132 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "load-more-button" },
        }));
        const __VLS_134 = __VLS_133({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "load-more-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        let __VLS_136;
        let __VLS_137;
        let __VLS_138;
        const __VLS_139 = {
            onClick: (__VLS_ctx.handleLoadMore)
        };
        __VLS_135.slots.default;
        var __VLS_135;
    }
}
else if (!__VLS_ctx.loading && __VLS_ctx.comments.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
    const __VLS_140 = {}.NEmpty;
    /** @type {[typeof __VLS_components.NEmpty, typeof __VLS_components.nEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        description: "暂无评论",
    }));
    const __VLS_142 = __VLS_141({
        description: "暂无评论",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
}
/** @type {__VLS_StyleScopedClasses['comment-section']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['input-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['input-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-content']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-main']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-header']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-time']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-input']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['input-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['input-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['button-group']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-list']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-item']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar-small']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-main']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-header']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-time']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-text']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NInput: NInput,
            NButton: NButton,
            NAvatar: NAvatar,
            NIcon: NIcon,
            NSpin: NSpin,
            NEmpty: NEmpty,
            ThumbsUp: ThumbsUp,
            ThumbsUpOutline: ThumbsUpOutline,
            ChatbubbleOutline: ChatbubbleOutline,
            commentText: commentText,
            replyText: replyText,
            replyingTo: replyingTo,
            loadMoreRef: loadMoreRef,
            formatNumber: formatNumber,
            formatDate: formatDate,
            handlePostComment: handlePostComment,
            handleReply: handleReply,
            handlePostReply: handlePostReply,
            cancelReply: cancelReply,
            handleLike: handleLike,
            handleLoadMore: handleLoadMore,
            handleAuthorClick: handleAuthorClick,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=CommentList.vue.js.map