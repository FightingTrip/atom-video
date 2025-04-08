# API 集成 (第二部分)

接续 API 集成文档的第一部分，本文档详细描述 Atom 前端项目的 API 请求状态管理、缓存策略和最佳实践。

## 4. 请求状态管理

### 4.1 组合式 API 封装

使用组合式 API (Composables) 封装 API 请求状态管理：

```typescript
// composables/api/useApi.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

interface UseApiOptions {
  // 是否自动加载
  loadOnMount?: boolean
  // 错误回调
  onError?: (error: any) => void
  // 成功回调
  onSuccess?: (data: any) => void
}

// 通用 API 请求钩子
export function useApi<T, P extends any[] = any[]>(
  apiFn: (...args: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const { loadOnMount = false, onError, onSuccess } = options
  
  // 状态
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<any>(null)
  const called = ref(false)
  
  // 执行 API 请求
  const execute = async (...args: P): Promise<T | null> => {
    loading.value = true
    error.value = null
    called.value = true
    
    try {
      const result = await apiFn(...args)
      data.value = result
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      error.value = err
      
      // 执行错误回调
      if (onError) {
        onError(err)
      }
      
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 重置状态
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
    called.value = false
  }
  
  // 根据选项自动加载
  if (loadOnMount) {
    execute(...([] as unknown as P))
  }
  
  // 计算属性
  const isSuccess = computed(() => called.value && !loading.value && !error.value)
  const isError = computed(() => !!error.value)
  
  return {
    data,
    loading,
    error,
    execute,
    reset,
    isSuccess,
    isError,
    called
  }
}
```

### 4.2 针对分页数据的状态管理

扩展组合式 API，专门处理分页数据：

```typescript
// composables/api/usePaginatedApi.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { PaginatedData, QueryParams } from '@/services/api/types'

interface UsePaginatedApiOptions<T> {
  // 初始页码
  initialPage?: number
  // 每页数量
  pageSize?: number
  // 初始排序字段
  initialSort?: string
  // 初始排序方向
  initialOrder?: 'asc' | 'desc'
  // 初始过滤条件
  initialFilters?: Record<string, any>
  // 成功回调
  onSuccess?: (data: PaginatedData<T>) => void
  // 错误回调
  onError?: (error: any) => void
}

// 分页数据请求钩子
export function usePaginatedApi<T>(
  apiFn: (params: QueryParams) => Promise<PaginatedData<T>>,
  options: UsePaginatedApiOptions<T> = {}
) {
  const {
    initialPage = 1,
    pageSize = 20,
    initialSort,
    initialOrder = 'desc',
    initialFilters = {},
    onSuccess,
    onError
  } = options
  
  // 状态
  const data = ref<T[]>([]) as Ref<T[]>
  const pagination = ref({
    currentPage: initialPage,
    pageSize,
    totalItems: 0,
    totalPages: 0
  })
  const loading = ref(false)
  const error = ref<any>(null)
  const filters = ref({ ...initialFilters })
  const sort = ref(initialSort)
  const order = ref(initialOrder)
  
  // 构建查询参数
  const buildQueryParams = (): QueryParams => {
    const params: QueryParams = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    }
    
    // 添加排序
    if (sort.value) {
      params.sort = sort.value
      params.order = order.value
    }
    
    // 添加过滤条件
    return { ...params, ...filters.value }
  }
  
  // 加载数据
  const loadData = async (resetPage = false): Promise<void> => {
    // 重置页码（用于筛选条件变更时）
    if (resetPage) {
      pagination.value.currentPage = 1
    }
    
    loading.value = true
    error.value = null
    
    try {
      const queryParams = buildQueryParams()
      const result = await apiFn(queryParams)
      
      data.value = result.items
      pagination.value = result.pagination
      
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      error.value = err
      
      if (onError) {
        onError(err)
      }
    } finally {
      loading.value = false
    }
  }
  
  // 更新筛选条件
  const setFilters = (newFilters: Record<string, any>) => {
    filters.value = { ...newFilters }
    loadData(true) // 重置页码并加载数据
  }
  
  // 更改排序
  const setSort = (field: string) => {
    if (sort.value === field) {
      // 相同字段，切换排序方向
      order.value = order.value === 'asc' ? 'desc' : 'asc'
    } else {
      // 不同字段，设置新字段并默认降序
      sort.value = field
      order.value = 'desc'
    }
    
    loadData(true) // 重置页码并加载数据
  }
  
  // 页码变更
  const setPage = (page: number) => {
    pagination.value.currentPage = page
    loadData()
  }
  
  // 每页数量变更
  const setPageSize = (size: number) => {
    pagination.value.pageSize = size
    loadData(true) // 重置页码并加载数据
  }
  
  // 初始加载
  loadData()
  
  // 计算属性
  const isLastPage = computed(() => 
    pagination.value.currentPage >= pagination.value.totalPages
  )
  
  const isFirstPage = computed(() => 
    pagination.value.currentPage <= 1
  )
  
  const isEmpty = computed(() => 
    !loading.value && data.value.length === 0
  )
  
  return {
    data,
    pagination,
    loading,
    error,
    filters,
    sort,
    order,
    loadData,
    setFilters,
    setSort,
    setPage,
    setPageSize,
    isLastPage,
    isFirstPage,
    isEmpty
  }
}
```

