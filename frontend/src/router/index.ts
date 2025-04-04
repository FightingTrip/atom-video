import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';

// 懒加载组件
const Home = () => import('@/views/Home.vue');
const Login = () => import('@/views/auth/Login.vue');
const Register = () => import('@/views/auth/Register.vue');
const VerifyEmail = () => import('@/views/auth/VerifyEmail.vue');
const Profile = () => import('@/views/Profile.vue');
const Settings = () => import('@/views/Settings.vue');
const Upload = () => import('@/views/Upload.vue');
const VideoDetail = () => import('@/views/VideoDetail.vue');
const NotFound = () => import('@/views/NotFound.vue');
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue');
const ResetPassword = () => import('@/views/auth/ResetPassword.vue');
const VideoUpload = () => import('@/views/video/Upload.vue');

const router = createRouter({
  history: createWebHistory(),
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
      path: '/upload',
      name: 'Upload',
      component: Upload,
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
      path: '/videos/upload',
      name: 'VideoUpload',
      component: VideoUpload,
      meta: {
        requiresAuth: true,
        title: '上传视频',
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

// 全局前置守卫
router.beforeEach(authGuard);

// 全局后置守卫
router.afterEach(to => {
  // 更新页面标题
  document.title = `${to.meta.title} - Atom Video`;
});

export default router;
