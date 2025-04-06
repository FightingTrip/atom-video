# 路由系统

本文档详细描述 Atom 前端项目的路由系统设计，包括路由架构、路由配置、导航守卫和最佳实践。

## 1. 路由架构

Atom 前端项目基于 Vue Router 构建路由系统，采用层次化的路由设计，确保用户界面的一致性和导航的流畅性。

### 1.1 路由模式

项目采用 HTML5 的 History 路由模式，提供更友好的 URL 格式：

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

### 1.2 路由结构

路由结构按照功能模块划分，主要包括以下几个部分：

1. **公共路由**：不需要权限即可访问的路由，如首页、登录页等
2. **用户路由**：与用户相关的路由，如个人中心、设置等
3. **视频路由**：与视频相关的路由，如视频详情、上传等
4. **管理路由**：需要管理员权限的路由，如数据统计、用户管理等
5. **错误路由**：错误页面，如 404、403 等

### 1.3 嵌套路由设计

使用嵌套路由实现复杂界面布局：

```
/user
  ├── /profile                # 个人资料
  ├── /videos                 # 我的视频
  ├── /favorites              # 收藏夹
  └── /settings               # 用户设置
      ├── /account            # 账号设置
      ├── /profile            # 资料设置
      └── /notification       # 通知设置
```

## 2. 路由配置

### 2.1 路由文件组织

路由文件按照功能模块组织：

```
src/router/
├── index.ts                  # 路由主入口
├── routes.ts                 # 汇总所有路由
├── modules/                  # 路由模块
│   ├── home.ts               # 首页相关路由
│   ├── auth.ts               # 认证相关路由
│   ├── user.ts               # 用户相关路由
│   ├── video.ts              # 视频相关路由
│   └── admin.ts              # 管理后台路由
└── guards/                   # 路由守卫
    ├── auth.ts               # 认证守卫
    └── permission.ts         # 权限守卫
```

### 2.2 路由模块定义

每个路由模块导出一个路由配置数组，便于管理：

```typescript
// router/modules/user.ts
import { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: {
      requiresAuth: true,
      title: '用户中心'
    },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/pages/user/UserProfilePage.vue'),
        meta: {
          title: '个人资料'
        }
      },
      {
        path: 'videos',
        name: 'UserVideos',
        component: () => import('@/pages/user/UserVideosPage.vue'),
        meta: {
          title: '我的视频'
        }
      },
      {
        path: 'settings',
        component: () => import('@/pages/user/settings/SettingsLayout.vue'),
        meta: {
          title: '设置'
        },
        children: [
          {
            path: '',
            redirect: { name: 'AccountSettings' }
          },
          {
            path: 'account',
            name: 'AccountSettings',
            component: () => import('@/pages/user/settings/AccountSettingsPage.vue'),
            meta: {
              title: '账号设置'
            }
          },
          {
            path: 'profile',
            name: 'ProfileSettings',
            component: () => import('@/pages/user/settings/ProfileSettingsPage.vue'),
            meta: {
              title: '资料设置'
            }
          }
        ]
      }
    ]
  }
]

export default userRoutes
```

### 2.3 路由汇总

汇总所有路由模块：

```typescript
// router/routes.ts
import { RouteRecordRaw } from 'vue-router'
import homeRoutes from './modules/home'
import authRoutes from './modules/auth'
import userRoutes from './modules/user'
import videoRoutes from './modules/video'
import adminRoutes from './modules/admin'

// 基础路由，如错误页面等
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/NotFoundPage.vue')
  }
]

const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...authRoutes,
  ...userRoutes,
  ...videoRoutes,
  ...adminRoutes,
  ...baseRoutes
]

export default routes
```

### 2.4 路由元信息

路由元信息用于定义路由的附加属性，如权限要求、页面标题等：

```typescript
// 路由元信息类型定义
declare module 'vue-router' {
  interface RouteMeta {
    // 是否需要身份验证
    requiresAuth?: boolean
    // 所需权限
    permissions?: string[]
    // 页面标题
    title?: string
    // 是否缓存页面
    keepAlive?: boolean
    // 是否在菜单中显示
    hideInMenu?: boolean
    // 菜单图标
    icon?: string
    // 过渡效果
    transition?: string
  }
}

// 使用元信息
const route: RouteRecordRaw = {
  path: '/video/upload',
  name: 'VideoUpload',
  component: () => import('@/pages/video/VideoUploadPage.vue'),
  meta: {
    requiresAuth: true,
    permissions: ['video:upload'],
    title: '上传视频',
    keepAlive: false
  }
}
```

