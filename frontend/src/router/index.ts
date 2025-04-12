import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { RouteRecordRaw } from 'vue-router';
// 导入管理员路由
import adminRoutes from './modules/admin';
// 导入权限守卫
import { permissionGuard } from './guards/permission';

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/feed/HomePage.vue'),
        meta: {
          title: '首页 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: '/feed/explore',
        name: 'explore',
        component: () => import('@/pages/feed/ExplorePage.vue'),
        meta: {
          title: '发现 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: '/feed/trending',
        name: 'trending',
        component: () => import('@/pages/feed/TrendingPage.vue'),
        meta: {
          title: '热门 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: '/video/upload',
        name: 'video-upload',
        component: () => import('@/pages/video/VideoUploadPage.vue'),
        meta: {
          title: '上传视频 - Atom Video',
          requiresAuth: true,
        },
      },
      {
        path: '/video/:id',
        name: 'video-detail',
        component: () => import('@/pages/video/VideoDetailPage.vue'),
        props: true,
        meta: {
          title: '视频详情 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: '/channel/:id',
        name: 'channel',
        component: () => import('@/pages/channel/ChannelPage.vue'),
        meta: {
          title: '频道 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/pages/search/SearchResultsPage.vue'),
        meta: {
          title: '搜索结果 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: '/library',
        name: 'library',
        component: () => import('@/pages/library/LibraryPage.vue'),
        meta: {
          title: '我的收藏 - Atom Video',
          requiresAuth: true,
        },
      },
      {
        path: '/library/history',
        name: 'history',
        component: () => import('@/pages/library/HistoryPage.vue'),
        meta: {
          title: '观看历史 - Atom Video',
          requiresAuth: true,
        },
      },
      {
        path: '/user/settings',
        name: 'user-settings',
        component: () => import('@/pages/user/SettingsPage.vue'),
        meta: {
          title: '用户设置 - Atom Video',
          requiresAuth: true,
        },
      },
      {
        path: '/user/:id',
        name: 'user-profile',
        component: () => import('@/pages/user/ProfilePage.vue'),
        meta: {
          title: '用户资料 - Atom Video',
          requiresAuth: false,
        },
      },
      // 各种explore路径
      {
        path: '/explore/:category',
        name: 'explore-category',
        component: () => import('@/pages/explore/ExploreCategoryPage.vue'),
        meta: {
          title: '探索 - Atom Video',
          requiresAuth: false,
        },
      },
      // 权限演示页面
      {
        path: '/permission-demo',
        name: 'permission-demo',
        component: () => import('@/pages/feed/PermissionDemoPage.vue'),
        meta: {
          title: '权限演示 - Atom Video',
          requiresAuth: false,
        },
      },
      // 创作者中心路由
      {
        path: '/creator/studio',
        name: 'creator-studio',
        component: () => import('@/pages/creator/StudioPage.vue'),
        meta: {
          title: '创作者工作室 - Atom Video',
          requiresAuth: true,
          roles: ['ADMIN', 'CREATOR'],
        },
      },
      // 404页面
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/error/NotFoundPage.vue'),
        meta: {
          title: '页面未找到 - Atom Video',
          requiresAuth: false,
        },
      },
    ],
  },
  // 认证页面 - 使用BlankLayout，没有顶部和侧边栏
  {
    path: '/auth',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
          title: '登录 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
        meta: {
          title: '注册 - Atom Video',
          requiresAuth: false,
        },
      },
    ],
  },
  // 添加管理员路由
  ...adminRoutes,
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  console.log('[Router] beforeEach', {
    to: {
      path: to.path,
      name: to.name,
      fullPath: to.fullPath,
      matched: to.matched.map(record => ({
        path: record.path,
        name: record.name,
        component: record.components?.default?.name || 'Anonymous Component',
      })),
    },
    isAuthRequired: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
  });

  // 设置页面标题
  document.title = `${to.meta.title}` || 'Atom Video';

  // 处理需要登录的页面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router] 重定向到登录页面，因为需要认证');
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // 处理游客页面（已登录用户不能访问）
  if (to.meta.guest && authStore.isAuthenticated) {
    console.log('[Router] 重定向到首页，因为用户已登录');
    next('/');
    return;
  }

  // 使用权限守卫检查角色权限
  if (to.meta.roles && to.meta.roles.length > 0) {
    return permissionGuard(to, from, next);
  }

  // 继续路由处理
  console.log('[Router] 继续导航到', to.path);
  next();
});

// 路由后置钩子 - 用于调试
router.afterEach((to, from) => {
  console.log('[Router] afterEach', {
    navigatedTo: to.path,
    fromPath: from.path,
  });
});

export default router;
