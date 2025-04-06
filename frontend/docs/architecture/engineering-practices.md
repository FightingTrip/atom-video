# 工程实践

本文档详细描述 Atom 前端项目的工程实践，包括代码规范、Git 工作流、测试策略、CI/CD 流程及性能优化等方面。

## 1. 代码规范

### 1.1 JavaScript/TypeScript 规范

项目采用 ESLint 和 Prettier 确保代码风格的一致性：

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    // Vue 相关规则
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'error',
    'vue/multi-word-component-names': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

```javascript
// .prettierrc.js
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: 'none',
  arrowParens: 'avoid',
  endOfLine: 'auto'
}
```

### 1.2 Vue 组件规范

Vue 单文件组件结构规范：

1. **模板优先**：`<template>` 放在最前面
2. **脚本次之**：`<script>` 紧随其后
3. **样式最后**：`<style>` 放在最后

```vue
<template>
  <div class="example-component">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
// 导入
import { ref, computed } from 'vue'
import { useExampleStore } from '@/stores/example'

// Props 和 Emits 定义
const props = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

// 状态和逻辑
const counter = ref(props.count || 0)

const doubleCount = computed(() => counter.value * 2)

function increment() {
  counter.value++
  emit('change', counter.value)
}
</script>

<style scoped>
.example-component {
  /* 样式内容 */
}
</style>
```

### 1.3 CSS 规范

CSS 编写规范：

1. **使用 BEM 命名方法**
2. **组件样式使用 scoped 或 CSS Modules**
3. **引用全局变量而非硬编码值**
4. **移动优先的响应式设计**
5. **避免过深的选择器嵌套**

```vue
<style scoped>
/* 推荐的 CSS 组织方式 */
.card {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.card__header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.card__title {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.card__content {
  padding: var(--spacing-md);
}

.card--featured {
  border: 2px solid var(--primary-color);
}

/* 媒体查询放在相关选择器后面 */
@media (min-width: 768px) {
  .card {
    display: flex;
  }
  
  .card__header {
    width: 30%;
    border-bottom: none;
    border-right: 1px solid var(--border-light);
  }
  
  .card__content {
    width: 70%;
  }
}
</style>
```

### 1.4 提交信息规范

使用 Conventional Commits 规范提交信息：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

类型包括：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修复 Bug 的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

示例：

```
feat(user): 添加用户登录功能

实现了用户登录的前端界面和逻辑，包括：
- 登录表单验证
- 记住用户选项
- 登录失败提示

Closes #123
```

## 2. Git 工作流

### 2.1 分支管理策略

采用 GitHub Flow 的简化版作为分支策略：

1. **main**: 主分支，包含稳定的、可部署的代码
2. **feature/{feature-name}**: 功能分支，用于开发新功能
3. **fix/{issue-number}**: 修复分支，用于修复 Bug
4. **release/{version}**: 发布分支，用于版本发布准备

### 2.2 Pull Request 流程

所有代码变更通过 Pull Request (PR) 合并到主分支：

1. 从 `main` 分支创建新的功能/修复分支
2. 在分支上进行开发和测试
3. 提交 PR 到 `main` 分支
4. PR 需通过 CI 检查和代码审查
5. 通过后合并到 `main` 分支

### 2.3 Code Review 规范

代码审查关注点：

1. **代码正确性**：功能是否按预期工作
2. **代码质量**：是否遵循项目规范
3. **性能考量**：是否有性能问题
4. **安全性**：是否存在安全风险
5. **可测试性**：代码是否易于测试

### 2.4 Git Hooks

使用 husky 和 lint-staged 在提交前检查代码：

```json
// package.json
{
  "scripts": {
    "lint": "eslint --ext .js,.ts,.vue --ignore-path .gitignore .",
    "lint:fix": "eslint --ext .js,.ts,.vue --fix --ignore-path .gitignore .",
    "typecheck": "vue-tsc --noEmit",
    "format": "prettier --write \"src/**/*.{js,ts,vue,css}\""
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": "prettier --write"
  }
}
```

## 3. 测试策略

