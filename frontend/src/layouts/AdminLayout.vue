/**
* @file AdminLayout.vue
* @description 管理员后台布局组件
* @author Atom Video Team
* @date 2025-04-10
*/

<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <!-- 汉堡菜单 -->
        <button @click="toggleSidebar" class="menu-button">
          <n-icon size="24">
            <MenuOutline />
          </n-icon>
        </button>

        <!-- Logo -->
        <router-link to="/admin" class="logo-link">
          <img src="@/assets/logo/logo.svg" alt="Atom Video" class="logo" />
          <span class="logo-text">管理后台</span>
        </router-link>
      </div>

      <div class="header-right">
        <!-- 全局搜索 -->
        <div class="search-container">
          <n-input v-model:value="searchQuery" placeholder="搜索..." size="small" round>
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </div>

        <!-- 通知图标 -->
        <n-badge :value="notificationCount" :max="99" v-if="notificationCount > 0">
          <n-button quaternary circle>
            <template #icon>
              <n-icon>
                <NotificationsOutline />
              </n-icon>
            </template>
          </n-button>
        </n-badge>
        <n-button quaternary circle v-else>
          <template #icon>
            <n-icon>
              <NotificationsOutline />
            </n-icon>
          </template>
        </n-button>

        <!-- 夜间模式切换 -->
        <n-button quaternary circle @click="toggleTheme">
          <template #icon>
            <n-icon>
              <component :is="isDarkMode ? SunnyOutline : MoonOutline" />
            </n-icon>
          </template>
        </n-button>

        <!-- 用户菜单 -->
        <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect" trigger="click">
          <div class="admin-avatar">
            <n-avatar :src="userAvatar" round size="small" />
            <span class="admin-name">{{ userName }}</span>
            <n-icon size="tiny">
              <ChevronDownOutline />
            </n-icon>
          </div>
        </n-dropdown>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="admin-main">
      <!-- 侧边栏 -->
      <div class="admin-sidebar" :class="{ 'collapsed': sidebarCollapsed }">
        <n-menu :collapsed="sidebarCollapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
          :value="activeMenuItem" @update:value="handleMenuChange" />
      </div>

      <!-- 内容区域 -->
      <div class="admin-content">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-container">
          <n-breadcrumb separator="/">
            <n-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="item.path">
              <router-link :to="item.path" class="breadcrumb-link">
                <n-icon size="16" class="breadcrumb-icon">
                  <component :is="getBreadcrumbIcon(item.title, index)" />
                </n-icon>
                <span>{{ item.title }}</span>
              </router-link>
            </n-breadcrumb-item>
          </n-breadcrumb>
        </div>

        <!-- 页面内容 -->
        <main class="content-area">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <keep-alive v-if="keepAliveRoutes.includes($route.name as string)">
                <component :is="Component" />
              </keep-alive>
              <component :is="Component" v-else />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    NIcon,
    NMenu,
    NButton,
    NAvatar,
    NBadge,
    NBreadcrumb,
    NBreadcrumbItem,
    NDropdown,
    NInput
  } from 'naive-ui'
  import {
    MenuOutline,
    SearchOutline,
    HomeOutline,
    PeopleOutline,
    VideocamOutline,
    SettingsOutline,
    LogOutOutline,
    PersonOutline,
    BarChartOutline,
    PricetagsOutline,
    ChatboxOutline,
    NotificationsOutline,
    MoonOutline,
    SunnyOutline,
    ChevronDownOutline,
    ShieldOutline,
    DocumentTextOutline
  } from '@vicons/ionicons5'
  import { h } from 'vue'
  import { useThemeStore } from '@/stores/theme'
  import { useUserStore } from '@/stores/user'
  import { useAuthStore } from '@/stores/auth'

  // 路由和状态管理
  const route = useRoute()
  const router = useRouter()
  const themeStore = useThemeStore()
  const userStore = useUserStore()
  const authStore = useAuthStore()

  // 布局状态
  const sidebarCollapsed = ref(false)
  const searchQuery = ref('')
  const notificationCount = ref(0)
  const keepAliveRoutes = ref(['AdminDashboard', 'AdminUsersList'])

  // 用户信息
  const userName = computed(() => authStore.username || '管理员')
  const userAvatar = computed(() => {
    if (authStore.user?.avatar) {
      return authStore.user.avatar;
    }
    return 'https://i.pravatar.cc/100?img=1';
  })

  // 主题状态
  const isDarkMode = computed(() => themeStore.isDark)

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('admin-sidebar-collapsed', String(sidebarCollapsed.value))
  }

  // 切换主题
  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  // 面包屑导航
  const breadcrumbItems = computed(() => {
    const items = [{ title: '管理后台', path: '/admin' }]

    if (route.meta.breadcrumb) {
      const breadcrumbs = route.meta.breadcrumb as { title: string; path: string }[]
      items.push(...breadcrumbs)
    } else if (route.meta.title) {
      items.push({ title: route.meta.title as string, path: route.path })
    }

    return items
  })

  // 菜单配置
  const renderIcon = (icon: any) => {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const menuOptions = computed(() => [
    {
      label: '仪表盘',
      key: 'dashboard',
      icon: renderIcon(BarChartOutline),
      path: '/admin/dashboard'
    },
    {
      label: '内容管理',
      key: 'content',
      icon: renderIcon(VideocamOutline),
      children: [
        {
          label: '视频管理',
          key: 'videos',
          path: '/admin/content/videos'
        },
        {
          label: '评论管理',
          key: 'comments',
          path: '/admin/content/comments'
        },
        {
          label: '标签管理',
          key: 'tags',
          path: '/admin/content/tags'
        },
        {
          label: '分类管理',
          key: 'categories',
          path: '/admin/content/categories'
        }
      ]
    },
    {
      label: '用户管理',
      key: 'users',
      icon: renderIcon(PeopleOutline),
      children: [
        {
          label: '用户列表',
          key: 'users-list',
          path: '/admin/users/list'
        },
        {
          label: '创作者管理',
          key: 'creators',
          path: '/admin/users/creators'
        },
        {
          label: '角色权限',
          key: 'roles',
          path: '/admin/users/roles'
        }
      ]
    },
    {
      label: '举报处理',
      key: 'reports',
      icon: renderIcon(ShieldOutline),
      path: '/admin/reports'
    },
    {
      label: '系统设置',
      key: 'settings',
      icon: renderIcon(SettingsOutline),
      children: [
        {
          label: '站点设置',
          key: 'site-settings',
          path: '/admin/settings/site'
        },
        {
          label: '系统日志',
          key: 'logs',
          path: '/admin/settings/logs'
        }
      ]
    }
  ])

  // 当前激活的菜单项
  const activeMenuItem = computed(() => {
    const path = route.path

    // 查找匹配的菜单项
    for (const item of menuOptions.value) {
      if (item.path && path.startsWith(item.path)) {
        return item.key
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.path && path.startsWith(child.path)) {
            return child.key
          }
        }
      }
    }

    // 默认返回仪表盘
    return 'dashboard'
  })

  // 菜单跳转
  const handleMenuChange = (key: string) => {
    // 找到对应的路径
    for (const item of menuOptions.value) {
      if (item.key === key && item.path) {
        router.push(item.path)
        return
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.key === key && child.path) {
            router.push(child.path)
            return
          }
        }
      }
    }
  }

  // 用户菜单
  const userMenuOptions = [
    {
      label: '个人资料',
      key: 'profile',
      icon: renderIcon(PersonOutline)
    },
    {
      label: '设置',
      key: 'settings',
      icon: renderIcon(SettingsOutline)
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: renderIcon(LogOutOutline)
    }
  ]

  // 用户菜单处理
  const handleUserMenuSelect = async (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/admin/profile')
        break
      case 'settings':
        router.push('/admin/settings/site')
        break
      case 'logout':
        await authStore.logout()
        router.push('/auth/login')
        break
    }
  }

  // 窗口大小变化处理
  const handleResize = () => {
    if (window.innerWidth < 992 && !sidebarCollapsed.value) {
      sidebarCollapsed.value = true
    }
  }

  // 组件挂载
  onMounted(() => {
    // 从本地存储加载侧边栏状态
    const savedState = localStorage.getItem('admin-sidebar-collapsed')
    if (savedState) {
      sidebarCollapsed.value = savedState === 'true'
    }

    // 在小屏幕上自动折叠侧边栏
    if (window.innerWidth < 992) {
      sidebarCollapsed.value = true
    }

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)

    // 模拟获取通知数量
    notificationCount.value = 5
  })

  // 组件卸载
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  // 获取面包屑图标
  const getBreadcrumbIcon = (title: string, index: number) => {
    if (index === 0) {
      return HomeOutline
    } else if (title === '管理后台') {
      return HomeOutline
    } else if (title === '仪表盘') {
      return BarChartOutline
    } else if (title === '内容管理') {
      return VideocamOutline
    } else if (title === '用户管理') {
      return PeopleOutline
    } else if (title === '举报处理') {
      return ShieldOutline
    } else if (title === '系统设置') {
      return SettingsOutline
    }
    return DocumentTextOutline
  }
