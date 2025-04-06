# 样式系统

本文档详细描述 Atom 前端项目的样式系统设计，包括设计原则、CSS 变量、组件样式以及主题切换机制。

## 1. 样式架构概述

Atom 前端项目采用层次化的样式架构，基于 CSS 变量构建设计系统，结合 Tailwind CSS 提供灵活的工具类，并为组件提供专门的样式定义。这种混合策略既保证了设计的一致性，又提供了足够的灵活性。

### 1.1 样式系统目标

- **一致性**：确保整个应用的视觉和交互一致
- **可维护性**：结构化的样式组织，便于维护和扩展
- **灵活性**：支持快速样式调整和主题切换
- **性能优化**：减少冗余样式，优化 CSS 体积
- **明确的设计语言**：提供清晰的设计指南

### 1.2 样式文件组织

```
src/styles/
├── index.css          # 样式入口文件
├── variables.css      # CSS 变量定义
├── theme.css          # 主题相关样式
├── components.css     # 公共组件样式
├── tailwind.css       # Tailwind 配置
├── reset.css          # 样式重置
└── utilities.css      # 自定义工具类
```

## 2. 设计系统基础

### 2.1 调色板

项目采用黑白主题为基础，辅以醒目的主题色与功能色：

```css
/* src/styles/variables.css */
:root {
  /* 主要颜色 */
  --primary-color: #3b82f6;       /* 主题色：蓝色 */
  --primary-hover: #2563eb;       /* 主题色悬停状态 */
  --primary-active: #1d4ed8;      /* 主题色激活状态 */
  
  /* 功能色 */
  --success-color: #10b981;       /* 成功色：绿色 */
  --warning-color: #f59e0b;       /* 警告色：橙色 */
  --error-color: #ef4444;         /* 错误色：红色 */
  --info-color: #6366f1;          /* 信息色：紫色 */
  
  /* 中性色 - 暗色主题默认值 */
  --bg-primary: #121212;          /* 主要背景色 */
  --bg-secondary: #1e1e1e;        /* 次要背景色 */
  --bg-tertiary: #2a2a2a;         /* 第三级背景色 */
  
  --text-primary: #ffffff;        /* 主要文本色 */
  --text-secondary: #a0a0a0;      /* 次要文本色 */
  --text-tertiary: #6a6a6a;       /* 第三级文本色 */
  
  /* 边框和分割线 */
  --border-light: #2a2a2a;        /* 浅色边框 */
  --border-medium: #333333;       /* 中等边框 */
  --border-strong: #444444;       /* 深色边框 */
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 亮色主题变量 */
.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --bg-tertiary: #e5e7eb;
  
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-tertiary: #9ca3af;
  
  --border-light: #e5e7eb;
  --border-medium: #d1d5db;
  --border-strong: #9ca3af;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.05);
}
```

### 2.2 间距和尺寸

定义一致的间距和尺寸体系：

```css
:root {
  /* 间距 */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
  --spacing-3xl: 4rem;    /* 64px */
  
  /* 容器最大宽度 */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  
  /* 边框圆角 */
  --radius-sm: 0.125rem;  /* 2px */
  --radius-md: 0.25rem;   /* 4px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-full: 9999px;  /* 圆形 */
}
```

### 2.3 排版系统

定义字体、字号和行高：

```css
:root {
  /* 字体系列 */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  
  /* 字体大小 */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  /* 行高 */
  --line-height-none: 1;      /* 无 */
  --line-height-tight: 1.25;  /* 紧凑 */
  --line-height-normal: 1.5;  /* 普通 */
  --line-height-relaxed: 1.75; /* 宽松 */
  
  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 2.4 过渡和动画

定义过渡和动画变量：

```css
:root {
  /* 过渡持续时间 */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
  
  /* 过渡时间函数 */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  
  /* 常用过渡组合 */
  --transition-colors: color var(--transition-normal) var(--ease-in-out),
                      background-color var(--transition-normal) var(--ease-in-out),
                      border-color var(--transition-normal) var(--ease-in-out);
  --transition-opacity: opacity var(--transition-normal) var(--ease-in-out);
  --transition-transform: transform var(--transition-normal) var(--ease-out);
  --transition-all: all var(--transition-normal) var(--ease-in-out);
}
```

## 3. 组件样式

### 3.1 基础组件样式

为常用 UI 组件定义基础样式：

```css
/* src/styles/components.css */