### 4.3 在组件中使用

在组件中使用 API 状态管理钩子：

```vue
<!-- VideoListPage.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginatedApi } from '@/composables/api/usePaginatedApi'
import { videoService } from '@/services/video/videoService'
import VideoCard from '@/components/business/video/VideoCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import FilterPanel from '@/components/common/FilterPanel.vue'
import type { VideoQueryParams } from '@/services/video/types'

// 定义过滤条件
const filterOptions = ref<VideoQueryParams>({
  category: '',
  tags: []
})

// 使用分页 API 钩子
const {
  data: videos,
  pagination,
  loading,
  error,
  setFilters,
  setPage,
  setSort,
  isEmpty
} = usePaginatedApi(
  videoService.getVideos,
  {
    pageSize: 12,
    initialSort: 'publishedAt',
    initialOrder: 'desc'
  }
)

// 监听过滤条件变更
watch(filterOptions, (newFilters) => {
  setFilters(newFilters)
}, { deep: true })

// 处理分类选择
const handleCategoryChange = (category: string) => {
  filterOptions.value.category = category
}

// 处理排序变更
const handleSortChange = (field: string) => {
  setSort(field)
}
</script>

<template>
  <div class="video-list-page">
    <h1>视频列表</h1>
    
    <!-- 过滤面板 -->
    <FilterPanel 
      v-model:filters="filterOptions"
      @category-change="handleCategoryChange"
    />
    
    <!-- 排序工具栏 -->
    <div class="sort-toolbar">
      <button @click="handleSortChange('publishedAt')">
        最新发布
      </button>
      <button @click="handleSortChange('views')">
        最多观看
      </button>
      <button @click="handleSortChange('likes')">
        最多点赞
      </button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      正在加载...
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      加载失败: {{ error.message }}
      <button @click="loadData()">重试</button>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="isEmpty" class="empty-state">
      暂无视频
    </div>
    
    <!-- 视频列表 -->
    <div v-else class="video-grid">
      <VideoCard 
        v-for="video in videos" 
        :key="video.id" 
        :video="video" 
      />
    </div>
    
    <!-- 分页 -->
    <Pagination 
      v-if="pagination.totalPages > 1"
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @page-change="setPage"
    />
  </div>
</template>
```

## 5. 缓存策略

### 5.1 请求缓存实现

实现请求缓存，减少重复请求：

