<template>
  <div class="relative w-full">
    <div class="relative flex items-center">
      <div class="absolute left-4 text-gray-400">
        <i class="fas fa-search"></i>
      </div>
      <input v-model="searchQuery" type="text"
        class="w-full h-10 pl-11 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
        :placeholder="$t('search.placeholder')" @focus="showSuggestions = true" @blur="handleBlur"
        @keydown.enter="handleSearch">
      <div v-if="searchQuery" class="absolute right-4 text-gray-400 cursor-pointer hover:text-gray-600"
        @click="clearSearch">
        <i class="fas fa-times"></i>
      </div>
    </div>

    <!-- 搜索建议 -->
    <div v-if="showSuggestions && (searchQuery || recentSearches.length > 0)"
      class="absolute w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
      <div v-if="loading" class="p-4 text-center">
        <n-spin size="small" />
      </div>
      <template v-else>
        <!-- 最近搜索 -->
        <div v-if="recentSearches.length > 0 && !searchQuery">
          <div class="px-4 py-2 text-sm text-gray-500">
            {{ $t('search.recent') }}
          </div>
          <div v-for="item in recentSearches" :key="item"
            class="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            @click="selectSuggestion(item)">
            <i class="fas fa-history text-gray-400"></i>
            <span>{{ item }}</span>
            <i class="fas fa-times ml-auto text-gray-400 hover:text-gray-600"
              @click.stop="removeRecentSearch(item)"></i>
          </div>
        </div>

        <!-- 搜索建议 -->
        <template v-if="searchQuery && suggestions.length > 0">
          <div v-for="suggestion in suggestions" :key="suggestion"
            class="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            @click="selectSuggestion(suggestion)">
            <i class="fas fa-search text-gray-400"></i>
            <span v-html="highlightQuery(suggestion)"></span>
          </div>
        </template>

        <!-- 无结果 -->
        <div v-if="searchQuery && suggestions.length === 0" class="px-4 py-3 text-center text-gray-500">
          {{ $t('search.noResults') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { debounce } from 'lodash-es';

  const router = useRouter();
  const searchQuery = ref('');
  const showSuggestions = ref(false);
  const loading = ref(false);
  const recentSearches = useStorage<string[]>('recent-searches', []);

  // 模拟搜索建议
  const suggestions = computed(() => {
    if (!searchQuery.value) return [];
    return [
      'Vue.js 教程',
      'Vue 3 组件开发',
      'Vue Router 使用指南',
      'Vuex 状态管理',
      'Vue 3 性能优化'
    ].filter(item =>
      item.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const handleSearch = () => {
    if (!searchQuery.value.trim()) return;

    // 保存到最近搜索
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value);
      if (recentSearches.value.length > 5) {
        recentSearches.value.pop();
      }
    }

    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    });
    showSuggestions.value = false;
  };

  const selectSuggestion = (text: string) => {
    searchQuery.value = text;
    handleSearch();
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  const removeRecentSearch = (item: string) => {
    const index = recentSearches.value.indexOf(item);
    if (index > -1) {
      recentSearches.value.splice(index, 1);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      showSuggestions.value = false;
    }, 200);
  };

  const highlightQuery = (text: string) => {
    if (!searchQuery.value) return text;
    const regex = new RegExp(`(${searchQuery.value})`, 'gi');
    return text.replace(regex, '<span class="text-blue-500">$1</span>');
  };
</script>