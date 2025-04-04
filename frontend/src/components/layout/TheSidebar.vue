<!-- 侧边栏 -->
<template>
  <aside class="bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300"
    :class="[collapsed ? 'w-16' : 'w-64']">
    <!-- Logo 区域 -->
    <div class="h-14 flex items-center px-4 border-b dark:border-gray-700">
      <div class="flex items-center cursor-pointer" @click="toggleCollapse">
        <div class="text-2xl text-blue-500">
          <i class="fas fa-play-circle"></i>
        </div>
        <span v-if="!collapsed" class="ml-3 text-xl font-bold">
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
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]">
          <i :class="['fas', item.icon, collapsed ? 'text-xl' : 'w-5']"></i>
          <span v-if="!collapsed" class="ml-3">{{ item.name }}</span>
        </router-link>
      </div>

      <!-- 订阅频道 -->
      <div v-if="!collapsed" class="mt-8">
        <h3 class="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          订阅频道
        </h3>
        <div class="space-y-1 px-2">
          <a v-for="channel in subscribedChannels" :key="channel.id" href="#"
            class="flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <img :src="channel.avatar" :alt="channel.name" class="w-6 h-6 rounded-full">
            <span class="ml-3">{{ channel.name }}</span>
          </a>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'

  const route = useRoute()
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
    { name: '首页', path: '/', icon: 'fa-home' },
    { name: '探索', path: '/explore', icon: 'fa-compass' },
    { name: '订阅', path: '/subscriptions', icon: 'fa-play' },
    { name: '收藏', path: '/library', icon: 'fa-folder' },
    { name: '历史记录', path: '/history', icon: 'fa-history' },
  ]

  const subscribedChannels = [
    { id: 1, name: '技术探索', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: '编程学习', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Web开发', avatar: 'https://i.pravatar.cc/150?img=3' },
  ]
</script>