```typescript
// services/api/cache.ts
import { useUserStore } from '@/stores/user'

// 缓存项类型
interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// 缓存选项
interface CacheOptions {
  // 缓存时间（毫秒）
  ttl?: number
  // 缓存键前缀
  keyPrefix?: string
  // 是否为用户特定的缓存
  userSpecific?: boolean
}

// 默认选项
const defaultOptions: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5分钟
  keyPrefix: 'api_cache:',
  userSpecific: false
}

// 请求缓存管理
export class ApiCache {
  private cache = new Map<string, CacheItem<any>>()
  
  // 生成缓存键
  private generateKey(key: string, options: CacheOptions): string {
    let cacheKey = `${options.keyPrefix}${key}`
    
    // 如果是用户特定的缓存，添加用户 ID
    if (options.userSpecific) {
      const userStore = useUserStore()
      const userId = userStore.user?.id
      
      if (userId) {
        cacheKey = `${cacheKey}:user_${userId}`
      }
    }
    
    return cacheKey
  }
  
  // 设置缓存
  set<T>(key: string, data: T, options?: Partial<CacheOptions>): void {
    const mergedOptions = { ...defaultOptions, ...options }
    const cacheKey = this.generateKey(key, mergedOptions)
    const now = Date.now()
    
    this.cache.set(cacheKey, {
      data,
      timestamp: now,
      expiresAt: now + (mergedOptions.ttl || 0)
    })
  }
  
  // 获取缓存
  get<T>(key: string, options?: Partial<CacheOptions>): T | null {
    const mergedOptions = { ...defaultOptions, ...options }
    const cacheKey = this.generateKey(key, mergedOptions)
    const cached = this.cache.get(cacheKey)
    
    if (!cached) {
      return null
    }
    
    // 检查是否过期
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(cacheKey)
      return null
    }
    
    return cached.data as T
  }
  
  // 删除缓存
  delete(key: string, options?: Partial<CacheOptions>): void {
    const mergedOptions = { ...defaultOptions, ...options }
    const cacheKey = this.generateKey(key, mergedOptions)
    this.cache.delete(cacheKey)
  }
  
  // 清除所有缓存
  clear(): void {
    this.cache.clear()
  }
  
  // 清除用户相关缓存
  clearUserCache(): void {
    const userStore = useUserStore()
    const userId = userStore.user?.id
    
    if (!userId) return
    
    const userCachePrefix = `:user_${userId}`
    
    // 删除所有包含用户 ID 的缓存项
    for (const key of this.cache.keys()) {
      if (key.includes(userCachePrefix)) {
        this.cache.delete(key)
      }
    }
  }
  
  // 清除过期缓存
  clearExpired(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

// 创建单例
export const apiCache = new ApiCache()

// 用于自动清理过期缓存
setInterval(() => {
  apiCache.clearExpired()
}, 60 * 1000) // 每分钟清理一次
```

### 5.2 缓存装饰器

使用装饰器简化缓存逻辑：

```typescript
// services/api/cacheDecorators.ts
import { apiCache } from './cache'

// 获取请求参数的缓存键
function getParamsKey(params: any[]): string {
  if (params.length === 0) return ''
  
  try {
    return JSON.stringify(params)
  } catch (e) {
    console.warn('Failed to stringify params for cache key:', e)
    return ''
  }
}

// 缓存请求结果
export function withCache<T>(
  fn: (...args: any[]) => Promise<T>,
  keyPrefix: string,
  options?: {
    ttl?: number,
    userSpecific?: boolean,
    keyGenerator?: (...args: any[]) => string
  }
) {
  return async (...args: any[]): Promise<T> => {
    // 生成缓存键
    let key: string
    
    if (options?.keyGenerator) {
      key = options.keyGenerator(...args)
    } else {
      key = `${keyPrefix}:${getParamsKey(args)}`
    }
    
    // 尝试从缓存获取
    const cached = apiCache.get<T>(key, {
      ttl: options?.ttl,
      userSpecific: options?.userSpecific
    })
    
    if (cached !== null) {
      return cached
    }
    
    // 缓存未命中，执行请求
    const result = await fn(...args)
    
    // 存入缓存
    apiCache.set(key, result, {
      ttl: options?.ttl,
      userSpecific: options?.userSpecific
    })
    
    return result
  }
}

// 清除特定缓存
export function clearCache(keyPrefix: string, userSpecific = false): void {
  // 清除以该前缀开头的所有缓存
  const allKeys = Array.from(apiCache['cache'].keys())
  
  allKeys.forEach(key => {
    if (key.startsWith(`api_cache:${keyPrefix}`)) {
      apiCache.delete(key.replace('api_cache:', ''), { userSpecific })
    }
  })
}
```

