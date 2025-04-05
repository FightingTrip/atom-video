<!-- 顶部导航栏 -->
<template>
  <div class="flex items-center justify-between w-full">
    <!-- 标题 -->
    <h1 class="text-xl font-bold theme-title">
      Make Develop All In One
    </h1>

    <!-- 右侧工具栏 -->
    <div class="flex items-center">
      <!-- 搜索框 -->
      <div class="relative w-96 mr-8">
        <input type="text" v-model="searchQuery" @keyup.enter="handleSearch" :placeholder="t('header.search')"
          class="w-full h-9 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
        <i class="fas fa-search absolute left-4 top-2.5 text-gray-400 cursor-pointer" @click="handleSearch"></i>
      </div>

      <!-- 标签系统 -->
      <div class="flex items-center space-x-4 mr-8">
        <n-select v-model:value="selectedTag" :options="tagOptions" placeholder="选择标签" @update:value="handleTagChange"
          style="width: 120px" />
      </div>

      <!-- 语言切换 -->
      <n-dropdown :options="languageOptions" @select="handleLanguageChange" trigger="click">
        <n-button quaternary>
          <template #icon>
            <i class="fas fa-globe text-lg"></i>
          </template>
          <span class="ml-1">{{ currentLanguageLabel }}</span>
        </n-button>
      </n-dropdown>

      <!-- 主题切换 -->
      <n-button quaternary @click="toggleTheme" class="mr-4">
        <template #icon>
          <i :class="['fas', themeStore.isDark ? 'fa-sun' : 'fa-moon', 'text-lg']"></i>
        </template>
      </n-button>

      <!-- 用户头像或登录按钮 -->
      <template v-if="authStore.isAuthenticated">
        <n-dropdown :options="userOptions" trigger="click" @select="handleUserAction">
          <n-avatar :src="authStore.user?.avatar || '/default-avatar.png'" round size="medium" class="cursor-pointer" />
        </n-dropdown>
      </template>
      <template v-else>
        <n-button type="primary" @click="handleLogin">
          {{ t('header.login') }}
        </n-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useThemeStore } from '@/stores/theme'
  import { useI18nStore } from '@/stores/i18n'
  import { useAuthStore } from '@/stores/auth'
  import { NButton, NDropdown, NAvatar, NSelect, useMessage } from 'naive-ui'

  const router = useRouter()
  const { t } = useI18n()
  const message = useMessage()
  const themeStore = useThemeStore()
  const i18nStore = useI18nStore()
  const authStore = useAuthStore()

  const searchQuery = ref('')
  const selectedTag = ref(null)

  // 标签选项
  const tagOptions = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Vue', value: 'vue' },
    { label: 'React', value: 'react' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' }
  ]

  // 用户下拉菜单选项
  const userOptions = [
    {
      label: '个人资料',
      key: 'profile',
      icon: 'fas fa-user'
    },
    {
      label: '设置',
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

  const currentLanguageLabel = computed(() =>
    i18nStore.currentLocale === 'zh-CN' ? '简体中文' : 'English'
  )

  const languageOptions = [
    {
      label: '简体中文',
      key: 'zh-CN',
    },
    {
      label: 'English',
      key: 'en-US',
    }
  ]

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        name: 'Search',
        query: {
          q: searchQuery.value,
          tag: selectedTag.value
        }
      })
    }
  }

  // 处理标签变化
  const handleTagChange = (value: string) => {
    router.push({
      name: 'TagDetail',
      params: { id: value }
    })
  }

  // 处理用户操作
  const handleUserAction = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'logout':
        authStore.logout()
        router.push('/')
        message.success('已退出登录')
        break
    }
  }

  // 处理登录
  const handleLogin = () => {
    router.push('/auth')
  }

  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key)
    if (message) {
      message.success(key === 'zh-CN' ? '已切换到简体中文' : 'Switched to English')
    }
  }

  const toggleTheme = () => {
    themeStore.toggleTheme()
    if (message) {
      message.success(themeStore.isDark ? '已切换到深色主题' : '已切换到浅色主题')
    }
  }

  // 监听主题变化，实现动画过渡效果
  watch(() => themeStore.isDark, () => {
    document.documentElement.style.transition = 'background-color 0.5s, color 0.5s, border-color 0.5s'
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 500)
  })
</script>

<style scoped>

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .group:hover .absolute {
    animation: fadeIn 0.2s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -5px);
    }

    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .theme-title {
    color: var(--text-color);
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>