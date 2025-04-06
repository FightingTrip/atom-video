/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NInput, NIcon, NDropdown, NAvatar, NButton } from 'naive-ui';
import { Search as SearchIcon } from '@vicons/ionicons5';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import { useUserStore } from '@/stores/user';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
// 导航菜单项
const navItems = [
    { name: '首页', path: '/' },
    { name: '发现', path: '/discover' },
    { name: '关注', path: '/following' },
    { name: '上传', path: '/upload' }
];
// 用户菜单选项
const userMenuOptions = [
    {
        label: '个人中心',
        key: 'profile'
    },
    {
        label: '我的视频',
        key: 'videos'
    },
    {
        label: '收藏夹',
        key: 'favorites'
    },
    {
        label: '设置',
        key: 'settings'
    },
    {
        type: 'divider',
        key: 'divider'
    },
    {
        label: '退出登录',
        key: 'logout'
    }
];
// 响应式状态
const isMobile = computed(() => window.innerWidth < 768);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userAvatar = computed(() => userStore.user?.avatar);
const defaultAvatar = '/images/default-avatar.png';
// 搜索相关
const searchQuery = ref('');
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
            path: '/search',
            query: { q: searchQuery.value }
        });
    }
};
// 用户菜单相关
const handleUserMenuSelect = (key) => {
    switch (key) {
        case 'profile':
            router.push('/profile');
            break;
        case 'videos':
            router.push('/my-videos');
            break;
        case 'favorites':
            router.push('/favorites');
            break;
        case 'settings':
            router.push('/settings');
            break;
        case 'logout':
            userStore.logout();
            router.push('/login');
            break;
    }
};
// 登录注册相关
const handleLogin = () => {
    router.push('/login');
};
const handleRegister = () => {
    router.push('/register');
};
// 导航激活状态
const isActive = (path) => {
    return route.path === path;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "the-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-left" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "logo" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "@/assets/logo.svg",
    alt: "Atom Video",
});
var __VLS_3;
if (!__VLS_ctx.isMobile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
        ...{ class: "nav-menu" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navItems))) {
        const __VLS_4 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            key: (item.path),
            to: (item.path),
            ...{ class: "nav-item" },
            ...{ class: ({ active: __VLS_ctx.isActive(item.path) }) },
        }));
        const __VLS_6 = __VLS_5({
            key: (item.path),
            to: (item.path),
            ...{ class: "nav-item" },
            ...{ class: ({ active: __VLS_ctx.isActive(item.path) }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_7.slots.default;
        (item.name);
        var __VLS_7;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-right" },
});
if (!__VLS_ctx.isMobile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "search-box" },
    });
    const __VLS_8 = {}.NInput;
    /** @type {[typeof __VLS_components.NInput, typeof __VLS_components.nInput, typeof __VLS_components.NInput, typeof __VLS_components.nInput, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onKeydown': {} },
        value: (__VLS_ctx.searchQuery),
        placeholder: "搜索视频...",
        clearable: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onKeydown': {} },
        value: (__VLS_ctx.searchQuery),
        placeholder: "搜索视频...",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onKeydown: (__VLS_ctx.handleSearch)
    };
    __VLS_11.slots.default;
    {
        const { prefix: __VLS_thisSlot } = __VLS_11.slots;
        const __VLS_16 = {}.NIcon;
        /** @type {[typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, typeof __VLS_components.NIcon, typeof __VLS_components.nIcon, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
        const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        const __VLS_20 = {}.SearchIcon;
        /** @type {[typeof __VLS_components.SearchIcon, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
        const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
        var __VLS_19;
    }
    var __VLS_11;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-menu" },
});
if (__VLS_ctx.isLoggedIn) {
    const __VLS_24 = {}.NDropdown;
    /** @type {[typeof __VLS_components.NDropdown, typeof __VLS_components.nDropdown, typeof __VLS_components.NDropdown, typeof __VLS_components.nDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onSelect': {} },
        options: (__VLS_ctx.userMenuOptions),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onSelect': {} },
        options: (__VLS_ctx.userMenuOptions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onSelect: (__VLS_ctx.handleUserMenuSelect)
    };
    __VLS_27.slots.default;
    const __VLS_32 = {}.NAvatar;
    /** @type {[typeof __VLS_components.NAvatar, typeof __VLS_components.nAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        src: (__VLS_ctx.userAvatar),
        fallbackSrc: (__VLS_ctx.defaultAvatar),
        round: true,
        size: "medium",
    }));
    const __VLS_34 = __VLS_33({
        src: (__VLS_ctx.userAvatar),
        fallbackSrc: (__VLS_ctx.defaultAvatar),
        round: true,
        size: "medium",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    var __VLS_27;
}
else {
    const __VLS_36 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        quaternary: true,
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        quaternary: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.handleLogin)
    };
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_44 = {}.NButton;
    /** @type {[typeof __VLS_components.NButton, typeof __VLS_components.nButton, typeof __VLS_components.NButton, typeof __VLS_components.nButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onClick: (__VLS_ctx.handleRegister)
    };
    __VLS_47.slots.default;
    var __VLS_47;
}
/** @type {[typeof ThemeToggle, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(ThemeToggle, new ThemeToggle({
    ...{ class: "theme-toggle" },
}));
const __VLS_53 = __VLS_52({
    ...{ class: "theme-toggle" },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
/** @type {__VLS_StyleScopedClasses['the-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['user-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-toggle']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            NInput: NInput,
            NIcon: NIcon,
            NDropdown: NDropdown,
            NAvatar: NAvatar,
            NButton: NButton,
            SearchIcon: SearchIcon,
            ThemeToggle: ThemeToggle,
            navItems: navItems,
            userMenuOptions: userMenuOptions,
            isMobile: isMobile,
            isLoggedIn: isLoggedIn,
            userAvatar: userAvatar,
            defaultAvatar: defaultAvatar,
            searchQuery: searchQuery,
            handleSearch: handleSearch,
            handleUserMenuSelect: handleUserMenuSelect,
            handleLogin: handleLogin,
            handleRegister: handleRegister,
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
//# sourceMappingURL=TheHeader.vue.js.map