### 5.3 在服务中使用缓存

将缓存应用于 API 服务：

```typescript
// services/video/videoService.ts
import { apiClient, apiRequest } from '@/services/api/client'
import { withCache, clearCache } from '@/services/api/cacheDecorators'
import type { Video, VideoQueryParams } from './types'
import type { PaginatedData } from '@/services/api/types'

// 原始未缓存的方法
const getVideosRaw = async (params?: VideoQueryParams): Promise<PaginatedData<Video>> => {
  return apiRequest(
    apiClient.get<PaginatedData<Video>>('/videos', { params })
  )
}

// 原始未缓存的方法
const getVideoByIdRaw = async (id: string): Promise<Video> => {
  return apiRequest(
    apiClient.get<Video>(`/videos/${id}`)
  )
}

// 包装缓存逻辑的视频服务
export const videoService = {
  // 获取视频列表 (缓存 2 分钟)
  getVideos: withCache(getVideosRaw, 'videos.list', {
    ttl: 2 * 60 * 1000,
    keyGenerator: (params?: VideoQueryParams) => `videos.list:${JSON.stringify(params || {})}`
  }),
  
  // 获取单个视频 (缓存 5 分钟)
  getVideoById: withCache(getVideoByIdRaw, 'videos.detail', {
    ttl: 5 * 60 * 1000,
    keyGenerator: (id: string) => `videos.detail:${id}`
  }),
  
  // 创建新视频 (清除相关缓存)
  async createVideo(data: CreateVideoRequest): Promise<Video> {
    const result = await apiRequest(
      apiClient.post<Video>('/videos', data)
    )
    
    // 清除视频列表缓存
    clearCache('videos.list')
    
    return result
  },
  
  // 更新视频 (清除相关缓存)
  async updateVideo(id: string, data: UpdateVideoRequest): Promise<Video> {
    const result = await apiRequest(
      apiClient.put<Video>(`/videos/${id}`, data)
    )
    
    // 清除特定视频缓存和列表缓存
    clearCache(`videos.detail:${id}`)
    clearCache('videos.list')
    
    return result
  },
  
  // 其他方法...
}
```

## 6. API 请求取消

### 6.1 取消请求实现

使用 Axios 的取消令牌实现请求取消：

```typescript
// composables/api/useCancelableApi.ts
import { ref, onUnmounted } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { useApi } from './useApi'

// 可取消请求钩子
export function useCancelableApi<T, P extends any[] = any[]>(
  apiFn: (...args: P) => Promise<T>,
  options = {}
) {
  // 保存所有取消令牌
  const cancelTokens = ref<CancelTokenSource[]>([])
  
  // 创建新的取消令牌
  const createCancelToken = (): CancelTokenSource => {
    const source = axios.CancelToken.source()
    cancelTokens.value.push(source)
    return source
  }
  
  // 取消所有请求
  const cancelAll = () => {
    cancelTokens.value.forEach(source => {
      source.cancel('Request canceled')
    })
    cancelTokens.value = []
  }
  
  // 包装原始 API 函数
  const wrappedApiFn = async (...args: P): Promise<T> => {
    // 获取最后一个参数作为配置对象（如果有）
    const lastArg = args[args.length - 1]
    const hasConfig = lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg)
    
    // 创建取消令牌
    const source = createCancelToken()
    
    try {
      if (hasConfig) {
        // 将取消令牌添加到现有配置
        const config = args[args.length - 1] as AxiosRequestConfig
        args[args.length - 1] = {
          ...config,
          cancelToken: source.token
        }
      } else {
        // 添加新的配置对象
        args.push({ cancelToken: source.token } as unknown as P[0])
      }
      
      return await apiFn(...args)
    } finally {
      // 从列表中移除已完成的令牌
      const index = cancelTokens.value.indexOf(source)
      if (index !== -1) {
        cancelTokens.value.splice(index, 1)
      }
    }
  }
  
  // 使用包装后的函数创建 API 钩子
  const apiHook = useApi(wrappedApiFn, options)
  
  // 组件卸载时取消所有请求
  onUnmounted(() => {
    cancelAll()
  })
  
  return {
    ...apiHook,
    cancelAll
  }
}
```