</script>

<style scoped>
  .admin-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--bg-color-secondary);
  }

  .admin-header {
    height: 60px;
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .menu-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    color: var(--text-color);
  }

  .menu-button:hover {
    background-color: var(--hover-color);
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-color);
    gap: 10px;
  }

  .logo {
    height: 24px;
    width: auto;
  }

  .logo-text {
    font-weight: 600;
    font-size: 16px;
  }

  .search-container {
    width: 180px;
  }

  .admin-avatar {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
  }

  .admin-avatar:hover {
    background-color: var(--hover-color);
  }

  .admin-name {
    font-size: 14px;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-main {
    display: flex;
    margin-top: 60px;
    /* 顶部导航栏高度 */
    min-height: calc(100vh - 60px);
  }

  .admin-sidebar {
    width: 220px;
    background-color: var(--bg-color);
    border-right: 1px solid var(--border-color);
    transition: width 0.3s;
    position: fixed;
    left: 0;
    top: 60px;
    /* 顶部导航栏高度 */
    bottom: 0;
    overflow-y: auto;
    z-index: 90;
  }

  .admin-sidebar.collapsed {
    width: 64px;
  }

  .admin-content {
    flex: 1;
    padding: 20px;
    margin-left: 220px;
    transition: margin-left 0.3s;
  }

  .sidebar-collapsed .admin-content {
    margin-left: 64px;
  }

  .breadcrumb-container {
    margin-bottom: 16px;
    padding: 12px 16px;
    background-color: var(--bg-color);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid var(--primary-color);
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    color: var(--text-color-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .breadcrumb-link:hover {
    color: var(--primary-color);
  }

  .breadcrumb-icon {
    margin-right: 4px;
  }

  .content-area {
    background-color: var(--bg-color);
    border-radius: 4px;
    padding: 20px;
    min-height: calc(100vh - 140px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* 过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 响应式调整 */
  @media (max-width: 1200px) {
    .admin-content {
      padding: 16px;
    }

    .content-area {
      padding: 16px;
    }
  }

  @media (max-width: 992px) {
    .admin-sidebar {
      width: 64px;
    }

    .admin-content {
      margin-left: 64px;
    }

    .search-container {
      width: 150px;
    }

    .admin-name {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .admin-header {
      padding: 0 12px;
    }

    .search-container {
      display: none;
    }

    .admin-content {
      padding: 12px;
    }

    .content-area {
      padding: 12px;
    }
  }

  @media (max-width: 576px) {
    .logo-text {
      display: none;
    }
  }
</style>