import { createRouter, createWebHashHistory } from 'vue-router';
import { authGuard } from './guards';

// 懒加载组件
const Home = () => import('@/views/Home.vue');
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

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页',
      },
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
      path: '/auth/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录',
        guest: true,
      },
    },
    {
      path: '/auth/register',
      name: 'Register',
      component: Register,
      meta: {
        title: '注册',
        guest: true,
      },
    },
    {
      path: '/auth/verify-email',
      name: 'VerifyEmail',
      component: VerifyEmail,
      meta: {
        title: '验证邮箱',
        guest: true,
      },
    },
    {
      path: '/profile/:username',
      name: 'Profile',
      component: Profile,
      meta: {
        title: '个人主页',
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        title: '设置',
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
      path: '/auth/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: {
        title: '忘记密码',
        guest: true,
      },
    },
    {
      path: '/auth/reset-password',
      name: 'ResetPassword',
      component: ResetPassword,
      meta: {
        title: '重置密码',
        guest: true,
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
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '页面未找到',
      },
    },
  ],
});

// 路由守卫
router.beforeEach(authGuard);

// 设置页面标题
router.afterEach(to => {
  document.title = `${to.meta.title} - Atom Video`;
});

export default router;