### 6.2 在组件中使用可取消请求

```vue
<!-- SearchPage.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCancelableApi } from '@/composables/api/useCancelableApi'
import { videoService } from '@/services/video/videoService'

const searchQuery = ref('')
const debouncedQuery = ref('')

// 使用可取消 API 钩子
const {
  data: searchResults,
  loading,
  error,
  execute: search,
  cancelAll
} = useCancelableApi(videoService.searchVideos)

// 监听搜索关键词变化
watch(searchQuery, async (query) => {
  // 取消所有进行中的请求
  cancelAll()
  
  // 简单的防抖
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = query
    if (query.trim()) {
      search({ keyword: query })
    }
  }, 300)
})

let debounceTimer: number

onUnmounted(() => {
  clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="search-page">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索视频..."
    />
    
    <div v-if="loading">搜索中...</div>
    <div v-else-if="error">搜索失败: {{ error.message }}</div>
    <div v-else-if="searchResults && searchResults.length === 0">
      没有找到与 "{{ debouncedQuery }}" 相关的视频
    </div>
    <div v-else-if="searchResults" class="search-results">
      <!-- 显示搜索结果 -->
    </div>
  </div>
</template>
```

## 7. API 文档和测试

### 7.1 API 文档注释

使用 JSDoc 为 API 方法添加文档说明：

```typescript
// services/video/videoService.ts
import { apiClient, apiRequest } from '@/services/api/client'
import type { Video, CreateVideoRequest, UpdateVideoRequest, VideoQueryParams } from './types'
import type { PaginatedData } from '@/services/api/types'

export const videoService = {
  /**
   * 获取视频列表
   * @param {VideoQueryParams} params - 查询参数，包括分页、排序和过滤条件
   * @returns {Promise<PaginatedData<Video>>} 分页视频数据
   * @throws {ApiError} 请求失败时抛出异常
   */
  async getVideos(params?: VideoQueryParams): Promise<PaginatedData<Video>> {
    return apiRequest(
      apiClient.get<PaginatedData<Video>>('/videos', { params })
    )
  },
  
  /**
   * 获取单个视频详情
   * @param {string} id - 视频 ID
   * @returns {Promise<Video>} 视频详情
   * @throws {ApiError} 请求失败时抛出异常
   */
  async getVideoById(id: string): Promise<Video> {
    return apiRequest(
      apiClient.get<Video>(`/videos/${id}`)
    )
  },
  
  // 其他方法...
}
```

### 7.2 API 服务单元测试

使用 Vitest 编写 API 服务测试：

```typescript
// services/video/videoService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { videoService } from './videoService'
import { apiClient } from '@/services/api/client'
import type { PaginatedData } from '@/services/api/types'
import type { Video } from './types'

// 模拟 apiClient
vi.mock('@/services/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  },
  apiRequest: vi.fn((promise) => promise)
}))

describe('videoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('getVideos should call the correct endpoint with parameters', async () => {
    // 准备模拟响应数据
    const mockResponse: PaginatedData<Video> = {
      items: [{ id: '1', title: 'Test Video' } as Video],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1
      }
    }
    
    // 设置模拟返回值
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)
    
    // 调用服务方法
    const params = { page: 1, category: 'tech' }
    const result = await videoService.getVideos(params)
    
    // 验证调用参数
    expect(apiClient.get).toHaveBeenCalledWith('/videos', { params })
    
    // 验证返回值
    expect(result).toEqual(mockResponse)
  })
  
  it('getVideoById should call the correct endpoint with ID', async () => {
    // 准备模拟响应数据
    const mockVideo = { id: '1', title: 'Test Video' } as Video
    
    // 设置模拟返回值
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockVideo)
    
    // 调用服务方法
    const result = await videoService.getVideoById('1')
    
    // 验证调用参数
    expect(apiClient.get).toHaveBeenCalledWith('/videos/1')
    
    // 验证返回值
    expect(result).toEqual(mockVideo)
  })
  
  // 其他测试...
})
```

