/**
* @file TheSidebar.vue
* @description 侧边栏组件
* @features
* - 响应式布局
* - 主题适配
* - 导航菜单
* - 折叠功能
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <aside class="the-sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-content">
      <!-- 用户信息 -->
      <div class="user-info" v-if="isLoggedIn">
        <n-avatar :src="userAvatar" :fallback-src="defaultAvatar" round size="large" />
        <div class="user-details" v-if="!isCollapsed">
          <h3 class="username">{{ userNickname }}</h3>
          <p class="user-bio">{{ userBio }}</p>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
          :class="{ active: isActive(item.path) }" :title="isCollapsed ? item.name : ''">
          <n-icon size="20">
            <component :is="item.icon" />
          </n-icon>
          <span v-if="!isCollapsed">{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- 折叠按钮 -->
      <button class="collapse-btn" @click="toggleCollapse">
        <n-icon size="20">
          <component :is="isCollapsed ? ExpandIcon : CollapseIcon" />
        </n-icon>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { NIcon, NAvatar } from 'naive-ui'
  import {
    Home as HomeIcon,
    Compass as DiscoverIcon,
    People as FollowingIcon,
    CloudUpload as UploadIcon,
    Bookmark as FavoritesIcon,
    Settings as SettingsIcon,
    ChevronBack as CollapseIcon,
    ChevronForward as ExpandIcon
  } from '@vicons/ionicons5'
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const userStore = useUserStore()

  // 菜单项配置
  const menuItems = [
    { name: '首页', path: '/', icon: HomeIcon },
    { name: '发现', path: '/discover', icon: DiscoverIcon },
    { name: '关注', path: '/following', icon: FollowingIcon },
    { name: '上传', path: '/upload', icon: UploadIcon },
    { name: '收藏夹', path: '/favorites', icon: FavoritesIcon },
    { name: '设置', path: '/settings', icon: SettingsIcon }
  ]

  // 响应式状态
  const isCollapsed = ref(false)
  const isLoggedIn = computed(() => userStore.isLoggedIn)
  const userAvatar = computed(() => userStore.user?.avatar)
  const userNickname = computed(() => userStore.user?.nickname)
  const userBio = computed(() => userStore.user?.bio)
  const defaultAvatar = '/images/default-avatar.png'

  // 方法
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const isActive = (path: string) => {
    return route.path === path
  }
</script>

<style scoped>
  .the-sidebar {
    position: fixed;
    top: var(--header-height);
    left: 0;
    bottom: 0;
    width: var(--sidebar-width);
    background-color: var(--background-color);
    border-right: 1px solid var(--border-color);
    transition: width var(--transition-duration);
    z-index: var(--z-index-sidebar);
  }

  .the-sidebar.is-collapsed {
    width: var(--sidebar-collapsed-width);
  }

  .sidebar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    border-radius: var(--border-radius);
    background-color: var(--background-color-secondary);
  }

  .user-details {
    flex: 1;
    min-width: 0;
  }

  .username {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-bio {
    margin: var(--spacing-xs) 0 0;
    font-size: var(--text-xs);
    color: var(--text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    color: var(--text-color);
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: all var(--transition-duration);
  }

  .nav-item:hover {
    background-color: var(--background-color-hover);
  }

  .nav-item.active {
    color: var(--primary-color);
    background-color: var(--background-color-hover);
  }

  .nav-item span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-top: var(--spacing-md);
    color: var(--text-color-secondary);
    background: none;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-duration);
  }

  .collapse-btn:hover {
    color: var(--text-color);
    background-color: var(--background-color-hover);
  }

  @media (max-width: 768px) {
    .the-sidebar {
      transform: translateX(-100%);
    }

    .the-sidebar.is-collapsed {
      transform: translateX(0);
    }
  }
</style>