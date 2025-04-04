<!-- 侧边栏 -->
<template>
  <aside class="sidebar transition-all duration-300" :class="[collapsed ? 'w-16' : 'w-64']">
    <!-- Logo 区域 -->
    <div class="h-14 flex items-center px-4 border-b"
      :class="{ 'border-gray-200': !themeStore.isDark, 'border-gray-700': themeStore.isDark }">
      <div class="flex items-center cursor-pointer w-full" @click="toggleCollapse">
        <div class="text-2xl" :class="themeStore.isDark ? 'text-blue-500' : 'text-blue-700'">
          <i class="fas fa-play-circle"></i>
        </div>
        <span v-if="!collapsed" class="ml-3 text-xl font-bold theme-logo-text">
          Atom Video
        </span>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="py-4">
      <div class="space-y-1 px-2">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="flex items-center rounded-lg transition-colors" :class="[
            collapsed ? 'justify-center p-3' : 'px-3 py-2',
            route.path === item.path
              ? 'bg-blue-500 text-white'
              : themeStore.isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
          ]">
          <i :class="['fas', item.icon, collapsed ? 'text-xl' : 'w-5']"></i>
          <span v-if="!collapsed" class="ml-3">{{ t(item.i18nKey) }}</span>
        </router-link>
      </div>

      <!-- 分类 -->
      <div v-if="!collapsed" class="mt-8">
        <h3 class="px-4 mb-2 text-xs font-semibold uppercase tracking-wider"
          :class="themeStore.isDark ? 'text-gray-500' : 'text-gray-600'">
          {{ t('sidebar.categories.title') }}
        </h3>
        <div class="space-y-1 px-2">
          <a v-for="category in categories" :key="category.id" href="#"
            class="flex items-center px-3 py-2 rounded-lg text-sm transition-colors"
            :class="themeStore.isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'">
            <img :src="category.avatar" :alt="t(`sidebar.categories.${category.i18nKey}`)" class="w-6 h-6 rounded-full">
            <span class="ml-3">{{ t(`sidebar.categories.${category.i18nKey}`) }}</span>
          </a>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useThemeStore } from '@/stores/theme'

  const { t } = useI18n()
  const route = useRoute()
  const themeStore = useThemeStore()

  const props = defineProps<{
    collapsed: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void
  }>()

  const toggleCollapse = () => {
    emit('update:collapsed', !props.collapsed)
  }

  const menuItems = [
    { path: '/', icon: 'fa-home', i18nKey: 'sidebar.home' },
    { path: '/explore', icon: 'fa-compass', i18nKey: 'sidebar.explore' },
    { path: '/subscriptions', icon: 'fa-play', i18nKey: 'sidebar.subscriptions' },
    { path: '/library', icon: 'fa-folder', i18nKey: 'sidebar.library' },
    { path: '/history', icon: 'fa-history', i18nKey: 'sidebar.history' },
  ]

  const categories = [
    { id: 1, i18nKey: 'tech', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, i18nKey: 'learning', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, i18nKey: 'webdev', avatar: 'https://i.pravatar.cc/150?img=3' },
  ]
</script>

<style scoped>
  .theme-logo-text {
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>