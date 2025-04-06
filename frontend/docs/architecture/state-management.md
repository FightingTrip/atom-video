# 状态管理

本文档详细描述 Atom 前端项目的状态管理设计，包括状态分类、Pinia 的使用方法以及最佳实践。

## 1. 状态分类

根据数据的作用范围和生命周期，我们将状态分为以下几种类型：

### 1.1 组件内部状态（Component State）

仅在单个组件内部使用的状态，不需要与其他组件共享。这类状态使用 Vue 的 `ref` 或 `reactive` 在组件内部管理。

- 例如：表单输入值、切换状态、组件内部计数器

### 1.2 共享状态（Shared State）

需要在多个组件之间共享的状态，这类状态通过 Pinia store 管理。

- 例如：用户信息、认证状态、主题设置

### 1.3 服务器状态（Server State）

从服务器获取的数据，需要在客户端临时存储和缓存。

- 例如：视频列表、评论数据、用户配置

### 1.4 URL 状态（URL State）

通过 URL 参数或路径维护的状态。

- 例如：页面ID、查询条件、筛选参数

### 1.5 本地持久化状态（Persisted State）

需要在页面刷新后仍然保留的状态，通过浏览器存储（localStorage, sessionStorage）保存。

- 例如：用户偏好设置、认证令牌、主题选择

## 2. 状态管理方案

### 2.1 组件内部状态管理

使用 Vue 的组合式 API 管理组件内部状态：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// 响应式状态
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 修改状态的方法
const increment = () => {
  count.value++
}
</script>
```

### 2.2 跨组件状态管理

使用 Pinia 管理跨组件共享状态：

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0
  }),
  
  // 计算属性
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  // 操作方法
  actions: {
    increment() {
      this.count++
    },
    async fetchCountFromServer() {
      // 异步操作
      const response = await api.fetchCount()
      this.count = response.data.count
    }
  }
})
```

### 2.3 服务器状态管理

使用专门的 Pinia store 管理服务器状态，结合缓存和失效策略：

```typescript
// stores/videos.ts
import { defineStore } from 'pinia'
import { videoService } from '@/services/video/videoService'
import type { Video, VideoFilter } from '@/types/video'

export const useVideoStore = defineStore('videos', {
  state: () => ({
    videos: [] as Video[],
    currentVideo: null as Video | null,
    loading: false,
    error: null as Error | null,
    lastFetched: null as Date | null,
    filter: {} as VideoFilter
  }),
  
  getters: {
    filteredVideos: (state) => {
      // 返回根据当前过滤条件过滤后的视频列表
      return state.videos.filter(/* 过滤逻辑 */)
    },
    
    isCacheValid: (state) => {
      if (!state.lastFetched) return false
      
      // 缓存 5 分钟内有效
      const now = new Date()
      const diffInMinutes = (now.getTime() - state.lastFetched.getTime()) / (1000 * 60)
      return diffInMinutes < 5
    }
  },
  
  actions: {
    async fetchVideos() {
      // 如果缓存有效，直接使用缓存数据
      if (this.isCacheValid && this.videos.length > 0) return
      
      this.loading = true
      this.error = null
      
      try {
        const data = await videoService.getVideos(this.filter)
        this.videos = data
        this.lastFetched = new Date()
      } catch (err) {
        this.error = err as Error
        console.error('Failed to fetch videos:', err)
      } finally {
        this.loading = false
      }
    },
    
    async fetchVideoById(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const video = await videoService.getVideoById(id)
        this.currentVideo = video
      } catch (err) {
        this.error = err as Error
        console.error(`Failed to fetch video with id ${id}:`, err)
      } finally {
        this.loading = false
      }
    },
    
    setFilter(filter: Partial<VideoFilter>) {
      this.filter = { ...this.filter, ...filter }
      // 设置新的过滤条件后，可能需要重新获取数据
      this.lastFetched = null
    },
    
    clearCache() {
      this.lastFetched = null
    }
  }
})
```

### 2.4 URL 状态管理

使用 Vue Router 管理 URL 状态，并与 Pinia store 同步：

