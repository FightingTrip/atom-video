<!-- 顶部导航栏 -->
<template>
  <header class="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 shadow-sm z-50">
    <div class="container mx-auto px-4 h-full flex items-center justify-between">
      <!-- 左侧 Logo 和菜单按钮 -->
      <div class="flex items-center gap-4">
        <button class="lg:hidden" @click="toggleSidebar">
          <i class="fas fa-bars text-xl"></i>
        </button>
        <router-link to="/" class="text-2xl font-bold">
          Atom Video
        </router-link>
      </div>

      <!-- 中间搜索栏 -->
      <SearchBar class="flex-1 max-w-2xl mx-4" />

      <!-- 右侧用户菜单 -->
      <div class="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSelector />
        <template v-if="isLoggedIn">
          <button class="btn-icon" @click="showUpload">
            <i class="fas fa-video"></i>
          </button>
          <NotificationDropdown />
          <UserMenu />
        </template>
        <template v-else>
          <n-button @click="login">登录</n-button>
        </template>
      </div>
    </div>
  </header>
</template>