/* 按钮 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-colors);
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-primary:active {
  background-color: var(--primary-active);
}

.btn-secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background-color: var(--bg-secondary);
}

/* 输入框 */
.input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: var(--transition-colors);
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

/* 卡片 */
.card {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}
```

### 3.2 Scoped 组件样式

在 Vue 单文件组件中使用 scoped 样式：

```vue
<!-- BaseButton.vue -->
<template>
  <button 
    class="base-button"
    :class="[
      `base-button--${type}`,
      `base-button--${size}`,
      { 'base-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="base-button__icon">
      <slot name="icon"></slot>
    </span>
    <span class="base-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-colors);
}

.base-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: var(--primary-hover);
}

.base-button--secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: var(--bg-secondary);
}

.base-button--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.base-button--medium {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
}

.base-button--large {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button__icon {
  margin-right: var(--spacing-xs);
}
</style>
```

### 3.3 CSS 模块

在某些场景下使用 CSS 模块以获得更好的样式隔离：

```vue
<!-- UserProfile.vue -->
<template>
  <div :class="$style.profile">
    <div :class="$style.header">
      <img :src="user.avatar" :class="$style.avatar" />
      <div :class="$style.info">
        <h2 :class="$style.name">{{ user.name }}</h2>
        <p :class="$style.bio">{{ user.bio }}</p>
      </div>
    </div>
    <div :class="$style.stats">
      <!-- 用户统计信息 -->
    </div>
  </div>
</template>

<style module>
.profile {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--spacing-md);
}

.info {
  flex: 1;
}

.name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.bio {
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  margin: 0;
}

.stats {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}
</style>
```

## 4. 主题切换

### 4.1 主题实现

使用 CSS 类和 CSS 变量实现主题切换：

```typescript
// composables/useTheme.ts
import { ref, watch } from 'vue'
import { usePreferenceStore } from '@/stores/preference'

export type Theme = 'dark' | 'light' | 'system'

export function useTheme() {
  const preferenceStore = usePreferenceStore()
  const currentTheme = ref<Theme>(preferenceStore.theme || 'system')
  const systemTheme = ref(getSystemTheme())
  
  // 检测系统主题
  function getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  
  // 应用主题到 HTML 元素
  function applyTheme(theme: Theme) {
    document.documentElement.classList.remove('dark-theme', 'light-theme')
    
    const effectiveTheme = theme === 'system' ? systemTheme.value : theme
    document.documentElement.classList.add(`${effectiveTheme}-theme`)
    
    // 更新 meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        effectiveTheme === 'dark' ? '#121212' : '#ffffff'
      )
    }
  }
  
  // 设置主题
  function setTheme(theme: Theme) {
    currentTheme.value = theme
    preferenceStore.setTheme(theme)
    applyTheme(theme)
  }
  
  // 切换主题
  function toggleTheme() {
    const theme = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(theme)
  }
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    systemTheme.value = e.matches ? 'dark' : 'light'
    if (currentTheme.value === 'system') {
      applyTheme('system')
    }
  })
  
  // 初始化主题
  applyTheme(currentTheme.value)
  
  return {
    currentTheme,
    systemTheme,
    setTheme,
    toggleTheme
  }
}
```

### 4.2 主题切换组件

实现主题切换控件：

```vue
<!-- ThemeToggle.vue -->
<template>
  <div class="theme-toggle">
    <select 
      v-model="currentTheme" 
      class="theme-select"
      @change="setTheme(currentTheme)"
    >
      <option value="light">浅色主题</option>
      <option value="dark">深色主题</option>
      <option value="system">系统主题</option>
    </select>
    
    <button 
      class="theme-toggle-button"
      @click="toggleTheme"
    >
      <svg v-if="effectiveTheme === 'dark'" class="theme-icon" viewBox="0 0 24 24">
        <!-- 月亮图标 -->
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 0 1-4.9-4.9A9 9 0 0 0 12 3z"></path>
      </svg>
      <svg v-else class="theme-icon" viewBox="0 0 24 24">
        <!-- 太阳图标 -->
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { currentTheme, systemTheme, setTheme, toggleTheme } = useTheme()

