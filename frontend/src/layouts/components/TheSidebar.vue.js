/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { NIcon, NAvatar } from 'naive-ui';
import { Home as HomeIcon, Compass as DiscoverIcon, People as FollowingIcon, CloudUpload as UploadIcon, Bookmark as FavoritesIcon, Settings as SettingsIcon, ChevronBack as CollapseIcon, ChevronForward as ExpandIcon } from '@vicons/ionicons5';
import { useUserStore } from '@/stores/user';
const route = useRoute();
const userStore = useUserStore();
// 菜单项配置
const menuItems = [
    { name: '首页', path: '/', icon: HomeIcon },
    { name: '发现', path: '/discover', icon: DiscoverIcon },
    { name: '关注', path: '/following', icon: FollowingIcon },
    { name: '上传', path: '/upload', icon: UploadIcon },
    { name: '收藏夹', path: '/favorites', icon: FavoritesIcon },
    { name: '设置', path: '/settings', icon: SettingsIcon }
];
// 响应式状态
const isCollapsed = ref(false);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userAvatar = computed(() => userStore.user?.avatar);
const userNickname = computed(() => userStore.user?.nickname);
const userBio = computed(() => userStore.user?.bio);
const defaultAvatar = '/images/default-avatar.png';
// 方法
const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
};
const isActive = (path) => {
    return route.path === path;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['the-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['the-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['the-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['is-collapsed']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "the-sidebar" },
    ...{ class: ({ 'is-collapsed': __VLS_ctx.isCollapsed }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sidebar-content" },
});
if (__VLS_ctx.isLoggedIn) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-info" },
    });
    const __VLS_0 = {}.NAvatar;
    /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        src: (__VLS_ctx.userAvatar),
        fallbackSrc: (__VLS_ctx.defaultAvatar),
        round: true,
        size: "large",
    }));
    const __VLS_2 = __VLS_1({
        src: (__VLS_ctx.userAvatar),
        fallbackSrc: (__VLS_ctx.defaultAvatar),
        round: true,
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (!__VLS_ctx.isCollapsed) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "user-details" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "username" },
        });
        (__VLS_ctx.userNickname);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "user-bio" },
        });
        (__VLS_ctx.userBio);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "nav-menu" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.menuItems))) {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (item.path),
        to: (item.path),
        ...{ class: "nav-item" },
        ...{ class: ({ active: __VLS_ctx.isActive(item.path) }) },
        title: (__VLS_ctx.isCollapsed ? item.name : ''),
    }));
    const __VLS_6 = __VLS_5({
        key: (item.path),
        to: (item.path),
        ...{ class: "nav-item" },
        ...{ class: ({ active: __VLS_ctx.isActive(item.path) }) },
        title: (__VLS_ctx.isCollapsed ? item.name : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.NIcon;
    /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        size: "20",
    }));
    const __VLS_10 = __VLS_9({
        size: "20",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = ((item.icon));
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_11;
    if (!__VLS_ctx.isCollapsed) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.name);
    }
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleCollapse) },
    ...{ class: "collapse-btn" },
});
const __VLS_16 = {}.NIcon;
/** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    size: "20",
}));
const __VLS_18 = __VLS_17({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = ((__VLS_ctx.isCollapsed ? __VLS_ctx.ExpandIcon : __VLS_ctx.CollapseIcon));
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
/** @type {__VLS_StyleScopedClasses['the-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['is-collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-content']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['user-details']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['user-bio']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NIcon: NIcon,
            NAvatar: NAvatar,
            CollapseIcon: CollapseIcon,
            ExpandIcon: ExpandIcon,
            menuItems: menuItems,
            isCollapsed: isCollapsed,
            isLoggedIn: isLoggedIn,
            userAvatar: userAvatar,
            userNickname: userNickname,
            userBio: userBio,
            defaultAvatar: defaultAvatar,
            toggleCollapse: toggleCollapse,
            isActive: isActive,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TheSidebar.vue.js.map