```typescript
// composables/useUrlSync.ts
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videos'

export function useUrlSync() {
  const route = useRoute()
  const router = useRouter()
  const videoStore = useVideoStore()
  
  // 从 URL 更新 store
  watch(() => route.query, (query) => {
    const filter = {
      category: query.category as string || '',
      sortBy: query.sortBy as string || 'latest',
      page: Number(query.page) || 1
    }
    
    videoStore.setFilter(filter)
  }, { immediate: true })
  
  // 从 store 更新 URL
  watch(() => videoStore.filter, (filter) => {
    router.push({
      query: {
        ...route.query,
        category: filter.category || undefined,
        sortBy: filter.sortBy || undefined,
        page: filter.page > 1 ? String(filter.page) : undefined
      }
    })
  }, { deep: true })
}
```

### 2.5 本地持久化状态管理

使用插件 `pinia-plugin-persistedstate` 持久化 Pinia store 数据：

```typescript
// store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    theme: 'dark',
    preferences: {}
  }),
  
  // ...getters, actions
  
  // 持久化配置
  persist: {
    // 存储位置，默认为 localStorage
    storage: localStorage,
    // 只持久化指定字段
    paths: ['token', 'theme', 'preferences']
  }
})
```

## 3. Pinia 最佳实践

### 3.1 Store 组织结构

按业务领域划分 store，每个 store 负责一个明确的功能模块：

```
stores/
├── auth.ts          # 认证相关状态
├── user.ts          # 用户信息相关
├── videos.ts        # 视频列表和详情
├── comments.ts      # 评论相关
├── ui.ts            # UI 状态（主题、侧边栏等）
└── index.ts         # 统一导出和插件配置
```

### 3.2 定义 Store 类型

为 store 定义明确的 TypeScript 类型，提高代码可维护性：

```typescript
// types/store.ts
export interface VideoState {
  videos: Video[]
  currentVideo: Video | null
  loading: boolean
  error: Error | null
  filter: VideoFilter
  lastFetched: Date | null
}

// stores/videos.ts
import type { VideoState } from '@/types/store'

export const useVideoStore = defineStore<string, VideoState, 
  GetterTree<VideoState>, ActionTree<VideoState>>('videos', {
  state: () => ({
    videos: [],
    currentVideo: null,
    loading: false,
    error: null,
    filter: {},
    lastFetched: null
  }),
  // ...getters, actions
})
```

### 3.3 组合式 Store 模式

使用组合式 API 方式定义 store，更符合 Vue 3 风格：

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  
  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  
  // 操作方法
  function increment() {
    count.value++
  }
  
  async function fetchCountFromServer() {
    // 异步操作
    const response = await api.fetchCount()
    count.value = response.data.count
  }
  
  return {
    count,
    doubleCount,
    increment,
    fetchCountFromServer
  }
})
```

### 3.4 Store 之间的交互

当一个 store 需要使用另一个 store 的状态或方法时，直接导入并使用：

```typescript
// stores/videos.ts
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useVideoStore = defineStore('videos', {
  // ...state, getters
  
  actions: {
    async uploadVideo(video: VideoUpload) {
      const authStore = useAuthStore()
      
      // 确保用户已登录
      if (!authStore.isAuthenticated) {
        throw new Error('User must be logged in to upload videos')
      }
      
      // 使用用户令牌上传视频
      return await videoService.uploadVideo(video, authStore.token)
    }
  }
})
```

### 3.5 Store 重置

提供重置 store 状态的方法，用于退出登录或测试场景：

```typescript
// stores/index.ts
import { createPinia } from 'pinia'

const pinia = createPinia()

// 为所有 store 添加 $reset 方法
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  
  store.$reset = () => {
    store.$patch(initialState)
  }
})

export default pinia
```

### 3.6 订阅 Store 变化

监听 store 状态变化以执行副作用：

```typescript
// 在组件中
import { onMounted, onUnmounted } from 'vue'
import { useVideoStore } from '@/stores/videos'

const videoStore = useVideoStore()
let unsubscribe: (() => void) | null = null

