<!-- 侧边栏 -->
<template>
  <aside
    class="fixed left-0 top-14 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
    <nav class="h-full flex flex-col">
      <!-- 主导航 -->
      <div class="flex-1 overflow-y-auto">
        <div class="py-4">
          <router-link v-for="item in mainNavItems" :key="item.path" :to="item.path"
            class="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
            <i :class="['fas', item.icon, 'w-6']"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </div>

        <!-- 订阅频道 -->
        <div v-if="isLoggedIn" class="py-4 border-t dark:border-gray-800">
          <h3 class="px-6 py-2 text-sm font-semibold text-gray-500">订阅的频道</h3>
          <router-link v-for="channel in subscribedChannels" :key="channel.id" :to="`/channel/${channel.id}`"
            class="flex items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
            <img :src="channel.avatar" :alt="channel.name" class="w-6 h-6 rounded-full">
            <span class="ml-3">{{ channel.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- 底部链接 -->
      <div class="p-4 border-t dark:border-gray-800">
        <div class="flex flex-wrap gap-2 text-sm text-gray-500">
          <a href="#" class="hover:text-gray-700">关于我们</a>
          <a href="#" class="hover:text-gray-700">使用条款</a>
          <a href="#" class="hover:text-gray-700">隐私政策</a>
        </div>
        <div class="mt-2 text-xs text-gray-400">
          © 2024 Atom Video. All rights reserved.
        </div>
      </div>
    </nav>
  </aside>
</template>