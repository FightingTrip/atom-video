/**
* @file TheHeader.vue
* @description 顶部导航栏组件 - YouTube风格
* @features
* - 响应式导航
* - 主题切换
* - 用户菜单
* - 搜索功能
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <header class="header">
    <div class="header-container">
      <!-- 左侧导航 -->
      <div class="header-left">
        <!-- 汉堡菜单 -->
        <button @click="toggleSidebar" class="menu-button">
          <n-icon size="24">
            <MenuOutline />
          </n-icon>
        </button>

        <!-- Logo -->
        <router-link to="/" class="logo-link">
          <img src="/logo.svg" alt="Atom Video" class="logo" />
          <span class="logo-text">Atom Video</span>
        </router-link>
      </div>

      <!-- 中间搜索栏 -->
      <div class="header-center">
        <div class="search-container">
          <form class="search-form" @submit.prevent="handleSearch">
            <n-input v-model:value="searchQuery" placeholder="搜索视频..." class="search-input" clearable>
              <template #prefix>
                <n-icon>
                  <SearchOutline />
                </n-icon>
              </template>
            </n-input>
            <button class="search-button" type="submit">
              <n-icon>
                <SearchOutline />
              </n-icon>
            </button>
          </form>
        </div>
      </div>

      <!-- 右侧用户区域 -->
      <div class="header-right">
        <!-- 创作者中心入口 -->
        <div class="header-icon-btn" v-if="isCreator || isAdmin">
          <router-link to="/creator/studio" class="icon-link creator-link">
            <n-icon size="24">
              <CreateOutline />
            </n-icon>
            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <span class="creator-icon-text">创作</span>
              </template>
              进入创作中心
            </n-tooltip>
          </router-link>
        </div>

        <!-- 上传按钮 -->
        <div class="header-icon-btn" v-if="isLoggedIn">
          <router-link to="/video/upload" class="icon-link">
            <n-icon size="24">
              <VideocamOutline />
            </n-icon>
          </router-link>
        </div>

        <!-- 管理后台入口 -->
        <div class="header-icon-btn" v-if="isAdmin">
          <router-link to="/admin/dashboard" class="icon-link admin-link">
            <n-icon size="24">
              <ShieldOutline />
            </n-icon>
            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <span class="admin-icon-text">管理</span>
              </template>
              进入管理后台
            </n-tooltip>
          </router-link>
        </div>

        <!-- 夜间模式切换 -->
        <div class="header-icon-btn" @click="toggleTheme">
          <n-icon size="24">
            <component :is="isDarkMode ? SunnyOutline : MoonOutline" />
          </n-icon>
        </div>

        <!-- 通知图标 -->
        <div class="header-icon-btn" v-if="isLoggedIn">
          <notification-badge />
        </div>

        <!-- 用户区域 -->
        <div class="user-area">
          <div v-if="isLoggedIn" class="user-avatar-container">
            <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect" trigger="click" :show-arrow="true">
              <n-avatar :src="userAvatar" round size="medium" class="user-avatar" />
            </n-dropdown>
          </div>
          <div v-else class="login-buttons">
            <n-button size="small" quaternary @click="handleLogin">
              <template #icon>
                <n-icon>
                  <PersonOutline />
                </n-icon>
              </template>
              登录
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed, h } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { NInput, NIcon, NDropdown, NAvatar, NButton, NTooltip } from 'naive-ui'
  import {
    MenuOutline,
    SearchOutline,
    VideocamOutline,
    PersonOutline,
    MoonOutline,
    SunnyOutline,
    SettingsOutline,
    LogOutOutline,
    PersonCircleOutline,
    HeartOutline,
    BookmarkOutline,
    TimeOutline,
    ShieldOutline,
    CreateOutline
  } from '@vicons/ionicons5'
  import { useUserStore } from '@/stores/user'
  import { useAuthStore } from '@/stores/auth'
  import { useThemeStore } from '@/stores/theme'
  import NotificationBadge from '@/components/business/notification/NotificationBadge.vue'

  // 定义事件
  const emit = defineEmits(['toggle-sidebar'])

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const themeStore = useThemeStore()

  // 搜索相关
  const searchQuery = ref('')

  // 主题状态
  const isDarkMode = computed(() => themeStore.isDark)

  // 认证状态
  const isLoggedIn = computed(() => authStore.isAuthenticated)

  // 用户头像
  const userAvatar = computed(() => {
    if (userStore.currentUser?.avatar) {
      return userStore.currentUser.avatar;
    }
    return 'https://i.pravatar.cc/150?img=1';
  });

  // 用户菜单选项
  const userMenuOptions = computed(() => {
    const baseOptions = [
      {
        label: '个人中心',
        key: 'profile',
        icon: () => h(NIcon, null, { default: () => h(PersonCircleOutline) })
      },
      {
        label: '我的视频',
        key: 'videos',
        icon: () => h(NIcon, null, { default: () => h(VideocamOutline) })
      },
      {
        label: '收藏',
        key: 'favorites',
        icon: () => h(NIcon, null, { default: () => h(BookmarkOutline) })
      },
      {
        label: '历史记录',
        key: 'history',
        icon: () => h(NIcon, null, { default: () => h(TimeOutline) })
      },
      {
        label: '设置',
        key: 'settings',
        icon: () => h(NIcon, null, { default: () => h(SettingsOutline) })
      }
    ]

    // 如果是创作者或管理员，添加创作者中心入口
    if (authStore.isCreator) {
      baseOptions.push({
        label: '创作者中心',
        key: 'creator',
        icon: () => h(NIcon, null, { default: () => h(CreateOutline) })
      })
    }

    // 如果是管理员，添加管理后台入口
    if (authStore.isAdmin) {
      baseOptions.push({
        label: '管理后台',
        key: 'admin',
        icon: () => h(NIcon, null, { default: () => h(ShieldOutline) })
      })
    }

    // 添加分隔线和登出选项
    baseOptions.push(
      {
        label: '──────────',
        key: 'd1',
        icon: () => h('div'),
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: () => h(NIcon, null, { default: () => h(LogOutOutline) })
      }
    )

    return baseOptions
  })

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
    }
  }

  // 切换侧边栏
  const toggleSidebar = () => {
    emit('toggle-sidebar')
  }

  // 切换主题
  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  // 用户菜单处理
  const handleUserMenuSelect = async (key: string) => {
    try {
      switch (key) {
        case 'profile':
          await router.push(`/user/${userStore.currentUser?.id || 'profile'}`);
          break;
        case 'videos':
          await router.push('/video/list')
          break;
        case 'favorites':
          await router.push('/library')
          break;
        case 'history':
          await router.push('/library/history')
          break;
        case 'settings':
          await router.push('/user/settings')
          break;
        case 'creator':
          await router.push('/creator/studio')
          break;
        case 'admin':
          await router.push('/admin/dashboard')
          break;
        case 'logout':
          await authStore.logout()
          await router.push('/')
          break
      }
    } catch (error) {
      console.error('导航错误:', error)
    }
  }

  // 登录处理
  const handleLogin = () => {
    router.push('/auth/login')
  }

  // 管理员状态
  const isAdmin = computed(() => authStore.isAdmin)

  // 创作者状态
  const isCreator = computed(() => authStore.isCreator)
</script>

<style scoped>
  .header {
    height: 56px;
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 30;
    width: 100%;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 16px;
    max-width: 1800px;
    margin: 0 auto;
  }

  /* 左侧 */
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 180px;
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
    gap: 8px;
  }

  .logo {
    height: 24px;
    width: auto;
  }

  .logo-text {
    font-weight: 700;
    font-size: 18px;
    font-family: var(--font-family);
    white-space: nowrap;
  }

  /* 中间搜索区域 */
  .header-center {
    flex: 1;
    max-width: 720px;
    margin: 0 24px;
  }

  .search-container {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
  }

  .search-form {
    display: flex;
    align-items: center;
  }

  .search-input {
    border-radius: 20px 0 0 20px;
  }

  .search-input :deep(.n-input__border),
  .search-input :deep(.n-input__state-border) {
    border-radius: 20px 0 0 20px;
  }

  .search-input :deep(.n-input-wrapper) {
    padding-right: 16px;
  }

  .search-button {
    background-color: var(--bg-color-secondary);
    border: 1px solid var(--border-color);
    border-left: none;
    height: 34px;
    width: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    color: var(--text-color);
  }

  .search-button:hover {
    background-color: var(--hover-color);
  }

  /* 右侧用户区域 */
  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    min-width: 180px;
  }

  .header-icon-btn {
    cursor: pointer;
    color: var(--text-color);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .header-icon-btn:hover {
    background-color: var(--hover-color);
  }

  .icon-link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    width: 100%;
    height: 100%;
  }

  .admin-link {
    background-color: rgba(var(--primary-color-rgb), 0.1);
    border-radius: 18px;
    padding: 0 8px;
    gap: 4px;
    width: auto;
    transition: background-color 0.3s ease;
  }

  .admin-link:hover {
    background-color: rgba(var(--primary-color-rgb), 0.2);
  }

  .creator-link {
    background-color: rgba(33, 150, 243, 0.1);
    border-radius: 18px;
    padding: 0 8px;
    gap: 4px;
    width: auto;
    transition: background-color 0.3s ease;
  }

  .creator-link:hover {
    background-color: rgba(33, 150, 243, 0.2);
  }

  .creator-icon-text {
    font-size: 14px;
    font-weight: 500;
    margin-left: 4px;
    display: inline-block;
  }

  .admin-icon-text {
    font-size: 14px;
    font-weight: 500;
    margin-left: 4px;
    display: inline-block;
  }

  .user-area {
    margin-left: 8px;
  }

  .user-avatar-container {
    cursor: pointer;
  }

  .user-avatar {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .user-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .login-buttons {
    display: flex;
    gap: 8px;
  }

  /* 响应式样式 */
  @media (max-width: 768px) {
    .header-center {
      max-width: unset;
      margin: 0 8px;
    }

    .logo-text {
      display: none;
    }

    .admin-icon-text,
    .creator-icon-text {
      display: none;
    }

    .admin-link,
    .creator-link {
      padding: 0;
      width: 100%;
      border-radius: 50%;
    }
  }

  @media (max-width: 640px) {
    .search-button {
      display: none;
    }

    .search-input {
      border-radius: 20px;
    }

    .search-input :deep(.n-input__border),
    .search-input :deep(.n-input__state-border) {
      border-radius: 20px;
    }
  }

  @media (max-width: 480px) {
    .header-icon-btn {
      width: 32px;
      height: 32px;
    }

    .header-right {
      gap: 8px;
    }
  }
</style>