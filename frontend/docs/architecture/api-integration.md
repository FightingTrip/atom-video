# API 集成

本文档详细描述 Atom 前端项目的 API 集成设计，包括 API 客户端配置、请求封装、错误处理以及最佳实践。

## 1. API 架构概述

Atom 前端项目采用模块化的 API 架构，基于 Axios 构建 HTTP 客户端，按业务领域划分 API 服务，确保代码的可维护性和复用性。

### 1.1 架构目标

- **统一管理**：集中管理 API 请求配置和拦截器
- **类型安全**：使用 TypeScript 类型确保请求和响应数据的类型安全
- **错误处理**：统一的错误处理机制
- **缓存策略**：合理的请求缓存策略，减少冗余请求
- **请求状态**：统一管理请求状态（加载中、错误等）
- **易扩展**：便于添加新的 API 端点和服务
- **易测试**：易于编写单元测试和集成测试

### 1.2 目录结构

```
src/services/
├── api/                 # API 核心配置
│   ├── client.ts        # Axios 实例配置
│   ├── interceptors.ts  # 请求/响应拦截器
│   ├── errorHandler.ts  # 错误处理
│   └── types.ts         # 通用 API 类型定义
├── auth/                # 认证相关服务
│   ├── authService.ts   # 登录、注册等 API
│   └── types.ts         # 认证相关类型
├── user/                # 用户相关服务
│   ├── userService.ts   # 用户资料、设置等 API
│   └── types.ts         # 用户相关类型
├── video/               # 视频相关服务
│   ├── videoService.ts  # 视频管理、上传等 API
│   └── types.ts         # 视频相关类型
└── comment/             # 评论相关服务
    ├── commentService.ts # 评论获取、发布等 API
    └── types.ts         # 评论相关类型
```

## 2. API 客户端配置

### 2.1 基础 Axios 配置

使用 Axios 创建 HTTP 客户端实例：

```typescript
// services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { setupInterceptors } from './interceptors'
import { handleApiError } from './errorHandler'

// 默认配置
const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// 创建 Axios 实例
export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    ...defaultConfig,
    ...config
  })
  
  // 设置拦截器
  setupInterceptors(client)
  
  return client
}

// 创建默认 API 客户端
export const apiClient = createApiClient()

// API 请求包装器，统一处理错误
export const apiRequest = async <T>(
  request: Promise<T>
): Promise<T> => {
  try {
    return await request
  } catch (error) {
    throw handleApiError(error)
  }
}
```

### 2.2 请求/响应拦截器

拦截器用于处理请求前和响应后的通用逻辑：

```typescript
// services/api/interceptors.ts
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user'

export function setupInterceptors(client: AxiosInstance): void {
  // 请求拦截器
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 获取用户 token
      const userStore = useUserStore()
      const token = userStore.token
      
      // 如果有 token，添加到请求头
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  
  // 响应拦截器
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // 直接返回响应数据
      return response.data
    },
    async (error: AxiosError) => {
      // 获取响应状态码
      const status = error.response?.status
      
      // 处理 401 未授权错误（token 过期等）
      if (status === 401) {
        const userStore = useUserStore()
        
        // 尝试刷新 token
        try {
          await userStore.refreshToken()
          
          // 刷新成功，重试请求
          const originalRequest = error.config
          return client(originalRequest as InternalAxiosRequestConfig)
        } catch (refreshError) {
          // 刷新失败，登出用户
          userStore.logout()
          
          // 重定向到登录页
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }
      
      return Promise.reject(error)
    }
  )
}
```

### 2.3 错误处理

统一的 API 错误处理：

```typescript
// services/api/errorHandler.ts
import { AxiosError } from 'axios'
import { useNotificationStore } from '@/stores/notification'

// API 错误类
export class ApiError extends Error {
  public status: number
  public code: string
  public data: any
  
  constructor(message: string, status: number, code: string = '', data: any = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.data = data
  }
}

// 处理 API 错误
export function handleApiError(error: unknown): never {
  const notificationStore = useNotificationStore()
  
  if (error instanceof AxiosError) {
    const { response } = error
    
    if (response) {
      // 服务器返回的错误
      const { status, data } = response
      const message = data?.message || error.message || '请求失败'
      const errorCode = data?.code || ''
      
      // 显示错误通知
      notificationStore.showMessage({
        type: 'error',
        message
      })
      
      throw new ApiError(message, status, errorCode, data)
    } else if (error.request) {
      // 请求发送成功但没有收到响应
      const message = '服务器无响应，请稍后再试'
      
      notificationStore.showMessage({
        type: 'error',
        message
      })
      
      throw new ApiError(message, 0, 'NO_RESPONSE')
    }
  }
  
  // 其他错误
  const message = error instanceof Error ? error.message : '发生未知错误'
  
  notificationStore.showMessage({
    type: 'error',
    message
  })
  
  throw new ApiError(message, 0, 'UNKNOWN_ERROR')
}
```

### 2.4 API 响应类型

定义通用 API 响应类型：

```typescript
// services/api/types.ts
// 通用 API 响应格式
export interface ApiResponse<T> {
  data: T
  message: string
  code: string
  success: boolean
}

// 分页数据
export interface PaginatedData<T> {
  items: T[]
  pagination: Pagination
}

// 分页信息
export interface Pagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// 搜索过滤参数
export interface FilterParams {
  keyword?: string
  [key: string]: any
}

// 合并分页和过滤参数
export type QueryParams = PaginationParams & FilterParams
```

