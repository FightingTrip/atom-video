/**
* @file TheHeader.vue
* @description 顶部导航栏组件
* @features
* - 响应式导航
* - 主题切换
* - 用户菜单
* - 搜索功能
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <header class="the-header">
    <div class="header-content">
      <!-- 左侧 Logo 和导航 -->
      <div class="header-left">
        <router-link to="/" class="logo">
          <img src="@/assets/logo.svg" alt="Atom Video" />
        </router-link>
        <nav class="nav-menu" v-if="!isMobile">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item"
            :class="{ active: isActive(item.path) }">
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <!-- 右侧搜索和用户菜单 -->
      <div class="header-right">
        <div class="search-box" v-if="!isMobile">
          <n-input v-model:value="searchQuery" placeholder="搜索视频..." clearable @keydown.enter="handleSearch">
            <template #prefix>
              <n-icon>
                <SearchIcon />
              </n-icon>
            </template>
          </n-input>
        </div>

        <div class="user-menu">
          <n-dropdown v-if="isLoggedIn" :options="userMenuOptions" @select="handleUserMenuSelect">
            <n-avatar :src="userAvatar" :fallback-src="defaultAvatar" round size="medium" />
          </n-dropdown>
          <template v-else>
            <n-button quaternary @click="handleLogin">
              登录
            </n-button>
            <n-button type="primary" @click="handleRegister">
              注册
            </n-button>
          </template>
        </div>

        <ThemeToggle class="theme-toggle" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { NInput, NIcon, NDropdown, NAvatar, NButton } from 'naive-ui'
  import { Search as SearchIcon } from '@vicons/ionicons5'
  import ThemeToggle from '@/components/common/ThemeToggle.vue'
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  // 导航菜单项
  const navItems = [
    { name: '首页', path: '/' },
    { name: '发现', path: '/discover' },
    { name: '关注', path: '/following' },
    { name: '上传', path: '/upload' }
  ]

  // 用户菜单选项
  const userMenuOptions = [
    {
      label: '个人中心',
      key: 'profile'
    },
    {
      label: '我的视频',
      key: 'videos'
    },
    {
      label: '收藏夹',
      key: 'favorites'
    },
    {
      label: '设置',
      key: 'settings'
    },
    {
      type: 'divider',
      key: 'divider'
    },
    {
      label: '退出登录',
      key: 'logout'
    }
  ]

  // 响应式状态
  const isMobile = computed(() => window.innerWidth < 768)
  const isLoggedIn = computed(() => userStore.isLoggedIn)
  const userAvatar = computed(() => userStore.user?.avatar)
  const defaultAvatar = '/images/default-avatar.png'

  // 搜索相关
  const searchQuery = ref('')
  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
    }
  }

  // 用户菜单相关
  const handleUserMenuSelect = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/profile')
        break
      case 'videos':
        router.push('/my-videos')
        break
      case 'favorites':
        router.push('/favorites')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'logout':
        userStore.logout()
        router.push('/login')
        break
    }
  }

  // 登录注册相关
  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  // 导航激活状态
  const isActive = (path: string) => {
    return route.path === path
  }
</script>

<style scoped>
  .the-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);
    z-index: var(--z-index-header);
  }

  .header-content {
    max-width: var(--max-width);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo img {
    height: 32px;
    width: auto;
  }

  .nav-menu {
    display: flex;
    gap: var(--spacing-md);
  }

  .nav-item {
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--text-color);
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: all var(--transition-duration);
  }

  .nav-item:hover {
    background-color: var(--background-color-hover);
  }

  .nav-item.active {
    color: var(--primary-color);
    font-weight: 500;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .search-box {
    width: 300px;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .theme-toggle {
    margin-left: var(--spacing-sm);
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 0 var(--spacing-md);
    }

    .search-box {
      display: none;
    }
  }
</style>