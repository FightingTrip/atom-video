<!-- 
  技术栈说明：
  - Vue 3: 使用 Composition API 和 <script setup> 语法
  - TypeScript: 强类型支持
  - Tailwind CSS: 样式框架
  - Vue Router: 路由管理
  - Pinia: 状态管理
-->

<script setup lang="ts">
  // 导入路由视图
  import { RouterView } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'

  const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] border-b border-[#272727] z-50">
      <div class="flex items-center justify-between h-full px-4">
        <!-- 左侧 Logo 和菜单按钮 -->
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-[#272727] rounded-full">
            <i class="fas fa-bars text-xl"></i>
          </button>
          <router-link to="/" class="flex items-center gap-1">
            <img src="/logo.svg" alt="Atom Video" class="h-5" />
            <span class="font-semibold text-xl">Atom Video</span>
          </router-link>
        </div>

        <!-- 中间搜索栏 -->
        <div class="flex-1 max-w-[600px] mx-4">
          <div class="flex">
            <input type="text" :placeholder="$t('common.search')"
              class="w-full px-4 py-2 bg-[#121212] border border-[#303030] rounded-l-full focus:outline-none focus:border-blue-500" />
            <button class="px-6 bg-[#272727] border border-l-0 border-[#303030] rounded-r-full hover:bg-[#3f3f3f]">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- 右侧用户区域 -->
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-[#272727] rounded-full" :title="$t('video.upload')">
            <i class="fas fa-video text-xl"></i>
          </button>
          <button class="p-2 hover:bg-[#272727] rounded-full">
            <i class="fas fa-bell text-xl"></i>
          </button>
          <LanguageSelector />
          <button class="w-8 h-8 rounded-full overflow-hidden">
            <img src="/default-avatar.svg" alt="用户头像" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </header>

    <!-- 侧边栏 -->
    <aside
      class="fixed left-0 top-14 bottom-0 w-60 bg-[#0f0f0f] border-r border-[#272727] overflow-y-auto scrollbar-thin scrollbar-thumb-[#272727] scrollbar-track-[#0f0f0f] hover:scrollbar-thumb-[#3f3f3f]">
      <nav class="py-2">
        <router-link to="/" class="flex items-center gap-4 px-6 py-2 hover:bg-[#272727]">
          <i class="fas fa-home text-xl"></i>
          <span>{{ $t('nav.home') }}</span>
        </router-link>
        <router-link to="/trending" class="flex items-center gap-4 px-6 py-2 hover:bg-[#272727]">
          <i class="fas fa-fire text-xl"></i>
          <span>{{ $t('nav.trending') }}</span>
        </router-link>
        <router-link to="/subscriptions" class="flex items-center gap-4 px-6 py-2 hover:bg-[#272727]">
          <i class="fas fa-play text-xl"></i>
          <span>{{ $t('nav.subscriptions') }}</span>
        </router-link>
        <div class="border-t border-[#272727] my-2"></div>
        <router-link to="/library" class="flex items-center gap-4 px-6 py-2 hover:bg-[#272727]">
          <i class="fas fa-folder text-xl"></i>
          <span>{{ $t('nav.library') }}</span>
        </router-link>
        <router-link to="/history" class="flex items-center gap-4 px-6 py-2 hover:bg-[#272727]">
          <i class="fas fa-history text-xl"></i>
          <span>{{ $t('nav.history') }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主要内容区域 -->
    <main class="pt-14 pl-60">
      <div class="container mx-auto p-4">
        <RouterView />
      </div>
    </main>

    <!-- Toast 通知组件 -->
    <Toast />
  </div>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