## 3. 路由懒加载

使用动态导入实现路由懒加载，优化首屏加载性能：

```typescript
// 路由懒加载
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home/HomePage.vue')
  },
  {
    path: '/video/:id',
    name: 'VideoDetail',
    // 带注释的动态导入，用于 Webpack/Vite 打包分块
    component: () => import(/* webpackChunkName: "video" */ '@/pages/video/VideoDetailPage.vue')
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    // 预加载相关路由
    component: () => import(/* webpackPrefetch: true */ '@/pages/user/UserProfilePage.vue')
  }
]
```

## 4. 导航守卫

### 4.1 全局导航守卫

全局导航守卫用于处理各种路由导航事件：

```typescript
// router/guards/index.ts
import router from '@/router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 进度条配置
NProgress.configure({ 
  showSpinner: false,
  easing: 'ease',
  speed: 400
})

// 白名单路由，不需要登录
const whiteList = ['/login', '/register', '/forgot-password']

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Atom` : 'Atom'
  
  const userStore = useUserStore()
  const hasToken = userStore.token
  
  if (hasToken) {
    if (to.path === '/login') {
      // 已登录用户重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查用户信息是否已加载
      const hasUserInfo = userStore.user !== null
      
      if (hasUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.getUserInfo()
          
          // 获取用户信息后放行
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，可能是 token 过期
          userStore.logout()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 白名单路由直接放行
      next()
    } else {
      // 非白名单路由重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

// 错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  NProgress.done()
})
```

### 4.2 路由权限控制

基于角色和权限的访问控制：

```typescript
// router/guards/permission.ts
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  
  // 检查路由是否需要权限
  if (to.meta.permissions && to.meta.permissions.length > 0) {
    // 检查用户是否拥有所需权限
    const hasPermission = permissionStore.hasPermissions(to.meta.permissions)
    
    if (!hasPermission) {
      // 无权限，重定向到 403 页面
      next({ name: 'Forbidden' })
      return
    }
  }
  
  next()
})
```

### 4.3 路由缓存控制

使用 `<keep-alive>` 和路由元信息实现页面缓存：

```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <keep-alive>
        <component
          :is="Component"
          v-if="route.meta.keepAlive"
        />
      </keep-alive>
    </transition>
    
    <transition :name="route.meta.transition || 'fade'">
      <component
        :is="Component"
        v-if="!route.meta.keepAlive"
      />
    </transition>
  </router-view>
</template>
```

## 5. 路由组件通信

### 5.1 路由参数

通过路由参数传递数据：

```typescript
// 路径参数
router.push({ path: `/video/${videoId}` })

// URL 查询参数
router.push({ 
  path: '/videos',
  query: { 
    category: 'technology',
    sort: 'latest'
  }
})

// 在组件中获取参数
const route = useRoute()
const videoId = route.params.id
const category = route.query.category
```

### 5.2 路由传递状态

通过 `router.push` 的 state 选项传递状态：

```typescript
// 传递状态
router.push({
  name: 'VideoDetail',
  params: { id: videoId },
  state: { video: videoData } // 传递状态
})

// 在目标组件中获取状态
const route = useRoute()
const videoData = route.state?.video
```

### 5.3 组合路由参数与 Store

组合路由参数和 Store 进行数据获取：

```typescript
// 视频详情页
import { useRoute } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { onMounted } from 'vue'

const route = useRoute()
const videoStore = useVideoStore()

// 监听路由参数变化并获取视频数据
watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await videoStore.fetchVideoById(id as string)
    }
  },
  { immediate: true }
)
```

## 6. 动态路由

### 6.1 动态添加路由

基于用户权限动态添加路由：

```typescript
// router/dynamic.ts
import { Router, RouteRecordRaw } from 'vue-router'
import adminRoutes from './modules/admin'

// 初始基础路由
const constantRoutes: RouteRecordRaw[] = [
  // 公共路由...
]

// 动态添加路由
export function setupDynamicRoutes(router: Router, userRoles: string[]) {
  // 根据角色判断是否添加管理员路由
  if (userRoles.includes('admin')) {
    adminRoutes.forEach(route => {
      router.addRoute(route)
    })
  }
  
  // 添加 404 路由，确保它在所有路由的最后
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/NotFoundPage.vue')
  })
}
```

### 6.2 路由映射配置

使用配置文件定义路由与权限的映射关系：

```typescript
// router/permission-map.ts
interface RoutePermission {
  path: string
  roles: string[]
  permissions: string[]
}

