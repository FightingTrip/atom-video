<template>
  <div class="relative">
    <n-input-group>
      <n-input v-model:value="searchQuery" type="text" :placeholder="t('header.search')" clearable @input="handleInput"
        @clear="clearSearch" class="search-input">
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
        <template #suffix v-if="showAdvanced">
          <n-button quaternary circle @click="toggleAdvanced">
            <template #icon>
              <n-icon :component="FilterOutline" />
            </template>
          </n-button>
        </template>
      </n-input>
    </n-input-group>

    <!-- 搜索建议下拉框 -->
    <div v-if="showSuggestions" class="suggestions-dropdown">
      <!-- 搜索历史 -->
      <div v-if="searchHistory.length && !searchQuery" class="suggestions-section">
        <div class="suggestions-header">
          <span>{{ t('search.history') }}</span>
          <n-button text @click="clearHistory">
            <template #icon>
              <n-icon :component="TrashOutline" />
            </template>
            {{ t('search.clearHistory') }}
          </n-button>
        </div>
        <div class="suggestions-list">
          <div v-for="item in searchHistory" :key="item" class="suggestion-item" @click="selectSuggestion(item)">
            <n-icon :component="TimeOutline" class="suggestion-icon" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- 搜索建议 -->
      <div v-if="searchQuery" class="suggestions-section">
        <div class="suggestions-header">
          <span>{{ t('search.suggestions') }}</span>
        </div>
        <div class="suggestions-list">
          <div v-for="suggestion in filteredSuggestions" :key="suggestion.text" class="suggestion-item"
            @click="selectSuggestion(suggestion.text)">
            <n-icon :component="suggestion.icon" class="suggestion-icon" />
            <span>{{ suggestion.text }}</span>
            <span class="suggestion-type">{{ suggestion.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级搜索抽屉 -->
    <n-drawer v-model:show="showAdvancedDrawer" :width="300" placement="right">
      <n-drawer-content :title="t('search.advancedSearch')">
        <div class="space-y-6">
          <!-- 时间范围 -->
          <div>
            <h3 class="text-sm font-medium mb-2">{{ t('search.timeRange') }}</h3>
            <n-select v-model:value="advancedFilters.timeRange" :options="timeRangeOptions"
              :placeholder="t('search.selectTimeRange')" />
          </div>

          <!-- 视频时长 -->
          <div>
            <h3 class="text-sm font-medium mb-2">{{ t('search.duration') }}</h3>
            <n-select v-model:value="advancedFilters.duration" :options="durationOptions"
              :placeholder="t('search.selectDuration')" />
          </div>

          <!-- 排序方式 -->
          <div>
            <h3 class="text-sm font-medium mb-2">{{ t('search.sortBy') }}</h3>
            <n-select v-model:value="advancedFilters.sort" :options="sortOptions"
              :placeholder="t('search.selectSortBy')" />
          </div>

          <!-- 筛选按钮 -->
          <div class="flex justify-end space-x-2">
            <n-button @click="resetAdvancedFilters">{{ t('common.reset') }}</n-button>
            <n-button type="primary" @click="applyAdvancedFilters">
              {{ t('common.apply') }}
            </n-button>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useStorage } from '@vueuse/core'
  import {
    NInput,
    NInputGroup,
    NIcon,
    NButton,
    NDrawer,
    NDrawerContent,
    NSelect
  } from 'naive-ui'
  import {
    SearchOutline,
    FilterOutline,
    TimeOutline,
    TrashOutline,
    VideocamOutline,
    PersonOutline,
    PricetagOutline
  } from '@vicons/ionicons5'
  import { useVideoStore } from '../stores/video'

  const router = useRouter()
  const { t } = useI18n()
  const videoStore = useVideoStore()

  const searchQuery = ref('')
  const showAdvanced = ref(true)
  const showAdvancedDrawer = ref(false)
  const showSuggestions = ref(false)

  // 搜索历史
  const searchHistory = useStorage('searchHistory', [] as string[])

  // 高级筛选选项
  const advancedFilters = ref({
    timeRange: null,
    duration: null,
    sort: 'relevance'
  })

  // 时间范围选项
  const timeRangeOptions = computed(() => [
    { label: t('search.timeRange.all'), value: 'all' },
    { label: t('search.timeRange.today'), value: 'today' },
    { label: t('search.timeRange.week'), value: 'week' },
    { label: t('search.timeRange.month'), value: 'month' },
    { label: t('search.timeRange.year'), value: 'year' }
  ])

  // 视频时长选项
  const durationOptions = computed(() => [
    { label: t('search.duration.all'), value: 'all' },
    { label: t('search.duration.short'), value: 'short' },
    { label: t('search.duration.medium'), value: 'medium' },
    { label: t('search.duration.long'), value: 'long' }
  ])

  // 排序方式选项
  const sortOptions = computed(() => [
    { label: t('search.sortBy.relevance'), value: 'relevance' },
    { label: t('search.sortBy.date'), value: 'date' },
    { label: t('search.sortBy.views'), value: 'views' },
    { label: t('search.sortBy.likes'), value: 'likes' }
  ])

  // 搜索建议
  const suggestions = computed(() => {
    if (!searchQuery.value) return []

    const query = searchQuery.value.toLowerCase()
    const results = []

    // 从视频标题中搜索
    results.push(...videoStore.videos
      .filter(video => video.title.toLowerCase().includes(query))
      .map(video => ({
        text: video.title,
        type: t('search.type.video'),
        icon: VideocamOutline
      })))

    // 从标签中搜索
    results.push(...videoStore.allTags
      .filter(tag => tag.toLowerCase().includes(query))
      .map(tag => ({
        text: tag,
        type: t('search.type.tag'),
        icon: PricetagOutline
      })))

    // 从创作者中搜索
    results.push(...videoStore.creators
      .filter(creator => creator.name.toLowerCase().includes(query))
      .map(creator => ({
        text: creator.name,
        type: t('search.type.creator'),
        icon: PersonOutline
      })))

    return results
  })

  // 过滤后的建议（最多显示 8 个）
  const filteredSuggestions = computed(() => {
    return suggestions.value.slice(0, 8)
  })

  // 处理输入
  const handleInput = () => {
    showSuggestions.value = true
  }

  // 选择建议
  const selectSuggestion = (text: string) => {
    searchQuery.value = text
    showSuggestions.value = false
    addToHistory(text)
    router.push({
      name: 'Search',
      query: {
        q: text,
        ...advancedFilters.value
      }
    })
  }

  // 添加到搜索历史
  const addToHistory = (text: string) => {
    if (!searchHistory.value.includes(text)) {
      searchHistory.value.unshift(text)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
    }
  }

  // 清除搜索历史
  const clearHistory = () => {
    searchHistory.value = []
  }

  // 清除搜索
  const clearSearch = () => {
    searchQuery.value = ''
    showSuggestions.value = false
  }

  // 切换高级搜索抽屉
  const toggleAdvanced = () => {
    showAdvancedDrawer.value = true
  }

  // 重置高级筛选
  const resetAdvancedFilters = () => {
    advancedFilters.value = {
      timeRange: null,
      duration: null,
      sort: 'relevance'
    }
  }

  // 应用高级筛选
  const applyAdvancedFilters = () => {
    router.push({
      name: 'Search',
      query: {
        q: searchQuery.value,
        ...advancedFilters.value
      }
    })
    showAdvancedDrawer.value = false
  }

  // 点击外部关闭建议框
  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      showSuggestions.value = false
    }
  }

  // 监听点击事件
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped>
  .search-input {
    @apply w-full;
  }

  .suggestions-dropdown {
    @apply absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700;
    max-height: 400px;
    overflow-y: auto;
  }

  .suggestions-section {
    @apply py-2;
  }

  .suggestions-header {
    @apply flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400;
  }

  .suggestions-list {
    @apply space-y-1;
  }

  .suggestion-item {
    @apply flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer;
  }

  .suggestion-icon {
    @apply w-4 h-4 mr-3 text-gray-400;
  }

  .suggestion-type {
    @apply ml-auto text-xs text-gray-400;
  }
</style>