onMounted(() => {
  // 订阅 store 变化
  unsubscribe = videoStore.$subscribe((mutation, state) => {
    // 当 store 变化时执行操作
    console.log('Video store changed:', mutation.type, mutation.payload)
    
    // 例如：保存到本地存储
    localStorage.setItem('videoHistory', JSON.stringify(state.recentlyViewed))
  }, { detached: true }) // detached: true 表示组件卸载时不自动取消订阅
})

onUnmounted(() => {
  // 手动取消订阅
  if (unsubscribe) unsubscribe()
})
```

## 4. 常见状态管理模式

### 4.1 列表-详情模式

管理列表和详细信息的状态模式：

```typescript
// stores/videos.ts
export const useVideoStore = defineStore('videos', {
  state: () => ({
    list: [] as Video[],
    currentId: null as string | null,
    loading: {
      list: false,
      detail: false
    },
    error: null as Error | null
  }),
  
  getters: {
    currentVideo: (state) => {
      if (!state.currentId) return null
      return state.list.find(video => video.id === state.currentId) || null
    }
  },
  
  actions: {
    async fetchList() {
      this.loading.list = true
      try {
        this.list = await videoService.getVideos()
      } catch (err) {
        this.error = err as Error
      } finally {
        this.loading.list = false
      }
    },
    
    async fetchDetail(id: string) {
      this.loading.detail = true
      this.currentId = id
      
      try {
        // 如果列表中已存在该视频，则使用缓存数据
        const exists = this.list.some(v => v.id === id)
        
        if (!exists) {
          const video = await videoService.getVideoById(id)
          this.list.push(video)
        }
      } catch (err) {
        this.error = err as Error
      } finally {
        this.loading.detail = false
      }
    }
  }
})
```

### 4.2 分页模式

处理分页数据的状态模式：

```typescript
// stores/videos.ts
export const useVideoStore = defineStore('videos', {
  state: () => ({
    items: [] as Video[],
    pagination: {
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0
    },
    loading: false,
    error: null as Error | null
  }),
  
  getters: {
    paginatedItems: (state) => state.items,
    hasNextPage: (state) => state.pagination.currentPage < state.pagination.totalPages,
    hasPrevPage: (state) => state.pagination.currentPage > 1
  },
  
  actions: {
    async fetchPage(page: number = 1) {
      this.loading = true
      
      try {
        const { data, pagination } = await videoService.getVideos({
          page,
          pageSize: this.pagination.pageSize
        })
        
        this.items = data
        this.pagination = pagination
      } catch (err) {
        this.error = err as Error
      } finally {
        this.loading = false
      }
    },
    
    async nextPage() {
      if (this.hasNextPage) {
        await this.fetchPage(this.pagination.currentPage + 1)
      }
    },
    
    async prevPage() {
      if (this.hasPrevPage) {
        await this.fetchPage(this.pagination.currentPage - 1)
      }
    }
  }
})
```

### 4.3 表单状态模式

管理表单状态和验证的模式：

```typescript
// stores/videoForm.ts
export const useVideoFormStore = defineStore('videoForm', {
  state: () => ({
    form: {
      title: '',
      description: '',
      category: '',
      tags: [] as string[],
      file: null as File | null
    },
    errors: {} as Record<string, string>,
    touched: {} as Record<string, boolean>,
    submitting: false,
    submitted: false
  }),
  
  getters: {
    isValid: (state) => {
      // 检查必填字段
      const requiredFields = ['title', 'category', 'file']
      return requiredFields.every(field => Boolean(state.form[field])) && 
        Object.keys(state.errors).length === 0
    }
  },
  
  actions: {
    updateField(field: string, value: any) {
      this.form[field] = value
      this.touched[field] = true
      this.validate(field)
    },
    
    validate(field?: string) {
      const fieldsToValidate = field ? [field] : Object.keys(this.form)
      
      for (const field of fieldsToValidate) {
        // 清除原有错误
        delete this.errors[field]
        
        // 验证逻辑
        if (field === 'title') {
          if (!this.form.title) {
            this.errors.title = '标题不能为空'
          } else if (this.form.title.length < 3) {
            this.errors.title = '标题长度不能少于 3 个字符'
          }
        }
        
        // ... 其他字段验证
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async submit() {
      if (!this.validate()) return false
      
      this.submitting = true
      
      try {
        await videoService.uploadVideo(this.form)
        this.submitted = true
        return true
      } catch (error) {
        console.error('Failed to submit form:', error)
        return false
      } finally {
        this.submitting = false
      }
    },
    
    reset() {
      this.form = {
        title: '',
        description: '',
        category: '',
        tags: [],
        file: null
      }
      this.errors = {}
      this.touched = {}
      this.submitted = false
    }
  }
})
```

### 4.4 缓存模式

缓存服务器数据以减少重复请求的模式：

```typescript
// stores/cache.ts
import { defineStore } from 'pinia'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number // 过期时间（毫秒）
}

export const useCacheStore = defineStore('cache', {
  state: () => ({
    cache: {} as Record<string, CacheItem<any>>
  }),
  
  actions: {
    set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000) {
      this.cache[key] = {
        data,
        timestamp: Date.now(),
        expiresIn
      }
    },
    
    get<T>(key: string): T | null {
      const item = this.cache[key]
      
      if (!item) return null
      
      // 检查是否过期
      const now = Date.now()
      if (now - item.timestamp > item.expiresIn) {
        // 缓存已过期，删除并返回 null
        delete this.cache[key]
        return null
      }
      
      return item.data as T
    },
    
    remove(key: string) {
      delete this.cache[key]
    },
    
    clear() {
      this.cache = {}
    }
  }
})

