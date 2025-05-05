import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { RouteRecordRaw } from 'vue-router';
// 导入管理员路由
import adminRoutes from './modules/admin';
// 导入权限守卫
import { permissionGuard } from './guards/permission';
import { registerProgressGuard } from './guards/progress';

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
        component: () => {
          console.log('正在加载视频详情页面...');
          return new Promise(resolve => {
            // 先尝试使用页面路径加载
            import('@/pages/video/VideoDetailPage.vue')
              .then(component => {
                console.log('视频详情页面加载成功');
                resolve(component);
              })
              .catch(err => {
                console.error('视频详情页面加载失败:', err);
                // 失败时使用备用页面
                import('@/pages/video/VideoPlayerTemp.vue')
                  .then(component => {
                    console.log('使用备用视频播放器');
                    resolve(component);
                  })
                  .catch(() => {
                    // 如果备用组件也失败，返回一个简单的组件
                    resolve({
                      template: `
                        <div style="padding: 20px; text-align: center;">
                          <h2>视频加载中...</h2>
                          <p>视频ID: {{ $route.params.id }}</p>
                          <button @click="$router.push('/')">返回首页</button>
                        </div>
                      `,
                    });
                  });
              });
          });
        },
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
        path: '/playlist/:id',
        name: 'playlist',
        component: () => import('@/pages/channel/PlaylistPage.vue'),
        meta: {
          title: '播放列表 - Atom Video',
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
        path: '/notifications',
        name: 'notifications',
        component: () => import('@/pages/user/NotificationsPage.vue'),
        meta: {
          title: '通知中心 - Atom Video',
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
      // OAuth回调路由
      {
        path: '/oauth/callback/:provider',
        name: 'oauth-callback',
        component: () => import('@/components/business/auth/OAuthCallback.vue'),
        meta: {
          title: '第三方登录 - Atom Video',
          requiresAuth: false,
        },
      },
    ],
  },
  // 模拟的第三方OAuth授权页面
  {
    path: '/mock/oauth/:provider',
    name: 'mock-oauth',
    component: () => import('@/pages/oauth/MockOAuthPage.vue'),
    meta: {
      title: '模拟授权 - Atom Video',
      requiresAuth: false,
    },
  },
  // 法律页面路由
  {
    path: '/legal',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: 'terms',
        name: 'terms-of-service',
        component: () => import('@/pages/legal/TermsOfService.vue'),
        meta: {
          title: '服务条款 - Atom Video',
          requiresAuth: false,
        },
      },
      {
        path: 'privacy',
        name: 'privacy-policy',
        component: () => import('@/pages/legal/PrivacyPolicy.vue'),
        meta: {
          title: '隐私政策 - Atom Video',
          requiresAuth: false,
        },
      },
    ],
  },
  // 添加管理员路由
  ...adminRoutes,
  {
    path: '/content/videos/:id',
    component: () => import('@/pages/admin/content/VideoDetailPage.vue'),
    meta: { title: '视频详情', requiresAuth: true, role: 'admin' },
  },
  {
    path: '/content/playlists',
    component: () => import('@/pages/admin/content/PlaylistsPage.vue'),
    meta: { title: '播放列表管理', requiresAuth: true, role: 'admin' },
  },
];

// 获取基础路径，适配GitHub Pages
const getBaseUrl = () => {
  // 在生产环境中使用 BASE_URL 环境变量或默认值
  if (import.meta.env.PROD) {
    return import.meta.env.BASE_URL || '/atom-video/';
  }
  return '/';
};

// 创建路由实例
const router = createRouter({
  // 使用适配GitHub Pages的基础路径
  history: createWebHistory(getBaseUrl()),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置，则使用保存的位置
    if (savedPosition) {
      return savedPosition;
    }
    // 默认滚动到顶部
    return { top: 0 };
  },
});

// 应用路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 更新文档标题
  document.title = to.meta.title ? to.meta.title : 'Atom Video';

  // 检查是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    console.log(`[Auth] Redirecting to login from ${to.fullPath}`);
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  next();
});

// 应用权限守卫
router.beforeEach(permissionGuard);

// 注册视频进度守卫
registerProgressGuard(router);

// 路由后置钩子 - 用于调试
router.afterEach((to, from) => {
  console.log('[Router] afterEach', {
    navigatedTo: to.path,
    fromPath: from.path,
  });
});

export default router;
