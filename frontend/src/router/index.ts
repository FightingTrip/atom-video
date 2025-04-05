import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 修改懒加载的写法，添加注释和错误处理
const Home = () =>
  import('@/views/Home.vue').catch(err => {
    console.error('Failed to load Home view:', err);
    return import('@/views/NotFound.vue');
  });
const Login = () => import('@/views/auth/Login.vue');
const Register = () => import('@/views/auth/Register.vue');
const VerifyEmail = () => import('@/views/auth/VerifyEmail.vue');
const Profile = () => import('@/views/Profile.vue');
const Settings = () => import('@/views/Settings.vue');
const VideoUpload = () => import('@/views/video/Upload.vue');
const VideoDetail = () => import('@/views/VideoDetail.vue');
const NotFound = () => import('@/views/NotFound.vue');
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue');
const ResetPassword = () => import('@/views/auth/ResetPassword.vue');
const TagDetail = () => import('@/views/TagDetail.vue');
const Trending = () => import('@/views/Trending.vue');
const Subscriptions = () => import('@/views/Subscriptions.vue');
const Library = () => import('@/views/Library.vue');
const History = () => import('@/views/History.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'explore',
        name: 'Explore',
        component: () => import('../views/Explore.vue'),
        meta: {
          title: '探索',
        },
      },
      // 其他需要默认布局的路由...
    ],
  },
  {
    path: '/auth',
    component: () => import('../layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        name: 'Auth',
        component: () => import('../views/Auth.vue'),
        meta: {
          title: '登录与注册',
          guest: true,
        },
      },
      {
        path: 'login',
        redirect: '/auth',
      },
      {
        path: 'register',
        redirect: '/auth',
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        component: () => import('../views/auth/VerifyEmail.vue'),
        meta: {
          title: '验证邮箱',
          guest: true,
        },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/auth/ForgotPassword.vue'),
        meta: {
          title: '忘记密码',
          guest: true,
        },
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('../views/auth/ResetPassword.vue'),
        meta: {
          title: '重置密码',
          guest: true,
        },
      },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      requiresAuth: true,
      title: '个人资料',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { title: '设置', requiresAuth: true },
  },
  {
    path: '/trending',
    name: 'Trending',
    component: Trending,
    meta: {
      title: '热门',
    },
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: Subscriptions,
    meta: {
      title: '订阅',
      requiresAuth: true,
    },
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
    meta: {
      title: '媒体库',
      requiresAuth: true,
    },
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: {
      title: '历史记录',
      requiresAuth: true,
    },
  },
  {
    path: '/video/upload',
    name: 'VideoUpload',
    component: VideoUpload,
    meta: {
      title: '上传视频',
      requiresAuth: true,
    },
  },
  {
    path: '/video/:id',
    name: 'VideoDetail',
    component: VideoDetail,
    meta: {
      title: '视频详情',
    },
  },
  {
    path: '/tag/:id',
    name: 'TagDetail',
    component: TagDetail,
    meta: {
      title: '标签详情',
    },
  },
  {
    path: '/oauth/callback',
    name: 'OAuthCallback',
    component: () => import('../views/auth/OAuthCallback.vue'),
    meta: {
      title: 'OAuth Callback',
      guest: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 添加全局错误处理
router.onError(error => {
  console.error('Router error:', error);
});

// 路由守卫处理标题等
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  document.title = `${to.meta.title || 'Atom Video'} - Make Develop All In One`;

  // 检查认证状态
  if (!authStore.isAuthenticated && authStore.token) {
    authStore.checkAuth();
  }

  // 需要认证的路由
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  // 游客专属路由（已登录用户不能访问）
  if (to.meta.guest && authStore.isAuthenticated) {
    next('/');
    return;
  }

  next();
});

export default router;
