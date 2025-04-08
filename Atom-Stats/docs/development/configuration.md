# 项目配置指南

## 配置文件说明

### 1. TypeScript 配置
`tsconfig.json` 继承自根目录配置，主要包含：
- 编译选项
- 类型检查规则
- 模块解析配置
- 路径别名设置

### 2. ESLint 配置
`.eslintrc.json` 继承自根目录配置，同时添加了一些 React 特定规则：
- 代码质量规则
- React Hooks 规则
- TypeScript 规则
- 导入顺序规则

### 3. 构建工具配置
`vite.config.ts` 包含以下配置：
- 开发服务器设置
- 构建优化选项
- 插件配置
- 环境变量处理

### 4. 样式配置
`tailwind.config.js` 定义了：
- 颜色主题
- 组件样式
- 响应式断点
- 自定义工具类

### 5. 环境变量
`.env` 文件包含以下配置项：
```bash
# 基础配置
VITE_APP_TITLE=Atom-Stats
VITE_APP_API_URL=http://localhost:3000
VITE_APP_VERSION=0.1.0

# 功能开关
VITE_ENABLE_MOCK=true
VITE_ENABLE_LOGGER=true
VITE_ENABLE_SENTRY=false

# API 配置
VITE_API_TIMEOUT=10000
VITE_API_RETRY=3

# 缓存配置
VITE_CACHE_ENABLE=true
VITE_CACHE_EXPIRES=3600
```

## 开发环境配置

### 1. VS Code 设置
推荐在 `.vscode/settings.json` 中添加：
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "\"([^\"]*)\"|'([^']*)'"]
  ]
}
```

### 2. Git 配置
在 `.gitignore` 中忽略以下文件：
```gitignore
# 依赖
node_modules
.pnpm-store

# 构建产物
dist
build

# 环境变量
.env
.env.local

# 编辑器
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# 测试
coverage
```

## 构建配置

### 开发环境构建
```bash
# 使用开发配置
pnpm dev

# 使用模拟数据
pnpm dev:mock
```

### 生产环境构建
```bash
# 标准构建
pnpm build

# 分析构建
pnpm build:analyze
```

## 部署配置

### 容器化部署
`Dockerfile` 配置示例：
```dockerfile
# 构建阶段
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD 配置
GitHub Actions 工作流配置示例：
```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

## 监控配置

### 错误监控
可以集成 Sentry 进行错误监控：
```typescript
// src/utils/sentry.ts
import * as Sentry from "@sentry/react";

export function initSentry() {
  if (import.meta.env.VITE_ENABLE_SENTRY === "true") {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION,
    });
  }
}
```

### 性能监控
集成性能监控工具：
```typescript
// src/utils/performance.ts
export function initPerformanceMonitoring() {
  // 配置性能监控
  if (import.meta.env.PROD) {
    // 初始化性能监控
  }
}
```

## 缓存配置

### 浏览器缓存
在 `vite.config.ts` 中配置：
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 配置代码分割
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
```

### API 缓存
在 API 请求中配置缓存：
```typescript
// src/utils/request.ts
import { setupCache } from "axios-cache-interceptor";

export const axiosInstance = setupCache(axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
}));
```