const permissionMap: RoutePermission[] = [
  {
    path: '/admin',
    roles: ['admin'],
    permissions: ['system:admin']
  },
  {
    path: '/video/upload',
    roles: ['user', 'creator', 'admin'],
    permissions: ['video:upload']
  }
]

export function getAccessibleRoutes(userRoles: string[], userPermissions: string[]) {
  return permissionMap.filter(item => {
    // 检查角色匹配
    const hasRole = item.roles.some(role => userRoles.includes(role))
    
    // 检查权限匹配
    const hasPermission = item.permissions.some(permission => 
      userPermissions.includes(permission)
    )
    
    return hasRole || hasPermission
  })
}
```

## 7. 路由跳转与过渡

### 7.1 编程式导航

使用编程式导航进行路由跳转：

```typescript
// 基本导航
router.push('/home')

// 命名路由
router.push({ name: 'UserProfile' })

// 带参数的路由
router.push({ name: 'VideoDetail', params: { id: '123' } })

// 带查询参数的路由
router.push({ 
  path: '/search',
  query: { 
    keyword: 'vue',
    page: 1
  }
})

// 替换当前路由（不保留历史记录）
router.replace({ name: 'Login' })

// 前进/后退
router.go(-1) // 后退一步
router.go(1)  // 前进一步
router.back() // 后退一步
router.forward() // 前进一步
```

### 7.2 路由过渡动画

定义路由过渡动画：

```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component, route }">
    <transition 
      :name="route.meta.transition || 'fade'" 
      mode="out-in"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动过渡 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
</style>
```

### 7.3 自定义路由方向

根据导航历史决定过渡动画方向：

```typescript
// composables/useTransitionDirection.ts
import { ref, watch } from 'vue'
import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router'

export function useTransitionDirection() {
  const router = useRouter()
  const routeHistory = ref<string[]>([])
  const transitionName = ref('fade')
  
  // 监听路由变化
  watch(() => router.currentRoute.value, (to, from) => {
    if (!from) {
      routeHistory.value.push(to.fullPath)
      return
    }
    
    const toIndex = routeHistory.value.indexOf(to.fullPath)
    
    if (toIndex === -1) {
      // 新路由，向前
      transitionName.value = 'slide-left'
      routeHistory.value.push(to.fullPath)
    } else {
      // 已存在的路由，向后
      transitionName.value = 'slide-right'
      // 删除当前路由之后的历史
      routeHistory.value = routeHistory.value.slice(0, toIndex + 1)
    }
  }, { immediate: true })
  
  return {
    transitionName
  }
}
```

## 8. 路由最佳实践

### 8.1 路由命名规范

- 使用有意义的名称命名路由
- 路由名称采用 PascalCase 命名法
- 相关模块路由使用前缀分组，如 `User`、`Video`
- 嵌套路由使用父级路由名称作为前缀

```typescript
// 良好的路由命名实践
const routes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    children: [
      {
        path: 'profile',
        name: 'UserProfile'
      },
      {
        path: 'settings',
        name: 'UserSettings',
        children: [
          {
            path: 'account',
            name: 'UserSettingsAccount'
          }
        ]
      }
    ]
  }
]
```

### 8.2 路由组件按需加载

- 所有路由组件都使用动态导入
- 导入语句包含 webpack/vite 注释以优化打包
- 常用路由使用预加载提升体验

```typescript
const routes: RouteRecordRaw[] = [
  // 首页路由预加载
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackPrefetch: true */ '@/pages/home/HomePage.vue')
  },
  // 相关组件打包在同一块中
  {
    path: '/video/:id',
    name: 'VideoDetail',
    component: () => import(/* webpackChunkName: "video" */ '@/pages/video/VideoDetailPage.vue')
  },
  {
    path: '/video/comments/:id',
    name: 'VideoComments',
    component: () => import(/* webpackChunkName: "video" */ '@/pages/video/VideoCommentsPage.vue')
  }
]
```

### 8.3 路由参数验证

使用 `beforeEnter` 守卫验证路由参数：

```typescript
{
  path: '/video/:id',
  name: 'VideoDetail',
  component: () => import('@/pages/video/VideoDetailPage.vue'),
  beforeEnter: (to, from, next) => {
    // 验证 ID 是否为有效的 UUID 格式
    const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!idPattern.test(to.params.id as string)) {
      next({ name: 'NotFound' })
    } else {
      next()
    }
  }
}
```

### 8.4 处理未授权路由访问

配置统一的未授权处理：

```typescript
// router/guards/auth.ts
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { useNotificationStore } from '@/stores/notification'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const notificationStore = useNotificationStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // 未登录，重定向到登录页
    notificationStore.showMessage({
      type: 'warning',
      message: '请先登录再访问该页面'
    })
    
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  if (to.meta.permissions && to.meta.permissions.length > 0) {
    const hasPermission = permissionStore.hasPermissions(to.meta.permissions)
    
    if (!hasPermission) {
      // 无权限
      notificationStore.showMessage({
        type: 'error',
        message: '您没有权限访问该页面'
      })
      
      next({ name: 'Forbidden' })
      return
    }
  }
  
  next()
})
```

### 8.5 路由历史管理

管理路由历史记录，便于实现"返回上一页"功能：

```typescript
// composables/useRouteHistory.ts
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export function useRouteHistory(excludePaths: string[] = []) {
  const router = useRouter()
  const history = ref<string[]>([])
  
  watch(() => router.currentRoute.value, (to, from) => {
    // 排除不需要记录的路径
    if (from && !excludePaths.includes(from.path)) {
      history.value.push(from.fullPath)
      
      // 只保留最近的 10 条历史记录
      if (history.value.length > 10) {
        history.value.shift()
      }
    }
  })
  
  // 返回上一页，如果没有历史记录则返回首页
  const goBack = () => {
    if (history.value.length > 0) {
      const lastPath = history.value.pop()
      router.push(lastPath || '/')
    } else {
      router.push('/')
    }
  }
  
  return {
    history,
    goBack
  }
}
```

## 9. 路由测试

### 9.1 路由单元测试

测试路由配置和导航守卫：

```typescript
// router/index.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '@/stores/user'