// 计算当前实际使用的主题
const effectiveTheme = computed(() => 
  currentTheme.value === 'system' ? systemTheme.value : currentTheme.value
)
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
}

.theme-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  margin-right: var(--spacing-sm);
}

.theme-toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  padding: var(--spacing-xs);
}

.theme-icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
```

## 5. Tailwind CSS 集成

### 5.1 Tailwind 配置

定制化 Tailwind 配置，以适应项目的设计系统：

```typescript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 使用 CSS 变量定义颜色
        primary: 'var(--primary-color)',
        'primary-hover': 'var(--primary-hover)',
        'primary-active': 'var(--primary-active)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        info: 'var(--info-color)',
        // 背景色
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        // 文本色
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
      },
      spacing: {
        // 使用 CSS 变量定义间距
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        // 使用 CSS 变量定义边框圆角
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      },
      fontSize: {
        // 使用 CSS 变量定义字体大小
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'md': 'var(--font-size-md)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      fontFamily: {
        // 使用 CSS 变量定义字体族
        'sans': 'var(--font-sans)',
        'mono': 'var(--font-mono)',
      },
      boxShadow: {
        // 使用 CSS 变量定义阴影
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      transitionProperty: {
        // 使用 CSS 变量定义过渡
        'colors': 'var(--transition-colors)',
        'opacity': 'var(--transition-opacity)',
        'transform': 'var(--transition-transform)',
      },
    },
  },
  plugins: [],
}
```

### 5.2 在组件中使用 Tailwind

结合 Tailwind 工具类与自定义样式：

```vue
<!-- VideoCard.vue -->
<template>
  <div class="bg-bg-secondary rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
    <div class="relative">
      <!-- 缩略图 -->
      <img 
        :src="video.thumbnailUrl" 
        :alt="video.title"
        class="w-full h-40 object-cover"
      />
      
      <!-- 视频时长 -->
      <div class="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
        {{ formatDuration(video.duration) }}
      </div>
    </div>
    
    <div class="p-md">
      <h3 class="text-text-primary text-lg font-semibold line-clamp-2 mb-sm">
        {{ video.title }}
      </h3>
      
      <div class="flex items-center text-text-secondary text-sm">
        <span>{{ video.views }} 次观看</span>
        <span class="mx-xs">•</span>
        <span>{{ formatDate(video.publishedAt) }}</span>
      </div>
      
      <div class="flex items-center mt-sm">
        <img 
          :src="video.userAvatar" 
          :alt="video.username"
          class="w-6 h-6 rounded-full mr-xs"
        />
        <span class="text-text-secondary text-sm">{{ video.username }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Video } from '@/types/video'

const props = defineProps<{
  video: Video
}>()

// 格式化视频时长
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化发布日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>
```

## 6. 响应式设计

### 6.1 断点系统

定义一致的断点系统：

```css
/* src/styles/variables.css */
:root {
  /* 断点 (媒体查询中使用) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 6.2 响应式工具

创建响应式工具，便于组件中使用：

```typescript
// composables/useBreakpoints.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoints() {
  const screenWidth = ref(window.innerWidth)
  
  // 响应式断点
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isLargeDesktop = ref(false)
  
  // 更新断点状态
  const updateBreakpoints = () => {
    screenWidth.value = window.innerWidth
    
    isMobile.value = screenWidth.value < 640
    isTablet.value = screenWidth.value >= 640 && screenWidth.value < 1024
    isDesktop.value = screenWidth.value >= 1024 && screenWidth.value < 1280
    isLargeDesktop.value = screenWidth.value >= 1280
  }
  
  // 监听窗口大小变化
  onMounted(() => {
    window.addEventListener('resize', updateBreakpoints)
    updateBreakpoints()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoints)
  })
  
  return {
    screenWidth,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  }
}
```

### 6.3 响应式布局

实现响应式布局示例：

```vue
<!-- ResponsiveLayout.vue -->
<template>
  <div class="responsive-layout">
    <!-- 移动端展示汉堡菜单 -->
    <button 
      v-if="isMobile"
      class="menu-button"
      @click="toggleSidebar"
    >
      <span class="icon">≡</span>
    </button>
    
    <!-- 侧边栏 -->
    <aside 
      class="sidebar"
      :class="{ 
        'sidebar--visible': sidebarVisible || !isMobile,
        'sidebar--mobile': isMobile
      }"
    >
      <slot name="sidebar"></slot>
    </aside>
    
    <!-- 主要内容 -->
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBreakpoints } from '@/composables/useBreakpoints'

const { isMobile } = useBreakpoints()
const sidebarVisible = ref(false)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}
</script>

<style scoped>
.responsive-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background-color: var(--bg-secondary);
  width: 250px;
  padding: var(--spacing-md);
  transition: transform var(--transition-normal) var(--ease-out);
}

.main-content {
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--bg-primary);
}

.menu-button {
  position: fixed;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 100;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
}

/* 移动端样式 */
.sidebar--mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transform: translateX(-100%);
}

