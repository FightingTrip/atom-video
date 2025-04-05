<template>
  <div class="flex h-screen app-container">
    <!-- 侧边栏 -->
    <TheSidebar v-model:collapsed="sidebarCollapsed" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航栏 - 搜索栏居中，标题和功能按钮靠两边 -->
      <div class="h-14 flex items-center px-6 border-b theme-header">
        <!-- 左侧标题 -->
        <h1 class="text-xl font-bold theme-title whitespace-nowrap">
          Make Develop All In One
        </h1>

        <!-- 中间搜索栏 -->
        <div class="flex-1 mx-4 flex justify-center">
          <div class="relative w-full max-w-xl">
            <input type="text" :placeholder="t('header.search')"
              class="w-full h-10 pl-10 pr-10 rounded-full bg-gray-700 dark:bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600" />
            <i class="fas fa-search absolute left-4 top-3 text-gray-400"></i>
            <div class="absolute right-2 top-1.5 h-7 w-7 flex items-center justify-center rounded-full">
              <i class="fas fa-microphone text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- 右侧功能按钮 -->
        <div class="flex items-center space-x-2 whitespace-nowrap">
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
          <n-button quaternary @click="toggleTheme">
            <template #icon>
              <i :class="['fas', themeStore.isDark ? 'fa-sun' : 'fa-moon', 'text-lg']"></i>
            </template>
          </n-button>

          <!-- 未登录显示登录按钮，已登录显示用户菜单 -->
          <template v-if="!authStore.isAuthenticated">
            <n-button type="primary" @click="handleLogin">
              {{ t('header.login') }}
            </n-button>
          </template>
          <template v-else>
            <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
              <div class="flex items-center cursor-pointer">
                <img :src="authStore.user?.avatar || 'https://i.pravatar.cc/150?img=1'" alt="User Avatar"
                  class="w-8 h-8 rounded-full object-cover" />
                <span class="ml-2 text-sm">{{ authStore.user?.username }}</span>
              </div>
            </n-dropdown>
          </template>
        </div>
      </div>

      <!-- 标签导航 -->
      <div class="h-12 flex items-center space-x-2 px-4 overflow-x-auto theme-tag-bar">
        <button v-for="tag in tags" :key="tag.id" :class="[
          'px-4 py-1 rounded-full text-sm font-medium transition-colors theme-tag',
          selectedTag === tag.id ? 'theme-tag-active' : 'theme-tag-inactive'
        ]" @click="selectTag(tag.id)">
          {{ t(`tags.${tag.name}`) }}
        </button>
      </div>

      <!-- 主内容 -->
      <main class="flex-1 overflow-auto theme-content p-4">
        <router-view />
      </main>

      <!-- 底部 -->
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, h } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { NButton, NDropdown } from 'naive-ui'
  import { useVideoStore } from '@/stores/video'
  import { useI18nStore } from '@/stores/i18n'
  import { useThemeStore } from '@/stores/theme'
  import { useAuthStore } from '@/stores/auth'
  import TheSidebar from '@/components/layout/TheSidebar.vue'
  import TheFooter from '@/components/layout/TheFooter.vue'

  const { t } = useI18n()
  const router = useRouter()
  const videoStore = useVideoStore()
  const i18nStore = useI18nStore()
  const themeStore = useThemeStore()
  const authStore = useAuthStore()

  const sidebarCollapsed = ref(false)
  const selectedTag = ref('all')

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

  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key)
  }

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  const userMenuOptions = computed(() => [
    {
      label: t('user.profile'),
      key: 'profile',
      icon: renderIcon('fa-user')
    },
    {
      label: t('user.settings'),
      key: 'settings',
      icon: renderIcon('fa-cog')
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: t('user.logout'),
      key: 'logout',
      icon: renderIcon('fa-sign-out-alt')
    }
  ])

  function renderIcon(icon: string) {
    return () => h('i', { class: ['fas', icon] })
  }

  const handleLogin = () => {
    router.push('/auth')
  }

  const handleUserMenuSelect = (key: string) => {
    if (key === 'logout') {
      authStore.logout()
      router.push('/')
    } else if (key === 'profile') {
      router.push('/profile')
    } else if (key === 'settings') {
      router.push('/settings')
    }
  }

  const tags = [
    { id: 'all', name: 'all' },
    { id: 'javascript', name: 'javascript' },
    { id: 'typescript', name: 'typescript' },
    { id: 'vue', name: 'vue' },
    { id: 'react', name: 'react' },
    { id: 'nodejs', name: 'nodejs' },
    { id: 'python', name: 'python' },
  ]

  const selectTag = (tagId: string) => {
    selectedTag.value = tagId
    videoStore.setCategory(tagId)
  }
</script>

<style scoped>
  .theme-title {
    color: var(--text-color);
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>