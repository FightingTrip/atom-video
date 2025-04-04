# 项目结构

## 目录结构

```
atom-video/
├── .github/                    # GitHub 配置
│   ├── workflows/             # GitHub Actions 工作流
│   └── ISSUE_TEMPLATE/        # Issue 模板
├── docs/                      # 项目文档
│   ├── api/                  # API 文档
│   ├── architecture/         # 架构设计文档
│   ├── deployment/           # 部署文档
│   ├── development/          # 开发文档
│   └── introduction/         # 项目介绍文档
├── packages/                  # 多包管理
│   ├── frontend/            # 前端项目
│   │   ├── src/            # 源代码
│   │   │   ├── assets/     # 静态资源
│   │   │   ├── components/ # 组件
│   │   │   ├── composables/# 组合式函数
│   │   │   ├── router/     # 路由配置
│   │   │   ├── stores/     # 状态管理
│   │   │   ├── styles/     # 样式文件
│   │   │   ├── types/      # 类型定义
│   │   │   └── utils/      # 工具函数
│   │   ├── public/         # 公共资源
│   │   └── tests/          # 测试文件
│   └── backend/            # 后端项目
│       ├── src/            # 源代码
│       │   ├── config/     # 配置文件
│       │   ├── controllers/# 控制器
│       │   ├── middleware/ # 中间件
│       │   ├── models/     # 数据模型
│       │   ├── routes/     # 路由定义
│       │   ├── services/   # 业务逻辑
│       │   ├── types/      # 类型定义
│       │   └── utils/      # 工具函数
│       ├── tests/          # 测试文件
│       └── uploads/        # 上传文件存储
├── scripts/                  # 脚本文件
├── .env.example             # 环境变量示例
├── .eslintrc.js            # ESLint 配置
├── .prettierrc             # Prettier 配置
├── package.json            # 项目配置
└── pnpm-workspace.yaml     # pnpm 工作空间配置
```

## 前端项目结构

### `packages/frontend/src/`

#### `assets/`
- 存放静态资源文件
- 包括图片、字体、图标等
- 按类型分类存放

#### `components/`
- 可复用的 Vue 组件
- 按功能模块分类
- 每个组件包含：
  - 组件文件（.vue）
  - 样式文件（.scss）
  - 测试文件（.spec.ts）

#### `composables/`
- 组合式函数
- 按功能分类
- 包含：
  - 状态管理
  - 工具函数
  - 业务逻辑

#### `router/`
- 路由配置
- 路由守卫
- 路由类型定义

#### `stores/`
- Pinia 状态管理
- 按功能模块分类
- 包含：
  - 状态定义
  - Actions
  - Getters

#### `styles/`
- 全局样式
- 主题配置
- 变量定义

#### `types/`
- TypeScript 类型定义
- 接口定义
- 枚举类型

#### `utils/`
- 工具函数
- 辅助方法
- 常量定义

## 后端项目结构

### `packages/backend/src/`

#### `config/`
- 配置文件
- 环境变量处理
- 数据库配置

#### `controllers/`
- 控制器
- 请求处理
- 响应格式化

#### `middleware/`
- 中间件
- 认证
- 日志
- 错误处理

#### `models/`
- 数据模型
- 数据库实体
- 类型定义

#### `routes/`
- 路由定义
- API 端点
- 路由中间件

#### `services/`
- 业务逻辑
- 数据处理
- 外部服务集成

#### `types/`
- TypeScript 类型定义
- 接口定义
- 枚举类型

#### `utils/`
- 工具函数
- 辅助方法
- 常量定义

## 配置文件说明

### `.env.example`
- 环境变量示例
- 包含所有必要的配置项
- 用于指导开发者设置本地环境

### `.eslintrc.js`
- ESLint 配置
- 代码规范规则
- 插件配置

### `.prettierrc`
- Prettier 配置
- 代码格式化规则
- 编辑器集成

### `package.json`
- 项目依赖
- 脚本命令
- 项目信息

### `pnpm-workspace.yaml`
- pnpm 工作空间配置
- 包管理设置
- 依赖共享配置

## 开发规范

1. **文件命名**
   - 组件：PascalCase
   - 工具函数：camelCase
   - 类型定义：PascalCase
   - 样式文件：kebab-case

2. **目录结构**
   - 按功能模块组织
   - 保持结构清晰
   - 避免过深嵌套

3. **代码组织**
   - 相关代码放在一起
   - 保持文件大小适中
   - 遵循单一职责原则

4. **文档要求**
   - 每个模块都有 README
   - 复杂逻辑添加注释
   - 保持文档及时更新 