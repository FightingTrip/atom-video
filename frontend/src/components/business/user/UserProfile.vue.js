/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUser } from '@/composables/useUser';
import { useVideo } from '@/composables/useVideo';
import Avatar from '@/components/common/avatar/Avatar.vue';
import Button from '@/components/common/button/Button.vue';
import VideoGrid from '@/components/common/video/VideoGrid.vue';
import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
import EmptyState from '@/components/common/feedback/EmptyState.vue';
const router = useRouter();
const route = useRoute();
// 状态
const loading = ref(false);
const error = ref(null);
const user = ref(null);
const videos = ref([]);
const currentPage = ref(1);
const hasMore = ref(true);
// 组合式函数
const { fetchUserProfile, updateUserProfile, toggleFollow } = useUser();
const { fetchUserVideos } = useVideo();
// 计算属性
const isCurrentUser = computed(() => {
    return user.value?.id === route.params.id;
});
// 方法
const handleAvatarUpload = () => {
    // TODO: 实现头像上传功能
};
const handleEditProfile = () => {
    router.push('/settings/profile');
};
const handleFollowToggle = async () => {
    if (!user.value)
        return;
    try {
        await toggleFollow(user.value.id);
        user.value.isFollowing = !user.value.isFollowing;
        user.value.followerCount += user.value.isFollowing ? 1 : -1;
    }
    catch (err) {
        error.value = '操作失败';
        console.error('关注/取消关注失败:', err);
    }
};
const handleVideoClick = (video) => {
    router.push(`/video/${video.id}`);
};
const loadMore = async () => {
    if (loading.value || !hasMore.value)
        return;
    try {
        loading.value = true;
        error.value = null;
        currentPage.value++;
        const result = await fetchUserVideos({
            userId: user.value?.id,
            page: currentPage.value,
            pageSize: 12,
        });
        videos.value.push(...result);
        hasMore.value = result.length === 12;
    }
    catch (err) {
        error.value = '加载更多失败';
        console.error('加载更多失败:', err);
    }
    finally {
        loading.value = false;
    }
};
// 初始化
onMounted(async () => {
    try {
        loading.value = true;
        error.value = null;
        // 获取用户信息
        const userId = route.params.id;
        user.value = await fetchUserProfile(userId);
        // 获取用户视频
        const result = await fetchUserVideos({
            userId,
            page: 1,
            pageSize: 12,
        });
        videos.value = result;
        hasMore.value = result.length === 12;
    }
    catch (err) {
        error.value = '加载用户信息失败';
        console.error('加载用户信息失败:', err);
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-profile" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "profile-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-container" },
});
/** @type {[typeof Avatar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Avatar, new Avatar({
    src: (__VLS_ctx.user.avatarUrl),
    size: (120),
}));
const __VLS_1 = __VLS_0({
    src: (__VLS_ctx.user.avatarUrl),
    size: (120),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
if (__VLS_ctx.isCurrentUser) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar-upload" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onClick: (__VLS_ctx.handleAvatarUpload)
    };
    __VLS_5.slots.default;
    var __VLS_5;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "username" },
});
(__VLS_ctx.user.username);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "bio" },
});
(__VLS_ctx.user.bio || '这个人很懒，什么都没写~');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.user.videoCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.user.followerCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.user.followingCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "profile-actions" },
});
if (__VLS_ctx.isCurrentUser) {
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
    }));
    const __VLS_11 = __VLS_10({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    let __VLS_13;
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = {
        onClick: (__VLS_ctx.handleEditProfile)
    };
    __VLS_12.slots.default;
    var __VLS_12;
}
else {
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        type: (__VLS_ctx.user.isFollowing ? 'secondary' : 'primary'),
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        type: (__VLS_ctx.user.isFollowing ? 'secondary' : 'primary'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.handleFollowToggle)
    };
    __VLS_19.slots.default;
    (__VLS_ctx.user.isFollowing ? '取消关注' : '关注');
    var __VLS_19;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "user-videos" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
/** @type {[typeof VideoGrid, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(VideoGrid, new VideoGrid({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.videos),
    loading: (__VLS_ctx.loading),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onVideoClick': {} },
    videos: (__VLS_ctx.videos),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    onVideoClick: (__VLS_ctx.handleVideoClick)
};
var __VLS_26;
if (__VLS_ctx.hasMore) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "load-more" },
    });
    /** @type {[typeof Button, typeof Button, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(Button, new Button({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_34;
    let __VLS_35;
    let __VLS_36;
    const __VLS_37 = {
        onClick: (__VLS_ctx.loadMore)
    };
    __VLS_33.slots.default;
    var __VLS_33;
}
if (__VLS_ctx.loading && !__VLS_ctx.videos.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-container" },
    });
    /** @type {[typeof LoadingSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(LoadingSpinner, new LoadingSpinner({}));
    const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-container" },
    });
    /** @type {[typeof ErrorMessage, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(ErrorMessage, new ErrorMessage({
        message: (__VLS_ctx.error),
    }));
    const __VLS_42 = __VLS_41({
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
}
if (!__VLS_ctx.loading && !__VLS_ctx.error && !__VLS_ctx.videos.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-container" },
    });
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        message: "暂无视频",
    }));
    const __VLS_45 = __VLS_44({
        message: "暂无视频",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
}
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['bio']} */ ;
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['user-videos']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Avatar: Avatar,
            Button: Button,
            VideoGrid: VideoGrid,
            LoadingSpinner: LoadingSpinner,
            ErrorMessage: ErrorMessage,
            EmptyState: EmptyState,
            loading: loading,
            error: error,
            user: user,
            videos: videos,
            hasMore: hasMore,
            isCurrentUser: isCurrentUser,
            handleAvatarUpload: handleAvatarUpload,
            handleEditProfile: handleEditProfile,
            handleFollowToggle: handleFollowToggle,
            handleVideoClick: handleVideoClick,
            loadMore: loadMore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=UserProfile.vue.js.map