// 模拟 Pinia store
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    token: null,
    user: null,
    isAuthenticated: false,
    getUserInfo: vi.fn()
  }))
}))

describe('Router', () => {
  let router
  
  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes
    })
  })
  
  it('should redirect to login when accessing protected route without authentication', async () => {
    // 配置模拟 store
    useUserStore.mockImplementation(() => ({
      token: null,
      user: null,
      isAuthenticated: false,
      getUserInfo: vi.fn()
    }))
    
    // 导航到需要认证的路由
    await router.push('/user/profile')
    
    // 期望重定向到登录页
    expect(router.currentRoute.value.name).toBe('Login')
    expect(router.currentRoute.value.query.redirect).toBe('/user/profile')
  })
  
  it('should allow access to protected route with authentication', async () => {
    // 配置模拟 store，模拟已认证状态
    useUserStore.mockImplementation(() => ({
      token: 'valid-token',
      user: { id: '1', name: 'Test User' },
      isAuthenticated: true,
      getUserInfo: vi.fn()
    }))
    
    // 导航到需要认证的路由
    await router.push('/user/profile')
    
    // 期望成功导航到目标路由
    expect(router.currentRoute.value.path).toBe('/user/profile')
  })
})
```

### 9.2 组件路由集成测试

测试组件中的路由功能：

```typescript
// components/Navbar.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Navbar from './Navbar.vue'

describe('Navbar', () => {
  it('should navigate to the correct route when menu items are clicked', async () => {
    // 创建测试路由
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Home' },
        { path: '/videos', name: 'Videos' },
        { path: '/about', name: 'About' }
      ]
    })
    
    await router.push('/')
    
    // 挂载组件
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })
    
    // 点击导航菜单项
    await wrapper.find('[data-test="nav-videos"]').trigger('click')
    
    // 验证路由变化
    expect(router.currentRoute.value.name).toBe('Videos')
  })
})
```

## 10. 总结

Atom 前端项目的路由系统采用 Vue Router 构建，基于模块化和层次化的设计理念，实现了清晰、高效的路由管理。路由系统的主要特点包括：

1. **模块化路由配置**：按功能模块划分路由文件，便于维护和扩展
2. **嵌套路由设计**：通过嵌套路由实现复杂页面布局和导航结构
3. **权限控制**：基于角色和权限的路由访问控制，确保系统安全
4. **懒加载优化**：所有路由组件采用动态导入，优化首屏加载性能
5. **导航守卫**：全面的导航守卫体系，处理认证、权限、页面缓存等需求
6. **优雅的过渡效果**：基于路由的页面过渡动画，提升用户体验

通过实施本文档中的路由设计和最佳实践，可以构建出一个导航流畅、权限明确、用户体验优秀的前端应用。 