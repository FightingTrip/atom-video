/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { NAvatar, NInput, NButton, NIcon } from 'naive-ui';
import { ThumbsUp, ThumbsUpOutline } from '@vicons/ionicons5';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
const props = defineProps();
const emit = defineEmits();
const authStore = useAuthStore();
const userAvatar = computed(() => authStore.user?.avatar || '/default-avatar.png');
// 状态管理
const commentText = ref('');
const replyText = ref('');
const replyingTo = ref(null);
// 格式化时间
const formatTime = (date) => {
    return dayjs(date).fromNow();
};
// 格式化数字
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
};
// 提交评论
const submitComment = () => {
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
                user: { nickname: replyTo.user.nickname }
            }
            : undefined
    };
    replyText.value = replyTo ? `@${replyTo.user.nickname} ` : '';
};
// 提交回复
const submitReply = () => {
    if (!replyingTo.value)
        return;
    const content = replyText.value.trim();
    if (!content)
        return;
    emit('reply', replyingTo.value.id, content, replyingTo.value.replyTo?.id);
    cancelReply();
};
// 取消回复
const cancelReply = () => {
    replyingTo.value = null;
    replyText.value = '';
};
// 处理点赞
const handleLike = (comment) => {
    emit('like', comment.id);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['user-link']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-input-container" },
});
const __VLS_0 = {}.NAvatar;
/** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    src: (__VLS_ctx.userAvatar),
    round: (true),
    ...{ class: "user-avatar" },
}));
const __VLS_2 = __VLS_1({
    src: (__VLS_ctx.userAvatar),
    round: (true),
    ...{ class: "user-avatar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-input-wrapper" },
});
const __VLS_4 = {}.NInput;
/** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    value: (__VLS_ctx.commentText),
    type: "textarea",
    placeholder: "添加评论...",
    autosize: ({ minRows: 2, maxRows: 6 }),
    ...{ class: "comment-textarea" },
}));
const __VLS_6 = __VLS_5({
    value: (__VLS_ctx.commentText),
    type: "textarea",
    placeholder: "添加评论...",
    autosize: ({ minRows: 2, maxRows: 6 }),
    ...{ class: "comment-textarea" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-actions" },
});
const __VLS_8 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    ...{ class: "cancel-button" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    ...{ class: "cancel-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (...[$event]) => {
        __VLS_ctx.commentText = '';
    }
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.NButton;
/** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.commentText.trim()),
    ...{ class: "submit-button" },
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.commentText.trim()),
    ...{ class: "submit-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.submitComment)
};
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-list" },
});
for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (comment.id),
        ...{ class: "comment-item" },
    });
    const __VLS_24 = {}.NAvatar;
    /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        src: (comment.user.avatar),
        round: (true),
        ...{ class: "user-avatar" },
    }));
    const __VLS_26 = __VLS_25({
        src: (comment.user.avatar),
        round: (true),
        ...{ class: "user-avatar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-header" },
    });
    const __VLS_28 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        to: (`/user/${comment.user.id}`),
        ...{ class: "user-link" },
    }));
    const __VLS_30 = __VLS_29({
        to: (`/user/${comment.user.id}`),
        ...{ class: "user-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    (comment.user.nickname);
    var __VLS_31;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "timestamp" },
    });
    (__VLS_ctx.formatTime(comment.createdAt));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "comment-text" },
    });
    (comment.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleLike(comment);
            } },
        ...{ class: "action-button" },
    });
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
    (__VLS_ctx.formatNumber(comment.likes));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleReply(comment);
            } },
        ...{ class: "action-button" },
    });
    if (__VLS_ctx.replyingTo?.id === comment.id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "reply-input-container" },
        });
        const __VLS_44 = {}.NInput;
        /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            value: (__VLS_ctx.replyText),
            type: "textarea",
            placeholder: "回复评论...",
            autosize: ({ minRows: 2, maxRows: 4 }),
            ...{ class: "reply-textarea" },
        }));
        const __VLS_46 = __VLS_45({
            value: (__VLS_ctx.replyText),
            type: "textarea",
            placeholder: "回复评论...",
            autosize: ({ minRows: 2, maxRows: 4 }),
            ...{ class: "reply-textarea" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "reply-actions" },
        });
        const __VLS_48 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ 'onClick': {} },
            ...{ class: "cancel-button" },
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onClick': {} },
            ...{ class: "cancel-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_52;
        let __VLS_53;
        let __VLS_54;
        const __VLS_55 = {
            onClick: (__VLS_ctx.cancelReply)
        };
        __VLS_51.slots.default;
        var __VLS_51;
        const __VLS_56 = {}.NButton;
        /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.replyText.trim()),
            ...{ class: "submit-button" },
        }));
        const __VLS_58 = __VLS_57({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.replyText.trim()),
            ...{ class: "submit-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        let __VLS_60;
        let __VLS_61;
        let __VLS_62;
        const __VLS_63 = {
            onClick: (__VLS_ctx.submitReply)
        };
        __VLS_59.slots.default;
        var __VLS_59;
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
            const __VLS_64 = {}.NAvatar;
            /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                src: (reply.user.avatar),
                round: (true),
                size: (32),
                ...{ class: "user-avatar-small" },
            }));
            const __VLS_66 = __VLS_65({
                src: (reply.user.avatar),
                round: (true),
                size: (32),
                ...{ class: "user-avatar-small" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "reply-content" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "reply-header" },
            });
            const __VLS_68 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                to: (`/user/${reply.user.id}`),
                ...{ class: "user-link" },
            }));
            const __VLS_70 = __VLS_69({
                to: (`/user/${reply.user.id}`),
                ...{ class: "user-link" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            __VLS_71.slots.default;
            (reply.user.nickname);
            var __VLS_71;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "timestamp" },
            });
            (__VLS_ctx.formatTime(reply.createdAt));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "reply-text" },
            });
            (reply.content);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "reply-actions" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(comment.replies?.length))
                            return;
                        __VLS_ctx.handleLike(reply);
                    } },
                ...{ class: "action-button" },
            });
            const __VLS_72 = {}.NIcon;
            /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
            const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
            __VLS_75.slots.default;
            if (reply.isLiked) {
                const __VLS_76 = {}.ThumbsUp;
                /** @type {[typeof __VLS_components.ThumbsUp, ]} */ ;
                // @ts-ignore
                const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
                const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
            }
            else {
                const __VLS_80 = {}.ThumbsUpOutline;
                /** @type {[typeof __VLS_components.ThumbsUpOutline, ]} */ ;
                // @ts-ignore
                const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
                const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
            }
            var __VLS_75;
            (__VLS_ctx.formatNumber(reply.likes));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(comment.replies?.length))
                            return;
                        __VLS_ctx.handleReply(comment, reply);
                    } },
                ...{ class: "action-button" },
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['comment-section']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-content']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-header']} */ ;
/** @type {__VLS_StyleScopedClasses['user-link']} */ ;
/** @type {__VLS_StyleScopedClasses['timestamp']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-list']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-item']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar-small']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-content']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-header']} */ ;
/** @type {__VLS_StyleScopedClasses['user-link']} */ ;
/** @type {__VLS_StyleScopedClasses['timestamp']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-text']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['action-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NAvatar: NAvatar,
            NInput: NInput,
            NButton: NButton,
            NIcon: NIcon,
            ThumbsUp: ThumbsUp,
            ThumbsUpOutline: ThumbsUpOutline,
            userAvatar: userAvatar,
            commentText: commentText,
            replyText: replyText,
            replyingTo: replyingTo,
            formatTime: formatTime,
            formatNumber: formatNumber,
            submitComment: submitComment,
            handleReply: handleReply,
            submitReply: submitReply,
            cancelReply: cancelReply,
            handleLike: handleLike,
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
//# sourceMappingURL=CommentSection.vue.js.map