### 3.1 测试类型

项目采用多层次测试策略：

1. **单元测试**：测试独立的函数、类和组件
2. **集成测试**：测试多个组件或模块的交互
3. **端到端测试**：测试整个应用的用户流程
4. **视觉回归测试**：确保 UI 外观一致性

### 3.2 单元测试

使用 Vitest 和 Vue Test Utils 进行单元测试：

```typescript
// src/components/base/Button/BaseButton.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Button Text'
      }
    })
    
    expect(wrapper.text()).toContain('Button Text')
    expect(wrapper.classes()).toContain('base-button')
    expect(wrapper.classes()).toContain('base-button--medium')
    expect(wrapper.classes()).toContain('base-button--primary')
  })
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')!.length).toBe(1)
  })
  
  it('does not emit click event when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })
  
  it('applies custom type and size classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'secondary',
        size: 'large'
      }
    })
    
    expect(wrapper.classes()).toContain('base-button--secondary')
    expect(wrapper.classes()).toContain('base-button--large')
  })
})
```

### 3.3 组件测试

测试复杂组件的例子：

```typescript
// src/components/business/user/UserProfile.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UserProfile from './UserProfile.vue'
import { useUserStore } from '@/stores/user'

// 模拟用户数据
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test user bio'
}

describe('UserProfile', () => {
  beforeEach(() => {
    // 创建测试用 Pinia store
    vi.resetAllMocks()
  })
  
  it('displays user information', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: { user: mockUser }
            }
          })
        ]
      }
    })
    
    // 检查用户信息是否正确显示
    expect(wrapper.find('.user-name').text()).toBe(mockUser.name)
    expect(wrapper.find('.user-email').text()).toBe(mockUser.email)
    expect(wrapper.find('.user-bio').text()).toBe(mockUser.bio)
    expect(wrapper.find('.user-avatar').attributes('src')).toBe(mockUser.avatar)
  })
  
  it('shows edit button for current user', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: { 
                user: mockUser,
                isCurrentUser: true
              }
            }
          })
        ]
      }
    })
    
    expect(wrapper.find('.edit-profile-button').exists()).toBe(true)
  })
  
  it('does not show edit button for other users', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: { 
                user: mockUser,
                isCurrentUser: false
              }
            }
          })
        ]
      }
    })
    
    expect(wrapper.find('.edit-profile-button').exists()).toBe(false)
  })
})
```

### 3.4 端到端测试

使用 Cypress 进行端到端测试：

```typescript
// cypress/e2e/login.cy.ts
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  
  it('should display login form', () => {
    cy.get('h1').should('contain', '登录')
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })
  
  it('should show validation errors for empty form submission', () => {
    cy.get('button[type="submit"]').click()
    
    cy.get('.error-message').should('contain', '用户名不能为空')
    cy.get('.error-message').should('contain', '密码不能为空')
  })
  
  it('should login successfully with valid credentials', () => {
    // 拦截 API 请求
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    }).as('loginRequest')
    
    // 填写表单
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('password123')
    
    // 提交表单
    cy.get('button[type="submit"]').click()
    
    // 等待请求完成
    cy.wait('@loginRequest')
    
    // 验证重定向到首页
    cy.url().should('include', '/')
    
    // 验证显示用户名
    cy.get('.user-info').should('contain', 'Test User')
  })
  
  it('should show error for invalid credentials', () => {
    // 拦截 API 请求返回错误
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: '用户名或密码错误'
      }
    }).as('loginRequest')
    
    // 填写表单
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('wrongpassword')
    
    // 提交表单
    cy.get('button[type="submit"]').click()
    
    // 等待请求完成
    cy.wait('@loginRequest')
    
    // 验证错误消息
    cy.get('.error-message').should('contain', '用户名或密码错误')
    
    // 验证仍在登录页
    cy.url().should('include', '/login')
  })
})
```

### 3.5 测试覆盖率要求

项目对不同类型的测试规定了最低覆盖率要求：