.sidebar--visible {
  transform: translateX(0);
}

/* 针对不同屏幕尺寸的样式调整 */
@media (min-width: 640px) {
  .sidebar {
    width: 280px;
  }
}

@media (min-width: 1024px) {
  .menu-button {
    display: none;
  }
  
  .main-content {
    padding: var(--spacing-lg);
  }
}
</style>
```

## 7. 样式最佳实践

### 7.1 CSS 命名规范

采用 BEM (Block, Element, Modifier) 命名规范：

- **Block**：表示组件本身，如 `.button`
- **Element**：表示组件内的元素，如 `.button__icon`
- **Modifier**：表示组件的变体，如 `.button--primary`

```css
/* 推荐的 BEM 命名方式 */
.card {}                   /* Block */
.card__header {}           /* Element */
.card__content {}          /* Element */
.card__footer {}           /* Element */
.card--featured {}         /* Modifier */
.card--compact {}          /* Modifier */
```

### 7.2 CSS 优先级管理

遵循以下优先级原则，避免过度使用 `!important`：

1. **同等优先级，后定义覆盖先定义**
2. **选择器优先级：ID > 类/属性/伪类 > 元素/伪元素**
3. **避免嵌套过深的选择器**
4. **使用 scoped 或 CSS 模块隔离样式**
5. **只在必要时使用 `!important`**

### 7.3 移动优先设计

采用移动优先的设计理念，先为小屏幕设计，再逐步增强到大屏幕：

```css
/* 首先为移动设备编写基础样式 */
.container {
  padding: var(--spacing-md);
}

/* 然后使用媒体查询为较大屏幕增强样式 */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
    max-width: 768px;
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
```

### 7.4 性能优化

样式性能优化策略：

1. **避免过度使用通配符选择器**，如 `* { }`
2. **避免深层次的后代选择器**，如 `.header .nav .list .item a`
3. **合理使用 CSS 变量**，避免重复定义相似值
4. **优先使用 transform 和 opacity 做动画**，它们由 GPU 加速
5. **在大型应用中使用 CSS 代码分割**
6. **优化打包体积，将关键 CSS 内联在头部**

### 7.5 样式组织和复用

保持样式组织清晰，促进复用：

1. **抽象常用样式为工具类**
2. **将复杂组件的样式分离为子组件**
3. **定义明确的样式模块边界**
4. **避免样式泄漏和意外覆盖**
5. **使用 CSS Modules 或 Scoped CSS 限制样式作用域**

## 8. 总结

Atom 前端项目的样式系统基于 CSS 变量构建设计系统，结合 Tailwind CSS 提供灵活的工具类，并为组件提供专门的样式定义。通过这种混合策略，既保证了设计的一致性，又提供了足够的灵活性。

主要特点：

1. **设计标记化**：使用 CSS 变量定义色彩、间距、字体等设计标记
2. **主题切换**：简单的主题切换机制，支持深色/浅色主题
3. **响应式设计**：移动优先的响应式布局和设计
4. **组件样式封装**：使用 Scoped CSS 和 CSS Modules 隔离组件样式
5. **与 Tailwind 集成**：集成 Tailwind 提供灵活的工具类

通过实施本文档中的样式设计和最佳实践，可以构建出一个视觉一致、响应式且易于维护的前端应用。 