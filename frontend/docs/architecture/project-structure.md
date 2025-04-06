# 项目结构

本文档详细描述 Atom 前端项目的目录结构和文件组织方式，为开发团队提供清晰的代码导航指南。

## 1. Monorepo 结构

Atom Video 项目采用 Monorepo 架构，主要目录结构如下：

```
atom-video/
├── frontend/           # 前端项目
├── backend/            # 后端项目
├── packages/           # 共享包
│   ├── eslint-config/  # 共享ESLint配置
│   ├── shared-types/   # 共享TypeScript类型
│   └── tsconfig/       # 共享TypeScript配置
├── .husky/             # Git hooks 配置
├── .vscode/            # VS Code 编辑器配置
├── .npmrc              # pnpm 配置
├── package.json        # 工作区配置
└── tsconfig.json       # 根 TypeScript 配置
```

### 1.1 共享包目录

#### 1.1.1 `packages/eslint-config/`

共享的 ESLint 配置，包含：

```
eslint-config/
├── index.js           # 基础配置
├── vue.js             # Vue项目配置
├── node.js            # Node.js项目配置
└── package.json       # 包配置
```

#### 1.1.2 `packages/shared-types/`

共享的 TypeScript 类型定义，包含：

```
shared-types/
├── api/               # API相关类型
│   ├── index.d.ts     # API基础类型
│   ├── user.d.ts      # 用户API类型
│   └── video.d.ts     # 视频API类型
├── models/            # 数据模型类型
│   └── index.d.ts     # 模型基础类型
├── utils/             # 工具类型
│   └── index.d.ts     # 工具函数类型
├── index.d.ts         # 类型导出
└── package.json       # 包配置
```

#### 1.1.3 `packages/tsconfig/`

共享的 TypeScript 配置，包含：

```
tsconfig/
├── base.json          # 基础配置
├── vue-app.json       # Vue应用配置
├── node.json          # Node.js应用配置
└── package.json       # 包配置
```

## 2. 前端项目目录结构

```
frontend/
├── .husky/             # Git hooks 配置
├── .vscode/            # VS Code 编辑器配置
├── docs/               # 项目文档
│   └── architecture/   # 架构设计文档
├── public/             # 静态资源目录
├── src/                # 源代码目录
│   ├── assets/         # 静态资源
│   ├── components/     # 组件目录
│   ├── composables/    # 组合式函数
│   ├── constants/      # 常量定义
│   ├── directives/     # 自定义指令
│   ├── layouts/        # 布局组件
│   ├── models/         # 数据模型
│   ├── pages/          # 页面组件
│   ├── plugins/        # 插件
│   ├── router/         # 路由配置
│   ├── services/       # API 服务
│   ├── stores/         # 状态管理
│   ├── styles/         # 全局样式
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   ├── main.ts         # 应用入口
│   └── env.d.ts        # 环境变量类型声明
├── tests/              # 测试目录
│   ├── e2e/            # 端到端测试
│   └── unit/           # 单元测试
├── .env                # 环境变量
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── eslint.config.js    # ESLint 配置
├── .gitignore          # Git 忽略文件
├── index.html          # HTML 模板
├── package.json        # 项目依赖配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 构建配置
└── README.md           # 项目说明
```

## 3. 关键目录详解

### 3.1 `src/components/`

组件目录采用分层组织，包含以下子目录：

```
components/
├── base/           # 基础 UI 组件
│   ├── Button/
│   ├── Card/
│   ├── Dialog/
│   ├── Form/
│   └── ...
├── business/       # 业务组件
│   ├── video/      # 视频相关组件
│   ├── user/       # 用户相关组件
│   ├── comment/    # 评论相关组件
│   └── ...
└── common/         # 通用业务组件
    ├── Header/
    ├── Footer/
    ├── Sidebar/
    └── ...
```

#### 组件命名规范

- 基础组件使用 `Base` 前缀，如 `BaseButton.vue`
- 业务组件使用功能描述命名，如 `VideoPlayer.vue`
- 通用业务组件使用描述性命名，如 `PageHeader.vue`

#### 单文件组件结构

每个组件目录结构如下：

```
Button/
├── BaseButton.vue      # 组件实现
├── BaseButton.test.ts  # 组件测试
└── index.ts            # 导出文件
```

### 3.2 `src/composables/`

组合式函数按功能领域组织：

```
composables/
├── auth/           # 认证相关
│   ├── useAuth.ts
│   └── usePermission.ts
├── form/           # 表单相关
│   ├── useForm.ts
│   └── useValidation.ts
├── ui/             # UI 相关
│   ├── useBreakpoints.ts
│   └── useTheme.ts
└── ...
```

### 3.3 `src/pages/`

页面组件按功能模块组织：

```
pages/
├── auth/           # 认证页面
│   ├── LoginPage.vue
│   └── RegisterPage.vue
├── home/           # 首页相关
│   └── HomePage.vue
├── video/          # 视频相关页面
│   ├── VideoDetailPage.vue
│   ├── VideoListPage.vue
│   └── VideoUploadPage.vue
└── ...
```

### 3.4 `src/services/`

API 服务按业务领域组织：

```
services/
├── api/            # API 客户端配置
│   ├── client.ts   # Axios 实例配置
│   └── interceptors.ts  # 请求/响应拦截器
├── user/           # 用户相关 API
│   └── userService.ts
├── video/          # 视频相关 API
│   └── videoService.ts
└── ...
```

### 3.5 `src/stores/`

状态管理按业务模块组织：

```
stores/
├── auth.ts         # 认证状态
├── user.ts         # 用户状态
├── video.ts        # 视频状态
└── ...
```

### 3.6 `src/styles/`

全局样式文件组织：

```
styles/
├── components.css     # 组件通用样式
├── index.css          # 样式入口文件
├── tailwind.css       # Tailwind 配置
├── theme.css          # 主题相关样式
└── variables.css      # CSS 变量定义
```

## 4. 文件命名规范

项目采用以下命名规范：

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| Vue 组件 | PascalCase | `VideoPlayer.vue` |
| TypeScript 文件 | camelCase | `videoService.ts` |
| 测试文件 | 原文件名.test.ts | `videoService.test.ts` |
| 样式文件 | kebab-case | `button-styles.css` |
| 常量文件 | UPPER_CASE | `API_ENDPOINTS.ts` |

## 5. 模块导入规范

模块导入顺序：

1. 外部库导入
2. 类型导入
3. 项目内部模块导入
4. 样式导入

示例：

```typescript
// 外部库导入
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 类型导入
import type { Video } from '@/types/video'

// 项目内部模块导入
import { videoService } from '@/services/video'
import BaseButton from '@/components/base/Button'

// 样式导入
import './styles.css'
```

## 6. 共享包依赖引用

在项目中引用共享包时，使用 workspace 协议：

```json
{
  "dependencies": {
    "@atom/shared-types": "workspace:*"
  },
  "devDependencies": {
    "@atom/eslint-config": "workspace:*",
    "@atom/tsconfig": "workspace:*"
  }
}
```

配置文件引用示例：

```js
// ESLint配置
import vueConfig from '@atom/eslint-config/vue';

// tsconfig.json
{
  "extends": "@atom/tsconfig/vue-app.json"
}
```

## 7. 总结

Atom 前端项目采用清晰的目录结构和命名规范，确保代码组织的一致性和可维护性。开发人员应遵循本文档中的规范，确保项目结构的统一性。如需添加新的目录或变更组织方式，应先更新本文档并获得团队共识。 