| 测试类型     | 覆盖率要求 | 重点关注                               |
|------------|---------|---------------------------------------|
| 单元测试     | > 80%   | 工具函数、组合式 API、复杂组件              |
| 集成测试     | > 60%   | 组件交互、状态管理集成                     |
| 端到端测试    | > 40%   | 关键用户流程、主要功能路径                  |

## 4. CI/CD 流程

### 4.1 CI 流水线

使用 GitHub Actions 构建 CI 流水线：

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - name: Unit tests
        run: npm run test:unit
      - name: E2E tests
        run: npm run test:e2e:headless
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - name: Build
        run: npm run build
      - name: Archive production artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist
```

### 4.2 CD 流程

使用 GitHub Actions 实现 CD 自动部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - name: Build
        run: npm run build
        
      # 部署到测试环境 (当 main 分支提交时)
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        uses: some-deploy-action@v1
        with:
          token: ${{ secrets.DEPLOY_TOKEN }}
          app-name: 'atom-staging'
          folder: 'dist'
          
      # 部署到生产环境 (当发布标签时)
      - name: Deploy to production
        if: startsWith(github.ref, 'refs/tags/v')
        uses: some-deploy-action@v1
        with:
          token: ${{ secrets.DEPLOY_TOKEN }}
          app-name: 'atom-production'
          folder: 'dist'
```

### 4.3 环境配置

针对不同环境的配置管理：

```bash
# .env
# 所有环境共用的基础配置
VITE_APP_TITLE=Atom Video

# .env.development
# 开发环境配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK=true
VITE_LOG_LEVEL=debug

# .env.staging
# 测试环境配置
VITE_API_BASE_URL=https://api.staging.atom-video.com
VITE_ENABLE_MOCK=false
VITE_LOG_LEVEL=info

# .env.production
# 生产环境配置
VITE_API_BASE_URL=https://api.atom-video.com
VITE_ENABLE_MOCK=false
VITE_LOG_LEVEL=error
```

## 5. 性能优化

### 5.1 构建优化

Vite 构建优化配置：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console.log
        drop_console: process.env.NODE_ENV === 'production',
        // 保留 console.error 和 console.warn
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : []
      }
    },
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库单独打包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 库单独打包
          'ui-vendor': ['@headlessui/vue', '@heroicons/vue'],
          // 工具库单独打包
          'utils-vendor': ['axios', 'lodash-es', 'dayjs']
        }
      }
    },
    // 检查大文件
    chunkSizeWarningLimit: 600,
    // CSS 代码分割
    cssCodeSplit: true,
    // 源码映射
    sourcemap: process.env.NODE_ENV !== 'production'
  }
})
```

### 5.2 运行时优化

前端运行时性能优化策略：

1. **组件懒加载**：使用 `defineAsyncComponent` 延迟加载非关键组件
2. **路由懒加载**：动态导入路由组件，减少首屏加载时间
3. **虚拟滚动**：处理长列表，只渲染可见区域内的项目
4. **资源预加载**：使用 `<link rel="preload">` 预加载关键资源
5. **图片优化**：使用响应式图片、WebP 格式、懒加载

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../pages/HomePage.vue')
        },
        {
          path: 'videos',
          name: 'Videos',
          component: () => import('../pages/video/VideoListPage.vue')
        },
        {
          path: 'videos/:id',
          name: 'VideoDetail',
          // 使用注释指示预加载
          component: () => import(/* webpackPrefetch: true */ '../pages/video/VideoDetailPage.vue')
        }
      ]
    }
  ]
})

export default router
```

### 5.3 用户体验优化

提升用户体验的措施：

1. **骨架屏**：在内容加载过程中显示骨架屏
2. **数据预取**：预先加载可能需要的数据
3. **状态持久化**：持久化应用状态，减少重复加载
4. **优先显示内容**：首先显示内容，然后是交互元素
5. **离线支持**：使用 Service Worker 提供基本的离线功能

