<!--
 * @description 全局搜索组件
 * @features
 * - 搜索建议：支持历史记录、视频和标签建议
 * - 历史记录：支持清除历史
 * - 实时搜索：支持防抖处理
 * - 主题适配：支持明暗主题
 -->
<template>
  <div class="relative w-full max-w-xl">
    <input type="text" v-model="searchQuery" @input="handleSearch" @focus="showSuggestions = true"
      :placeholder="t('common.searchPlaceholder')"
      class="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
    <i class="fas fa-search absolute left-4 top-3 text-gray-400"></i>
    <i v-if="searchQuery" class="fas fa-times absolute right-4 top-3 text-gray-400 cursor-pointer hover:text-gray-600"
      @click="clearHistory"></i>

    <!-- 搜索建议 -->
    <div v-if="showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0)"
      class="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
      <!-- 搜索历史 -->
      <div v-if="!searchQuery && searchHistory.length > 0" class="p-2">
        <div class="flex items-center justify-between px-3 py-2">
          <span class="text-sm text-gray-500">{{ t('common.searchHistory') }}</span>
          <button @click="clearHistory" class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            {{ t('common.clearHistory') }}
          </button>
        </div>
        <div v-for="item in searchHistory" :key="item"
          class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" @click="selectSuggestion({
            text: item,
            type: 'history',
            icon: 'fa-history',
            description: t('common.searchHistory')
          })">
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
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useVideoStore } from '@/stores/video'
  import { videoCategories } from '@/mock/videos'
  import { debounce } from 'lodash-es'

  const router = useRouter()
  const { t } = useI18n()
  const videoStore = useVideoStore()

  const searchQuery = ref('')
  const showSuggestions = ref(false)
  const searchHistory = ref<string[]>(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
  const isSearching = ref(false)

  interface SearchSuggestion {
    text: string
    type: string
    icon: string
    description: string
    thumbnail?: string
    id?: string
  }

  // 搜索建议
  const searchSuggestions = computed(() => {
    if (!searchQuery.value) return []
    const query = searchQuery.value.toLowerCase()
    const suggestions: SearchSuggestion[] = []

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
  const formatViews = (views: number) => {
    if (views >= 10000) {
      return (views / 10000).toFixed(1) + '万'
    }
    return views.toString()
  }

  // 处理搜索
  const handleSearch = debounce(() => {
    if (searchQuery.value) {
      isSearching.value = true
      // 模拟搜索延迟
      setTimeout(() => {
        isSearching.value = false
      }, 500)
    }
  }, 300)

  // 选择建议
  const selectSuggestion = (suggestion: SearchSuggestion) => {
    searchQuery.value = suggestion.text
    showSuggestions.value = false

    // 保存到历史记录
    if (!searchHistory.value.includes(suggestion.text)) {
      searchHistory.value.unshift(suggestion.text)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }

    // 根据类型处理跳转
    if (suggestion.type === 'video' && suggestion.id) {
      router.push(`/video/${suggestion.id}`)
    } else if (suggestion.type === 'tag') {
      router.push({
        path: '/',
        query: { tag: suggestion.text }
      })
    } else {
      router.push({
        path: '/search',
        query: { q: suggestion.text }
      })
    }
  }

  // 清除历史
  const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }

  // 点击外部关闭建议
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.search-container')) {
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
  .search-container {
    position: relative;
  }
</style>