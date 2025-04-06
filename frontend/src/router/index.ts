import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 路由配置
const routes = [
  {
    path: '/',
    component: () => import('@/components/layout/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/feed/HomePage.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: '/video',
        children: [
          {
            path: 'upload',
            name: 'Upload',
            component: () => import('@/pages/video/UploadPage.vue'),
            meta: {
              title: '上传视频',
              requiresAuth: true,
            },
          },
          {
            path: ':id',
            name: 'VideoDetail',
            component: () => import('@/pages/video/PlayerPage.vue'),
            meta: {
              title: '视频播放',
            },
          },
          {
            path: 'list',
            name: 'VideoList',
            component: () => import('@/pages/video/VideoListPage.vue'),
            meta: {
              title: '视频列表',
            },
          },
        ],
      },
      {
        path: '/user',
        children: [
          {
            path: ':id',
            name: 'Profile',
            component: () => import('@/pages/user/ProfilePage.vue'),
            meta: {
              title: '个人主页',
            },
          },
          {
            path: 'settings',
            name: 'Settings',
            component: () => import('@/pages/user/SettingsPage.vue'),
            meta: {
              title: '设置',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/feed',
        children: [
          {
            path: 'explore',
            name: 'Explore',
            component: () => import('@/pages/feed/ExplorePage.vue'),
            meta: {
              title: '发现',
            },
          },
          {
            path: 'trending',
            name: 'Trending',
            component: () => import('@/pages/feed/TrendingPage.vue'),
            meta: {
              title: '热门',
            },
          },
        ],
      },
      {
        path: '/library',
        children: [
          {
            path: '',
            name: 'Library',
            component: () => import('@/pages/library/LibraryPage.vue'),
            meta: {
              title: '媒体库',
              requiresAuth: true,
            },
          },
          {
            path: 'history',
            name: 'History',
            component: () => import('@/pages/library/HistoryPage.vue'),
            meta: {
              title: '观看历史',
              requiresAuth: true,
            },
          },
          {
            path: 'subscriptions',
            name: 'Subscriptions',
            component: () => import('@/pages/library/SubscriptionsPage.vue'),
            meta: {
              title: '订阅',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/tag',
        children: [
          {
            path: ':id',
            name: 'TagDetail',
            component: () => import('@/pages/tag/TagDetailPage.vue'),
            meta: {
              title: '标签',
            },
          },
        ],
      },
      {
        path: '/static',
        children: [
          {
            path: 'about',
            name: 'About',
            component: () => import('@/pages/static/AboutPage.vue'),
            meta: {
              title: '关于',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/components/layout/BlankLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/auth/login',
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
          title: '登录',
          guest: true,
        },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
        meta: {
          title: '注册',
          guest: true,
        },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/pages/auth/ForgotPassword.vue'),
        meta: {
          title: '忘记密码',
          guest: true,
        },
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/pages/auth/ResetPassword.vue'),
        meta: {
          title: '重置密码',
          guest: true,
        },
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        component: () => import('@/pages/auth/VerifyEmail.vue'),
        meta: {
          title: '验证邮箱',
          guest: true,
        },
      },
      {
        path: 'oauth-callback',
        name: 'OAuthCallback',
        component: () => import('@/pages/auth/OAuthCallback.vue'),
        meta: {
          title: '第三方登录',
          guest: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/NotFoundPage.vue'),
    meta: {
      title: '页面未找到',
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 设置页面标题
  document.title = `${to.meta.title} - Atom Video` || 'Atom Video';

  // 处理需要登录的页面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // 处理游客页面（已登录用户不能访问）
  if (to.meta.guest && authStore.isAuthenticated) {
    next('/');
    return;
  }

  next();
});

export default router;