// 使用缓存 store
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  expiresIn?: number
): Promise<T> {
  const cacheStore = useCacheStore()
  
  // 尝试从缓存获取
  const cached = cacheStore.get<T>(key)
  if (cached) return cached
  
  // 缓存未命中，执行请求
  const data = await fetcher()
  
  // 存入缓存
  cacheStore.set(key, data, expiresIn)
  
  return data
}
```

## 5. 性能优化

### 5.1 避免不必要的响应性

使用 `markRaw` 标记不需要响应性的对象：

```typescript
import { markRaw } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    // 对于复杂但不需要响应性的对象，使用 markRaw
    icons: markRaw({
      home: '<svg>...</svg>',
      user: '<svg>...</svg>',
      // ...其他 SVG 图标
    })
  })
})
```

### 5.2 使用 `$patch` 批量更新状态

使用 `$patch` 方法一次性更新多个状态，减少不必要的更新：

```typescript
// 批量更新状态
store.$patch({
  count: 10,
  name: 'John',
  items: [...store.items, newItem]
})

// 或者使用函数形式，可以处理更复杂的更新逻辑
store.$patch((state) => {
  state.count = 10
  state.name = 'John'
  state.items.push(newItem)
})
```

### 5.3 大型集合使用 shallowRef

对于大型数据集合，使用 `shallowRef` 避免深度响应性带来的性能开销：

```typescript
// stores/largeData.ts
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useLargeDataStore = defineStore('largeData', () => {
  // 使用 shallowRef 管理大型数据集合
  const dataSet = shallowRef<LargeDataItem[]>([])
  
  async function fetchData() {
    const data = await api.fetchLargeDataSet()
    // 只有引用变化会触发更新，内部属性变化不会
    dataSet.value = data
  }
  
  return {
    dataSet,
    fetchData
  }
})
```

### 5.4 惰性加载 Store

只在需要时才导入和使用 store，避免不必要的加载：

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 状态初始化
const showDashboard = ref(false)

// 惰性加载 dashboard store
async function loadDashboard() {
  showDashboard.value = true
  
  // 仅在需要时导入 store
  const { useDashboardStore } = await import('@/stores/dashboard')
  const dashboardStore = useDashboardStore()
  await dashboardStore.initialize()
}
</script>
```

## 6. 测试策略

### 6.1 Store 单元测试

使用 Vitest 测试 Pinia store：

