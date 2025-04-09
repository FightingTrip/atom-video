/**
* @file TheSidebar.vue
* @description 侧边栏组件 - YouTube风格
* @features
* - 响应式布局
* - 主题适配
* - 导航菜单
* - 折叠功能
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <div class="sidebar-content">
      <!-- 主导航 -->
      <div class="sidebar-section">
        <div class="sidebar-item" v-for="item in mainNavItems" :key="item.path"
          :class="{ active: isActive(item.path) }">
          <router-link :to="item.path" class="sidebar-link">
            <div class="sidebar-icon">
              <n-icon size="24">
                <component :is="item.icon" />
              </n-icon>
            </div>
            <span class="sidebar-text" v-if="!collapsed">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="sidebar-divider" v-if="!collapsed"></div>

      <!-- 用户收藏库 - 需要登录 -->
      <div class="sidebar-section" v-if="isLoggedIn">
        <div class="sidebar-heading" v-if="!collapsed">收藏库</div>
        <div class="sidebar-item" v-for="item in libraryItems" :key="item.path"
          :class="{ active: isActive(item.path) }">
          <router-link :to="item.path" class="sidebar-link">
            <div class="sidebar-icon">
              <n-icon size="24">
                <component :is="item.icon" />
              </n-icon>
            </div>
            <span class="sidebar-text" v-if="!collapsed">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="sidebar-divider" v-if="!collapsed && isLoggedIn"></div>

      <!-- 订阅频道 - 需要登录 -->
      <div class="sidebar-section" v-if="isLoggedIn">
        <div class="sidebar-heading" v-if="!collapsed">频道</div>
        <div class="sidebar-item" v-for="channel in subscriptions" :key="channel.id">
          <router-link :to="`/channel/${channel.id}`" class="sidebar-link">
            <div class="sidebar-avatar">
              <n-avatar :src="channel.avatar" size="small" round />
            </div>
            <span class="sidebar-text" v-if="!collapsed">{{ channel.name }}</span>
          </router-link>
        </div>
        <div class="sidebar-item" v-if="hasMoreSubscriptions && !collapsed">
          <router-link to="/subscriptions" class="sidebar-link">
            <div class="sidebar-icon">
              <n-icon size="24">
                <ChevronDown />
              </n-icon>
            </div>
            <span class="sidebar-text">显示更多</span>
          </router-link>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="sidebar-divider" v-if="!collapsed"></div>

      <!-- 探索 -->
      <div class="sidebar-section">
        <div class="sidebar-heading" v-if="!collapsed">探索</div>
        <div class="sidebar-item" v-for="item in exploreItems" :key="item.path"
          :class="{ active: isActive(item.path) }">
          <router-link :to="item.path" class="sidebar-link">
            <div class="sidebar-icon">
              <n-icon size="24">
                <component :is="item.icon" />
              </n-icon>
            </div>
            <span class="sidebar-text" v-if="!collapsed">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- 设置项在底部 -->
      <div class="sidebar-section sidebar-footer">
        <div class="sidebar-item" :class="{ active: isActive('/user/settings') }">
          <router-link to="/user/settings" class="sidebar-link">
            <div class="sidebar-icon">
              <n-icon size="24">
                <SettingsOutline />
              </n-icon>
            </div>
            <span class="sidebar-text" v-if="!collapsed">设置</span>
          </router-link>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { NIcon, NAvatar } from 'naive-ui'
  import {
    HomeOutline,
    CompassOutline,
    FlameOutline,
    TimeOutline,
    BookmarkOutline,
    ThumbsUpOutline,
    SettingsOutline,
    ChevronDown,
    CodeOutline,
    ServerOutline,
    CloudOutline,
    GitNetworkOutline,
    LayersOutline
  } from '@vicons/ionicons5'
  import { useUserStore } from '@/stores/user'
  import { useAuthStore } from '@/stores/auth'

  // 定义属性
  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false
    }
  })

  const route = useRoute()
  const userStore = useUserStore()
  const authStore = useAuthStore()

  // 认证状态
  const isLoggedIn = computed(() => authStore.isAuthenticated)

  // 主导航菜单
  const mainNavItems = [
    { name: '首页', path: '/', icon: HomeOutline },
    { name: '发现', path: '/feed/explore', icon: CompassOutline },
    { name: '热门', path: '/feed/trending', icon: FlameOutline }
  ]

  // 收藏库菜单 - 需要登录
  const libraryItems = [
    { name: '历史记录', path: '/library/history', icon: TimeOutline },
    { name: '稍后观看', path: '/library/watch-later', icon: BookmarkOutline },
    { name: '我喜欢的', path: '/library/liked', icon: ThumbsUpOutline }
  ]

  // 探索菜单 - 开发者相关类别
  const exploreItems = [
    { name: '编程语言', path: '/explore/programming-languages', icon: CodeOutline },
    { name: '框架技术', path: '/explore/frameworks', icon: LayersOutline },
    { name: '云服务', path: '/explore/cloud-services', icon: CloudOutline },
    { name: '算法与数据结构', path: '/explore/algorithms', icon: GitNetworkOutline },
    { name: '系统架构', path: '/explore/architecture', icon: ServerOutline }
  ]

  // 订阅频道 - 模拟数据
  const subscriptions = computed(() => {
    // 这里应该从用户数据中获取订阅
    return [
      { id: '1', name: '前端开发者', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: '2', name: '编程学院', avatar: 'https://i.pravatar.cc/150?u=2' },
      { id: '3', name: '技术分享', avatar: 'https://i.pravatar.cc/150?u=3' },
      { id: '4', name: '代码狂人', avatar: 'https://i.pravatar.cc/150?u=4' },
      { id: '5', name: '全栈工程师', avatar: 'https://i.pravatar.cc/150?u=5' }
    ].slice(0, props.collapsed ? 0 : 5); // 当侧边栏折叠时不显示
  })

  // 是否还有更多订阅
  const hasMoreSubscriptions = computed(() => {
    // 模拟有更多订阅
    return true;
  })

  // 检查路由是否激活
  const isActive = (path: string) => {
    if (path === '/' && route.path === '/') {
      return true;
    }
    return route.path.startsWith(path) && path !== '/';
  }
</script>

<style scoped>
  .sidebar {
    position: fixed;
    top: 56px;
    /* 与header高度匹配 */
    left: 0;
    width: 240px;
    height: calc(100vh - 56px);
    background-color: var(--bg-color);
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.3s, background-color 0.3s;
    z-index: 20;
  }

  .sidebar-collapsed {
    width: 72px;
  }

  .sidebar-content {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .sidebar-section {
    margin-bottom: 12px;
  }

  .sidebar-footer {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
  }

  .sidebar-heading {
    padding: 8px 24px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sidebar-divider {
    margin: 12px 16px;
    height: 1px;
    background-color: var(--border-color);
  }

  .sidebar-item {
    position: relative;
    height: 40px;
    margin: 2px 0;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 100%;
    color: var(--text-color);
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s;
    border-radius: 0 20px 20px 0;
    margin-right: 12px;
  }

  .sidebar-collapsed .sidebar-link {
    padding: 0;
    justify-content: center;
    margin-right: 0;
    border-radius: 0;
  }

  .sidebar-link:hover {
    background-color: var(--hover-color);
  }

  .sidebar-item.active .sidebar-link {
    background-color: var(--hover-color);
    color: var(--primary-color);
    font-weight: 500;
  }

  .sidebar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 24px;
    flex-shrink: 0;
  }

  .sidebar-collapsed .sidebar-icon {
    margin-right: 0;
  }

  .sidebar-avatar {
    margin-right: 16px;
    flex-shrink: 0;
  }

  .sidebar-collapsed .sidebar-avatar {
    margin-right: 0;
  }

  .sidebar-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  /* 深色模式适配 */
  :root.dark .sidebar,
  .dark-mode .sidebar {
    background-color: rgba(25, 25, 25, 0.95);
    border-right-color: rgba(60, 60, 60, 0.5);
  }

  :root.dark .sidebar-footer,
  .dark-mode .sidebar-footer {
    border-top-color: rgba(60, 60, 60, 0.5);
  }

  :root.dark .sidebar-link:hover,
  .dark-mode .sidebar-link:hover {
    background-color: rgba(60, 60, 60, 0.4);
  }

  :root.dark .sidebar-item.active .sidebar-link,
  .dark-mode .sidebar-item.active .sidebar-link {
    background-color: rgba(60, 60, 60, 0.6);
  }

  /* 响应式样式 */
  @media (max-width: 1280px) {
    .sidebar {
      position: fixed;
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: 0;
      z-index: 25;
      transform: translateX(-100%);
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .sidebar-collapsed {
      transform: translateX(0);
      width: 72px;
    }
  }
</style>