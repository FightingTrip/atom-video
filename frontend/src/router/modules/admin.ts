/**
 * 管理员路由配置
 *
 * 包含管理后台的所有路由配置
 * 所有管理后台路由都需要ADMIN权限
 */

import { RouteRecordRaw } from 'vue-router';

// 路由元数据类型扩展
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    permissions?: string[];
    roles?: string[];
    breadcrumb?: { title: string; path: string }[];
    keepAlive?: boolean;
    icon?: string;
  }
}

// 管理员角色定义
const adminRoles = ['ADMIN'];

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      roles: adminRoles,
      title: '管理后台',
    },
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' },
      },
      // 仪表盘
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/dashboard/DashboardPage.vue'),
        meta: {
          title: '仪表盘',
          keepAlive: true,
          icon: 'BarChartOutline',
        },
      },

      // 内容管理
      {
        path: 'content',
        redirect: { name: 'AdminVideos' },
        meta: {
          title: '内容管理',
        },
      },
      {
        path: 'content/videos',
        name: 'AdminVideos',
        component: () => import('@/pages/admin/content/VideosPage.vue'),
        meta: {
          title: '视频管理',
          breadcrumb: [
            { title: '内容管理', path: '/admin/content' },
            { title: '视频管理', path: '/admin/content/videos' },
          ],
        },
      },
      {
        path: 'content/videos/:id',
        name: 'AdminVideoDetail',
        component: () => import('@/pages/admin/content/VideoDetailPage.vue'),
        meta: {
          title: '视频详情',
          breadcrumb: [
            { title: '内容管理', path: '/admin/content' },
            { title: '视频管理', path: '/admin/content/videos' },
            { title: '视频详情', path: '' },
          ],
        },
      },
      {
        path: 'content/comments',
        name: 'AdminComments',
        component: () => import('@/pages/admin/content/CommentsPage.vue'),
        meta: {
          title: '评论管理',
          breadcrumb: [
            { title: '内容管理', path: '/admin/content' },
            { title: '评论管理', path: '/admin/content/comments' },
          ],
        },
      },
      {
        path: 'content/tags',
        name: 'AdminTags',
        component: () => import('@/pages/admin/content/TagsPage.vue'),
        meta: {
          title: '标签管理',
          breadcrumb: [
            { title: '内容管理', path: '/admin/content' },
            { title: '标签管理', path: '/admin/content/tags' },
          ],
        },
      },
      {
        path: 'content/categories',
        name: 'AdminCategories',
        component: () => import('@/pages/admin/content/CategoriesPage.vue'),
        meta: {
          title: '分类管理',
          breadcrumb: [
            { title: '内容管理', path: '/admin/content' },
            { title: '分类管理', path: '/admin/content/categories' },
          ],
        },
      },

      // 用户管理
      {
        path: 'users',
        redirect: { name: 'AdminUsersList' },
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'users/list',
        name: 'AdminUsersList',
        component: () => import('@/pages/admin/user/UsersListPage.vue'),
        meta: {
          title: '用户列表',
          keepAlive: true,
          breadcrumb: [
            { title: '用户管理', path: '/admin/users' },
            { title: '用户列表', path: '/admin/users/list' },
          ],
        },
      },
      {
        path: 'users/:id',
        name: 'AdminUserDetail',
        component: () => import('@/pages/admin/user/UserDetailPage.vue'),
        meta: {
          title: '用户详情',
          breadcrumb: [
            { title: '用户管理', path: '/admin/users' },
            { title: '用户列表', path: '/admin/users/list' },
            { title: '用户详情', path: '' },
          ],
        },
      },
      {
        path: 'users/creators',
        name: 'AdminCreators',
        component: () => import('@/pages/admin/user/CreatorsPage.vue'),
        meta: {
          title: '创作者管理',
          breadcrumb: [
            { title: '用户管理', path: '/admin/users' },
            { title: '创作者管理', path: '/admin/users/creators' },
          ],
        },
      },
      {
        path: 'users/roles',
        name: 'AdminRoles',
        component: () => import('@/pages/admin/user/RolesPage.vue'),
        meta: {
          title: '角色权限',
          breadcrumb: [
            { title: '用户管理', path: '/admin/users' },
            { title: '角色权限', path: '/admin/users/roles' },
          ],
        },
      },

      // 举报处理
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('@/pages/admin/report/ReportsPage.vue'),
        meta: {
          title: '举报处理',
        },
      },

      // 系统设置
      {
        path: 'settings',
        redirect: { name: 'AdminSiteSettings' },
        meta: {
          title: '系统设置',
        },
      },
      {
        path: 'settings/site',
        name: 'AdminSiteSettings',
        component: () => import('@/pages/admin/settings/SiteSettingsPage.vue'),
        meta: {
          title: '站点设置',
          breadcrumb: [
            { title: '系统设置', path: '/admin/settings' },
            { title: '站点设置', path: '/admin/settings/site' },
          ],
        },
      },
      {
        path: 'settings/logs',
        name: 'AdminLogs',
        component: () => import('@/pages/admin/settings/LogsPage.vue'),
        meta: {
          title: '系统日志',
          breadcrumb: [
            { title: '系统设置', path: '/admin/settings' },
            { title: '系统日志', path: '/admin/settings/logs' },
          ],
        },
      },

      // 个人资料
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/pages/admin/profile/ProfilePage.vue'),
        meta: {
          title: '个人资料',
        },
      },
    ],
  },
];

export default adminRoutes;
