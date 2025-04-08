# API 设计文档

## RESTful API 设计

### 1. 项目管理 API

#### 获取项目列表
```typescript
GET /api/projects
Query Parameters:
  - page: number       // 页码
  - limit: number      // 每页数量
  - search: string     // 搜索关键词
  - sort: string       // 排序字段
  - order: 'asc'|'desc'// 排序方向

Response:
{
  data: Project[];
  total: number;
  page: number;
  limit: number;
}
```

#### 创建项目
```typescript
POST /api/projects
Request Body:
{
  name: string;        // 项目名称
  description: string; // 项目描述
  repository: string;  // 仓库地址
  branch: string;      // 分支名称
}

Response:
{
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  createdAt: string;
}
```

### 2. 代码分析 API

#### 触发分析
```typescript
POST /api/projects/:id/analyze
Request Body:
{
  type: 'full' | 'incremental';  // 分析类型
  options?: {
    includePaths?: string[];     // 包含的路径
    excludePaths?: string[];     // 排除的路径
  };
}

Response:
{
  taskId: string;      // 分析任务ID
  status: 'queued';    // 任务状态
  estimatedTime: number; // 预计完成时间
}
```

#### 获取分析结果
```typescript
GET /api/projects/:id/analysis
Query Parameters:
  - type: 'code'|'git'|'team'  // 分析类型
  - from: string               // 开始时间
  - to: string                 // 结束时间

Response:
{
  code?: CodeStats;
  git?: GitStats;
  team?: TeamStats;
  lastUpdated: string;
}
```

### 3. 团队分析 API

#### 获取贡献者统计
```typescript
GET /api/projects/:id/contributors
Query Parameters:
  - period: 'day'|'week'|'month'|'year'
  - from: string
  - to: string

Response:
{
  contributors: Array<{
    id: string;
    name: string;
    email: string;
    commits: number;
    additions: number;
    deletions: number;
    activity: Array<{
      date: string;
      count: number;
    }>;
  }>;
  total: {
    commits: number;
    additions: number;
    deletions: number;
  };
}
```

## WebSocket API

### 1. 实时更新
```typescript
WebSocket: /ws/projects/:id

// 服务器推送消息
interface ServerMessage {
  type: 'analysis_progress' | 'analysis_complete' | 'error';
  payload: {
    taskId?: string;
    progress?: number;
    status?: string;
    error?: string;
    result?: any;
  };
}

// 客户端消息
interface ClientMessage {
  type: 'subscribe' | 'unsubscribe';
  payload: {
    projectId: string;
    events?: string[];
  };
}
```

## 错误处理

### 1. 错误响应格式
```typescript
{
  error: {
    code: string;      // 错误代码
    message: string;   // 错误信息
    details?: any;     // 详细信息
  };
  timestamp: string;   // 错误发生时间
  path: string;        // 请求路径
}
```

### 2. 错误代码
```typescript
enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',          // 400
  UNAUTHORIZED = 'UNAUTHORIZED',         // 401
  FORBIDDEN = 'FORBIDDEN',              // 403
  NOT_FOUND = 'NOT_FOUND',             // 404
  CONFLICT = 'CONFLICT',               // 409
  RATE_LIMIT = 'RATE_LIMIT',           // 429
  INTERNAL_ERROR = 'INTERNAL_ERROR',   // 500
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503
}
```

## 认证和授权

### 1. 认证头
```typescript
headers: {
  'Authorization': 'Bearer <token>'
}
```

### 2. 权限控制
```typescript
// 响应包含权限信息
{
  data: T;
  permissions: {
    read: boolean;
    write: boolean;
    admin: boolean;
  };
}
```

## 数据模型

### 1. 项目模型
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  status: 'active' | 'archived';
  lastAnalysis: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    codeLines: number;
    languages: Array<{
      name: string;
      percentage: number;
    }>;
    contributors: number;
    commits: number;
  };
}
```

### 2. 分析结果模型
```typescript
interface AnalysisResult {
  codeStats: {
    totalLines: number;
    languages: Record<string, {
      files: number;
      lines: number;
      blanks: number;
      comments: number;
      code: number;
    }>;
    complexity: {
      average: number;
      files: Array<{
        path: string;
        complexity: number;
      }>;
    };
  };
  
  gitStats: {
    commits: number;
    branches: number;
    contributors: number;
    firstCommit: string;
    lastCommit: string;
    activity: Array<{
      date: string;
      commits: number;
      additions: number;
      deletions: number;
    }>;
  };
  
  teamStats: {
    activeContributors: number;
    reviewTime: number;
    mergeTime: number;
    codeReviewCoverage: number;
    contributions: Array<{
      author: string;
      commits: number;
      additions: number;
      deletions: number;
      reviews: number;
    }>;
  };
}
```

## 缓存策略

### 1. 缓存头
```typescript
headers: {
  'Cache-Control': 'public, max-age=3600',
  'ETag': '...',
  'Last-Modified': '...'
}
```

### 2. 缓存验证
```typescript
// 请求头
headers: {
  'If-None-Match': '...',
  'If-Modified-Since': '...'
}

// 304 响应
status: 304
headers: {
  'ETag': '...',
  'Cache-Control': 'public, max-age=3600'
}
```

## 限流策略

### 1. 限流头
```typescript
headers: {
  'X-RateLimit-Limit': '1000',
  'X-RateLimit-Remaining': '999',
  'X-RateLimit-Reset': '1624444800'
}
```

### 2. 超限响应
```typescript
status: 429
{
  error: {
    code: 'RATE_LIMIT',
    message: '请求超出限制',
    details: {
      limit: 1000,
      remaining: 0,
      reset: 1624444800
    }
  }
}
```