## 8. API 最佳实践

### 8.1 API 服务设计原则

1. **职责单一**：每个 API 服务模块只负责一个业务领域
2. **类型安全**：使用 TypeScript 类型定义确保请求和响应数据的类型安全
3. **错误处理**：统一的错误处理机制，包括错误类型、错误消息和错误代码
4. **可测试**：设计便于测试的 API 服务，支持依赖注入和模拟
5. **缓存策略**：适当的缓存策略，减少冗余请求
6. **命名一致**：保持 API 方法命名的一致性，如 `getXxx`、`createXxx`、`updateXxx`、`deleteXxx`

### 8.2 前后端接口规范

1. **URI 命名**：使用有意义的资源路径，如 `/videos`、`/users`，避免使用动词
2. **HTTP 方法**：正确使用 HTTP 方法 - GET 获取，POST 创建，PUT 更新，DELETE 删除
3. **状态码**：正确使用 HTTP 状态码，如 200 成功，201 创建，400 请求错误，401 未认证，403 未授权，404 不存在，500 服务器错误
4. **统一响应格式**：使用统一的响应格式，包括数据、状态、消息等
5. **分页规范**：统一的分页参数（page、pageSize）和分页响应格式
6. **错误处理**：详细的错误信息，包括错误码和错误消息

### 8.3 API 开发流程

1. **定义接口**：先定义 API 接口和类型，明确输入输出
2. **实现服务**：实现 API 服务方法
3. **编写测试**：为 API 服务编写单元测试
4. **文档化**：使用 JSDoc 和类型注释文档化 API
5. **集成测试**：与后端集成后进行端到端测试
6. **优化**：根据需要添加缓存、错误处理等优化

### 8.4 常见问题与解决方案

#### 1. 重复请求

**问题**：用户多次快速点击可能发起重复请求

**解决方案**：
- 使用防抖操作
- 使用请求取消功能
- 禁用提交按钮直到请求完成

#### 2. 并发请求限制

**问题**：同时发起过多请求可能导致浏览器限制或服务器压力

**解决方案**：
- 使用请求队列，控制并发数量
- 合并请求，减少请求次数
- 优先级调度，优先处理重要请求

#### 3. 大量数据传输

**问题**：传输大量数据可能导致性能问题

**解决方案**：
- 分页加载数据
- 按需加载数据
- 数据压缩
- 优化请求频率

#### 4. 跨域请求

**问题**：跨域请求可能被浏览器安全策略阻止

**解决方案**：
- 配置服务器 CORS 头
- 使用代理服务器
- 适当时使用 JSONP（不推荐）

#### 5. 网络错误处理

**问题**：网络不稳定或断网情况下的请求处理

**解决方案**：
- 优雅的错误提示
- 自动重试机制
- 离线缓存策略
- 断网检测和恢复机制

## 9. 总结

Atom 前端项目的 API 集成架构基于 Axios 构建，采用模块化和类型安全的设计理念。通过封装 API 客户端、统一错误处理、实现请求状态管理和缓存策略，提供了一个强大、可扩展和易维护的 API 集成方案。

主要特点：

1. **模块化组织**：按业务领域划分 API 服务，降低耦合度
2. **类型安全**：使用 TypeScript 类型定义确保数据类型安全
3. **统一错误处理**：集中处理各类 API 错误，提供友好的错误提示
4. **状态管理**：使用组合式 API 封装请求状态，便于在组件中使用
5. **缓存策略**：实现请求缓存机制，减少冗余请求
6. **请求控制**：支持请求取消、超时控制等高级功能
7. **测试友好**：便于编写单元测试和集成测试

通过实施本文档中的 API 设计和最佳实践，可以构建出一个高效、可靠的前端 API 集成系统，为整个应用提供坚实的数据交互基础。 