```typescript
// stores/counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 为每个测试创建新的 pinia 实例
    setActivePinia(createPinia())
  })
  
  it('increments the count', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    
    store.increment()
    expect(store.count).toBe(1)
  })
  
  it('doubles the count', () => {
    const store = useCounterStore()
    store.count = 2
    
    expect(store.doubleCount).toBe(4)
  })
  
  it('fetches count from server', async () => {
    // 模拟 API 请求
    vi.mock('@/services/api', () => ({
      fetchCount: vi.fn().mockResolvedValue({ data: { count: 5 } })
    }))
    
    const store = useCounterStore()
    await store.fetchCountFromServer()
    
    expect(store.count).toBe(5)
  })
})
```

### 6.2 组件集成测试

测试组件与 store 的集成：

```typescript
// components/Counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Counter from './Counter.vue'
import { useCounterStore } from '@/stores/counter'

describe('Counter Component', () => {
  beforeEach(() => {
    // 创建测试用 pinia 实例
  })
  
  it('renders the current count', () => {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            counter: { count: 5 }
          }
        })]
      }
    })
    
    expect(wrapper.text()).toContain('Count: 5')
  })
  
  it('increments the count when button is clicked', async () => {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      }
    })
    
    const store = useCounterStore()
    
    await wrapper.find('button').trigger('click')
    
    // 验证 store 方法被调用
    expect(store.increment).toHaveBeenCalled()
  })
})
```

## 7. 最佳实践

### 7.1 状态设计原则

1. **最小化全局状态**：只有真正需要在多个组件间共享的状态才应该放在 store 中
2. **状态集中管理**：相关的状态应该集中在一个 store 中，避免分散
3. **状态规范化**：避免状态嵌套过深，保持扁平化结构
4. **避免状态重复**：同一状态不应在多个 store 中重复定义

### 7.2 Action 设计原则

1. **副作用集中**：将所有副作用（API 调用、DOM 操作等）集中在 actions 中
2. **职责单一**：每个 action 应该只负责一个功能
3. **错误处理**：所有异步 action 应该妥善处理错误情况
4. **幂等性**：尽可能设计具有幂等性的 actions，相同的调用产生相同的结果

### 7.3 使用 Pinia 的注意事项

1. 在 `setup()` 外使用 store 时需要确保 pinia 实例已创建
2. 避免在非 setup 上下文中使用 store 的 state (可能导致响应性丢失)
3. 使用 `storeToRefs` 从 store 中提取响应式属性

```typescript
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

// 在组件中
const userStore = useUserStore()

// ❌ 错误: 解构会丢失响应性
const { name, email } = userStore

// ✅ 正确: 使用 storeToRefs
const { name, email } = storeToRefs(userStore)

// 方法可以直接解构，不影响功能
const { login, logout } = userStore
```

### 7.4 性能优化建议

1. 避免过大的 store，将大型 store 拆分为小型 store
2. 使用计算属性过滤数据，而不是在组件中频繁计算
3. 为复杂状态设置合理的缓存策略
4. 只在必要时订阅 store 变化

### 7.5 状态调试

利用 Vue Devtools 调试 Pinia store：

1. 安装 Vue Devtools 浏览器扩展
2. 使用 Timeline 面板追踪状态变化
3. 使用 Pinia 面板实时查看和编辑 store 状态

## 8. 总结

Atom 前端项目的状态管理采用 Pinia 作为核心解决方案，根据状态的作用范围和生命周期，将状态分为组件内部状态、共享状态、服务器状态、URL 状态和本地持久化状态。通过合理的 store 设计和优化策略，确保应用状态管理的可维护性、可测试性和性能。

项目中遵循"最小化全局状态"原则，只将真正需要跨组件共享的状态放入 Pinia store，组件内部状态则使用 Vue 的 Composition API 管理。对于服务器数据，实施缓存策略减少不必要的请求；对于需要持久化的状态，使用 `pinia-plugin-persistedstate` 插件保存到本地存储。

通过实施本文档中的状态管理设计和最佳实践，可以构建出一个状态清晰、逻辑分明的前端应用。 