```vue
<!-- SkeletonLoader.vue -->
<template>
  <div class="skeleton-loader" :class="{ 'skeleton-loader--loaded': loaded }">
    <div v-if="!loaded" class="skeleton-content">
      <div v-for="i in count" :key="i" class="skeleton-item" :style="{ height: `${height}px` }"></div>
    </div>
    <div v-else class="skeleton-loaded-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  loaded: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 1
  },
  height: {
    type: Number,
    default: 20
  }
})
</script>

<style scoped>
.skeleton-item {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

## 6. 安全实践

### 6.1 前端安全措施

防范常见的前端安全风险：

1. **XSS 防护**：使用 Vue 的内置 HTML 转义
2. **CSRF 防护**：在 API 请求中包含 CSRF 令牌
3. **安全的 HTTP 头**：配置安全相关的 HTTP 头
4. **敏感数据处理**：不在前端存储敏感数据
5. **输入验证**：客户端和服务器端双重验证

### 6.2 安全配置

为 Vite 开发服务器配置安全头：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    // 配置开发服务器的响应头
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.example.com;"
    }
  }
})
```

### 6.3 API 安全

API 请求安全实践：

```typescript
// src/services/api/client.ts
import axios from 'axios'

// 创建 API 客户端
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器添加 CSRF 令牌
apiClient.interceptors.request.use(config => {
  // 从 cookie 中获取 CSRF 令牌
  const csrfToken = getCookie('XSRF-TOKEN')
  
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken
  }
  
  return config
})

// 获取 cookie 值的辅助函数
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
  return match ? decodeURIComponent(match[3]) : null
}

export default apiClient
```

## 7. 监控与错误处理

### 7.1 前端错误监控

全局错误处理和监控：

```typescript
// src/plugins/errorMonitor.ts
import { App } from 'vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

export function setupErrorMonitoring(app: App) {
  if (import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracingOrigins: ['localhost', /^\//],
          routingInstrumentation: Sentry.vueRouterInstrumentation(router)
        })
      ],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
      release: __APP_VERSION__
    })
  }
  
  // 全局错误处理
  app.config.errorHandler = (error, instance, info) => {
    // 将错误报告给 Sentry
    Sentry.captureException(error, {
      extra: {
        componentName: instance?.$.type?.name,
        lifecycleHook: info
      }
    })
    
    // 在开发环境下打印错误
    if (import.meta.env.DEV) {
      console.error('Vue 错误:', error)
      console.error('组件:', instance)
      console.error('信息:', info)
    }
  }
  
  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', event => {
    Sentry.captureException(event.reason, {
      extra: {
        type: 'unhandledrejection'
      }
    })
    
    if (import.meta.env.DEV) {
      console.error('未处理的 Promise 拒绝:', event.reason)
    }
  })
}
```

### 7.2 性能监控

使用 Web Vitals 监控前端性能指标：

```typescript
// src/plugins/performanceMonitor.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // 将性能指标发送到分析服务
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta
  })
  
  // 使用 Beacon API 发送数据
  navigator.sendBeacon('/analytics/vitals', body)
}

export function setupPerformanceMonitoring() {
  // Core Web Vitals
  onCLS(sendToAnalytics)  // 累积布局偏移
  onFID(sendToAnalytics)  // 首次输入延迟
  onLCP(sendToAnalytics)  // 最大内容绘制
  
  // 其他有用的指标
  onFCP(sendToAnalytics)  // 首次内容绘制
  onTTFB(sendToAnalytics) // 首字节时间
}
```

## 8. 总结

Atom 前端项目的工程实践旨在建立一个高效、可维护和高质量的开发流程。通过严格的代码规范、完善的测试策略、自动化的 CI/CD 流程以及全面的性能和安全优化，确保项目的可靠性和稳定性。

主要特点：

1. **规范化开发**：统一的代码风格和提交规范
2. **自动化测试**：多层次的测试策略确保代码质量
3. **持续集成与部署**：自动化的构建、测试和部署流程
4. **性能优化**：从构建到运行时的全方位优化
5. **安全保障**：全面的前端安全措施
6. **监控与分析**：错误监控和性能指标收集

通过实施本文档中的工程实践，可以构建出一个高质量、高性能且易于维护的前端应用。 