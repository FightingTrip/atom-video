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
          <img src="@/assets/logo/logo.svg" alt="Atom Video" class="logo" />
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
        <!-- 上传按钮 -->
        <div class="header-icon-btn" v-if="isLoggedIn">
          <router-link to="/video/upload" class="icon-link">
            <n-icon size="24">
              <VideocamOutline />
            </n-icon>
          </router-link>
        </div>

        <!-- 夜间模式切换 -->
        <div class="header-icon-btn" @click="toggleTheme">
          <n-icon size="24">
            <component :is="isDarkMode ? SunnyOutline : MoonOutline" />
          </n-icon>
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
  import { NInput, NIcon, NDropdown, NAvatar, NButton } from 'naive-ui'
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
    TimeOutline
  } from '@vicons/ionicons5'
  import { useUserStore } from '@/stores/user'
  import { useAuthStore } from '@/stores/auth'
  import { useThemeStore } from '@/stores/theme'

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
  const userAvatar = computed(() => userStore.avatarUrl || 'https://i.pravatar.cc/150?img=1')

  // 用户菜单选项
  const userMenuOptions = [
    {
      label: '个人中心',
      key: 'profile',
      icon: () => h(PersonCircleOutline)
    },
    {
      label: '我的视频',
      key: 'videos',
      icon: () => h(VideocamOutline)
    },
    {
      label: '收藏',
      key: 'favorites',
      icon: () => h(BookmarkOutline)
    },
    {
      label: '历史记录',
      key: 'history',
      icon: () => h(TimeOutline)
    },
    {
      label: '设置',
      key: 'settings',
      icon: () => h(SettingsOutline)
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: () => h(LogOutOutline)
    }
  ]

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
  const handleUserMenuSelect = (key: string) => {
    switch (key) {
      case 'profile':
        router.push(`/user/${userStore.userId}`)
        break
      case 'videos':
        router.push('/video/list')
        break
      case 'favorites':
        router.push('/library')
        break
      case 'history':
        router.push('/library/history')
        break
      case 'settings':
        router.push('/user/settings')
        break
      case 'logout':
        authStore.logout()
        router.push('/')
        break
    }
  }

  // 登录处理
  const handleLogin = () => {
    router.push('/auth/login')
  }
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