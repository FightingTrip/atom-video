<template>
  <header
    class="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
    <div class="flex items-center justify-between h-full px-4">
      <!-- 左侧区域：菜单按钮和 Logo -->
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          @click="toggleSidebar" aria-label="Toggle sidebar">
          <i class="fas fa-bars text-lg text-gray-600 dark:text-gray-300"></i>
        </button>
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fas fa-play text-white"></i>
          </div>
          <span class="text-xl font-bold hidden sm:inline text-gray-900 dark:text-white">Atom Video</span>
        </router-link>
      </div>

      <!-- 中间区域：搜索框 -->
      <div class="flex-1 max-w-2xl mx-4">
        <SearchBar />
      </div>

      <!-- 右侧区域：用户菜单 -->
      <div class="flex items-center gap-2">
        <template v-if="!authStore.isAuthenticated">
          <n-button secondary class="hidden sm:inline-flex min-w-20" @click="router.push('/auth')">
            登录
          </n-button>
          <n-button type="primary" class="min-w-20" @click="router.push('/auth')">
            注册
          </n-button>
        </template>

        <template v-else>
          <n-dropdown :options="userMenuOptions" @select="handleMenuSelect">
            <div class="cursor-pointer flex items-center">
              <img :src="authStore.user?.avatar || '/default-avatar.png'" alt="User avatar"
                class="h-8 w-8 rounded-full object-cover" />
            </div>
          </n-dropdown>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { NButton, NDropdown } from 'naive-ui'
  import { useAuthStore } from '../stores/auth'
  import SearchBar from './SearchBar.vue'

  const router = useRouter()
  const authStore = useAuthStore()

  // 用户菜单选项
  const userMenuOptions = [
    {
      label: '个人资料',
      key: 'profile',
      icon: 'fas fa-user'
    },
    {
      label: '系统设置',
      key: 'settings',
      icon: 'fas fa-cog'
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: 'fas fa-sign-out-alt'
    }
  ]

  // 处理菜单选择
  const handleMenuSelect = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'logout':
        authStore.logout()
        router.push('/auth')
        break
    }
  }

  // 处理侧边栏切换
  const toggleSidebar = () => {
    // 实现侧边栏切换逻辑
  }
</script>

<style scoped>
  .header-shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
</style>