<!-- 顶部导航栏 -->
<template>
  <div class="flex flex-col w-full">
    <!-- 顶部工具栏 -->
    <div class="flex items-center justify-between w-full mb-4">
      <!-- 标题 -->
      <h1 class="text-xl font-bold">
        Atom Video
      </h1>

      <!-- 右侧工具栏 -->
      <div class="flex items-center">
        <!-- 搜索框 -->
        <div class="relative w-96 mr-8">
          <input type="text" v-model="searchQuery" @input="handleSearch" @focus="showSuggestions = true"
            :placeholder="t('common.searchPlaceholder')"
            class="w-full h-9 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
          <i class="fas fa-search absolute left-4 top-2.5 text-gray-400"></i>
          <i v-if="searchQuery"
            class="fas fa-times absolute right-4 top-2.5 text-gray-400 cursor-pointer hover:text-gray-600"
            @click="clearHistory"></i>

          <!-- 搜索建议 -->
          <div v-if="showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0)"
            class="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
            <!-- 搜索历史 -->
            <div v-if="!searchQuery && searchHistory.length > 0" class="p-2">
              <div class="flex items-center justify-between px-3 py-2">
                <span class="text-sm text-gray-500">{{ t('common.searchHistory') }}</span>
                <button @click="clearHistory"
                  class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {{ t('common.clearHistory') }}
                </button>
              </div>
              <div v-for="item in searchHistory" :key="item"
                class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                @click="selectSuggestion({ text: item, type: 'history' })">
                <i class="fas fa-history text-gray-400 mr-2"></i>
                <span>{{ item }}</span>
              </div>
            </div>

            <!-- 搜索建议 -->
            <div v-if="searchSuggestions.length > 0" class="p-2">
              <div v-for="suggestion in searchSuggestions" :key="suggestion.text"
                class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                @click="selectSuggestion(suggestion)">
                <!-- 视频缩略图 -->
                <img v-if="suggestion.type === 'video' && suggestion.thumbnail" :src="suggestion.thumbnail"
                  :alt="suggestion.text" class="w-16 h-9 object-cover rounded mr-3">
                <!-- 图标 -->
                <i v-else :class="['fas', suggestion.icon, 'text-gray-400 mr-2']"></i>

                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ suggestion.text }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ suggestion.description }}
                  </div>
                </div>

                <span class="ml-2 text-xs text-gray-400">
                  {{ t(`common.${suggestion.type}`) }}
                </span>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="isSearching" class="p-4 text-center text-gray-500">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              {{ t('common.loading') }}
            </div>
          </div>
        </div>

        <!-- 用户头像或登录按钮 -->
        <template v-if="userStore.token">
          <n-dropdown :options="userOptions" trigger="click" @select="handleSelect">
            <n-avatar :src="userStore.user?.avatar || '/default-avatar.png'" round size="medium"
              class="cursor-pointer" />
          </n-dropdown>
        </template>
        <template v-else>
          <n-button type="primary" @click="handleLogin">
            {{ t('header.login') }}
          </n-button>
        </template>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="flex items-center space-x-2 mb-4">
      <n-button v-for="category in videoCategories" :key="category.id"
        :type="selectedCategory === category.id ? 'primary' : 'default'" @click="handleCategoryChange(category.id)"
        quaternary>
        <template #icon>
          <i :class="['fas', category.icon]"></i>
        </template>
        {{ category.name }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, h } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/auth'
  import { useUserStore } from '@/stores/user'
  import { NButton, NDropdown, NAvatar } from 'naive-ui'
  import { useStorage } from '@vueuse/core'
  import { videoCategories } from '@/mock/videos'
  import { useVideoStore } from '@/stores/video'
  import { renderIcon } from '@/utils/icon'
  import { Search as SearchIcon, Person as PersonIcon } from '@vicons/ionicons5'
  import { NInput, NIcon } from 'naive-ui'
  import type { DropdownOption } from 'naive-ui'
  import type { Video } from '@/types'
  import { debounce } from 'lodash-es'

  const router = useRouter()
  const { t } = useI18n()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const videoStore = useVideoStore()

  const searchQuery = ref('')
  const showSuggestions = ref(false)
  const searchHistory = ref<string[]>(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
  const selectedCategory = ref('all')
  const isSearching = ref(false)

  // 搜索建议
  const searchSuggestions = computed(() => {
    if (!searchQuery.value) return []
    const query = searchQuery.value.toLowerCase()
    const suggestions = []

    // 从历史记录中匹配
    suggestions.push(...searchHistory.value
      .filter(item => item.toLowerCase().includes(query))
      .map(item => ({
        text: item,
        type: 'history',
        icon: 'fa-history',
        description: t('common.searchHistory')
      })))

    // 从视频标题中匹配
    suggestions.push(...videoStore.videos
      .filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(video => ({
        text: video.title,
        type: 'video',
        icon: 'fa-play-circle',
        description: `${formatViews(video.views)} 次观看`,
        thumbnail: video.thumbnail,
        id: video.id
      })))

    // 从标签中匹配
    const tags = videoCategories.map(cat => cat.name)
    suggestions.push(...tags
      .filter(tag => tag.toLowerCase().includes(query))
      .map(tag => ({
        text: tag,
        type: 'tag',
        icon: 'fa-tag',
        description: t('common.category')
      })))

    return suggestions
  })

  // 格式化观看次数
  const formatViews = (views: string) => {
    const viewCount = parseInt(views, 10)
    if (!isNaN(viewCount) && viewCount >= 10000) {
      return (viewCount / 10000).toFixed(1) + '万'
    }
    return views
  }

  // 防抖处理搜索
  const debouncedSearch = debounce(async () => {
    if (!searchQuery.value.trim()) {
      isSearching.value = false
      return
    }

    isSearching.value = true
    try {
      await videoStore.searchVideos(searchQuery.value)
    } finally {
      isSearching.value = false
    }
  }, 300)

  // 用户菜单选项
  const userOptions: DropdownOption[] = [
    {
      label: '个人主页',
      key: 'profile',
      icon: () => h(PersonIcon)
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: () => h(PersonIcon)
    }
  ]

  // 处理搜索
  const handleSearch = () => {
    if (!searchQuery.value.trim()) return

    // 保存到历史记录
    if (!searchHistory.value.includes(searchQuery.value)) {
      searchHistory.value.unshift(searchQuery.value)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }

    // 跳转到搜索结果页
    router.push({
      path: '/search',
      query: {
        q: searchQuery.value,
        category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined
      }
    })

    // 清空搜索框并隐藏建议
    searchQuery.value = ''
    showSuggestions.value = false
  }

  // 清除历史记录
  const clearHistory = () => {
    searchHistory.value = []
    localStorage.setItem('searchHistory', '[]')
  }

  // 选择搜索建议
  const selectSuggestion = (suggestion: { text: string, type: string, id?: string }) => {
    if (suggestion.type === 'video' && suggestion.id) {
      router.push(`/video/${suggestion.id}`)
    } else {
      searchQuery.value = suggestion.text
      handleSearch()
    }
    showSuggestions.value = false
  }

  // 处理分类变化
  const handleCategoryChange = (category: string) => {
    selectedCategory.value = category
    router.push({
      name: 'Home',
      query: { category: category === 'all' ? undefined : category }
    })
  }

  // 处理用户操作
  const handleSelect = (key: string) => {
    if (key === 'logout') {
      handleLogout()
    } else if (key === 'profile') {
      router.push('/profile')
    }
  }

  // 处理登录
  const handleLogin = () => {
    router.push('/auth')
  }

  // 处理退出登录
  const handleLogout = () => {
    userStore.logout()
    router.push('/login')
  }

  // 点击外部关闭搜索建议
  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      showSuggestions.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
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

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 64px;
    background: var(--surface);
    border-bottom: 1px solid var(--divider);
  }

  .header-left {
    flex: 0 0 200px;
  }

  .header-center {
    flex: 1;
    max-width: 600px;
    margin: 0 24px;
  }

  .header-right {
    flex: 0 0 200px;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: var(--primary);
    text-decoration: none;
  }

  .search-box {
    width: 100%;
  }

  .search-suggestion-enter-active,
  .search-suggestion-leave-active {
    transition: all 0.3s ease;
  }

  .search-suggestion-enter-from,
  .search-suggestion-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>