## 3. API 服务实现

### 3.1 模块化服务设计

每个业务领域使用独立的服务模块：

```typescript
// services/video/types.ts
import { PaginatedData, QueryParams } from '@/services/api/types'

// 视频数据类型
export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  duration: number
  views: number
  likes: number
  published: boolean
  publishedAt: string
  userId: string
  username: string
  userAvatar: string
  tags: string[]
  category: string
}

// 创建视频请求
export interface CreateVideoRequest {
  title: string
  description: string
  category: string
  tags: string[]
  file: File
  thumbnail?: File
}

// 更新视频请求
export interface UpdateVideoRequest {
  title?: string
  description?: string
  category?: string
  tags?: string[]
  published?: boolean
  thumbnail?: File
}

// 视频查询参数
export interface VideoQueryParams extends QueryParams {
  category?: string
  userId?: string
  published?: boolean
  tags?: string[]
}
```

### 3.2 服务实现

业务服务实现示例：

```typescript
// services/video/videoService.ts
import { apiClient, apiRequest } from '@/services/api/client'
import type { Video, CreateVideoRequest, UpdateVideoRequest, VideoQueryParams } from './types'
import type { PaginatedData, ApiResponse } from '@/services/api/types'

export const videoService = {
  // 获取视频列表
  async getVideos(params?: VideoQueryParams): Promise<PaginatedData<Video>> {
    return apiRequest(
      apiClient.get<PaginatedData<Video>>('/videos', { params })
    )
  },
  
  // 获取单个视频
  async getVideoById(id: string): Promise<Video> {
    return apiRequest(
      apiClient.get<Video>(`/videos/${id}`)
    )
  },
  
  // 创建新视频
  async createVideo(data: CreateVideoRequest): Promise<Video> {
    // 使用 FormData 处理文件上传
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category', data.category)
    
    // 处理标签数组
    data.tags.forEach(tag => {
      formData.append('tags[]', tag)
    })
    
    // 添加视频文件和缩略图
    formData.append('file', data.file)
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail)
    }
    
    return apiRequest(
      apiClient.post<Video>('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    )
  },
  
  // 更新视频
  async updateVideo(id: string, data: UpdateVideoRequest): Promise<Video> {
    // 使用表单数据或 JSON 取决于是否有文件上传
    if (data.thumbnail) {
      const formData = new FormData()
      
      // 添加所有非文件字段
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'thumbnail' && key !== 'tags') {
          formData.append(key, String(value))
        }
      })
      
      // 处理标签数组
      if (data.tags) {
        data.tags.forEach(tag => {
          formData.append('tags[]', tag)
        })
      }
      
      // 添加缩略图
      formData.append('thumbnail', data.thumbnail)
      
      return apiRequest(
        apiClient.put<Video>(`/videos/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      )
    } else {
      // 没有文件，使用 JSON
      return apiRequest(
        apiClient.put<Video>(`/videos/${id}`, data)
      )
    }
  },
  
  // 删除视频
  async deleteVideo(id: string): Promise<void> {
    return apiRequest(
      apiClient.delete(`/videos/${id}`)
    )
  },
  
  // 点赞视频
  async likeVideo(id: string): Promise<{ likes: number }> {
    return apiRequest(
      apiClient.post<{ likes: number }>(`/videos/${id}/like`)
    )
  },
  
  // 取消点赞
  async unlikeVideo(id: string): Promise<{ likes: number }> {
    return apiRequest(
      apiClient.delete<{ likes: number }>(`/videos/${id}/like`)
    )
  },
  
  // 获取相关视频
  async getRelatedVideos(id: string, limit: number = 5): Promise<Video[]> {
    return apiRequest(
      apiClient.get<Video[]>(`/videos/${id}/related`, {
        params: { limit }
      })
    )
  }
}
```

### 3.3 认证服务

处理用户认证相关 API：

```typescript
// services/auth/types.ts
export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

// services/auth/authService.ts
import { apiClient, apiRequest } from '@/services/api/client'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse
} from './types'
import type { User } from '@/services/user/types'

export const authService = {
  // 用户登录
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiRequest(
      apiClient.post<LoginResponse>('/auth/login', data)
    )
  },
  
  // 用户注册
  async register(data: RegisterRequest): Promise<User> {
    return apiRequest(
      apiClient.post<User>('/auth/register', data)
    )
  },
  
  // 刷新 token
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return apiRequest(
      apiClient.post<RefreshTokenResponse>('/auth/refresh', data)
    )
  },
  
  // 用户登出
  async logout(): Promise<void> {
    return apiRequest(
      apiClient.post('/auth/logout')
    )
  },
  
  // 发送密码重置链接
  async forgotPassword(email: string): Promise<void> {
    return apiRequest(
      apiClient.post('/auth/forgot-password', { email })
    )
  },
  
  // 重置密码
  async resetPassword(token: string, password: string, confirmPassword: string): Promise<void> {
    return apiRequest(
      apiClient.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      })
    )
  },
  
  // 验证 token 是否有效
  async validateToken(): Promise<boolean> {
    try {
      await apiRequest(
        apiClient.post('/auth/validate')
      )
      return true
    } catch (error) {
      return false
    }
  }
}
``` 