# Atom Video

Atom Video 是一个现代化的视频分享平台，采用 Monorepo 架构设计，提供高质量的视频内容服务。本项目旨在创建一个流畅、易用且功能丰富的视频平台，为用户提供优质的视频观看和分享体验。

## 项目概述

Atom Video 平台包含以下核心功能：

- 视频上传与观看
- 用户认证与个人资料管理
- 视频分类与标签系统
- 评论与互动功能
- 内容推荐系统
- 用户订阅与通知

## 技术栈

### 前端技术
- Vue 3
- TypeScript
- Pinia (状态管理)
- Vue Router
- Tailwind CSS
- Vite (构建工具)

### 后端技术
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- JWT 认证

### 开发工具
- pnpm (包管理器)
- ESLint + Prettier (代码规范)
- Jest/Vitest (测试框架)
- GitHub Actions (CI/CD)
- Docker (容器化)

## Monorepo 架构

项目采用 Monorepo 架构，使用 pnpm workspaces + Lerna 组合管理多个相关包：

```
atom-video/
├── frontend/           # 前端应用
├── backend/            # 后端应用
├── Atom-Stats/         # 代码统计分析工具
├── packages/           # 共享包
│   ├── eslint-config/  # ESLint配置
│   ├── shared-types/   # 共享类型定义
│   ├── tsconfig/       # TypeScript配置
│   └── ui/             # UI组件库
└── docs/               # 项目文档
```

### Monorepo 技术实现

我们采用 **pnpm workspaces + Lerna** 的组合方案来实现 Monorepo 架构：

- **pnpm workspaces**: 提供高效的依赖管理
  - 使用硬链接和符号链接优化存储空间
  - 通过 `pnpm-workspace.yaml` 定义工作区
  - 提供 `--filter` 等命令用于工作区操作

- **Lerna**: 提供高级的多包管理功能
  - 版本管理与发布自动化
  - 基于 Git 的变更检测
  - 支持依赖关系的拓扑排序
  - 提供 `lerna run/exec/watch` 等命令

这种组合充分发挥了 pnpm 在依赖管理方面的优势和 Lerna 在版本控制方面的强大功能。

### Monorepo 相关文档

我们提供了详细的Monorepo相关文档，帮助开发者理解架构和快速上手：

- [Monorepo开发指南](../monorepo-guide.md) - 日常开发流程和实用命令
- [Monorepo最佳实践](./technical/monorepo-best-practices.md) - 架构设计和最佳实践

### Monorepo 的优势

- **代码共享**：前端和后端可以共享类型定义、工具函数和配置
- **统一版本控制**：所有相关项目在同一仓库中管理，便于跟踪变更
- **原子提交**：关联变更可以一次性提交，保持一致性
- **简化协作**：团队成员可以更容易地理解和贡献整个项目
- **统一构建流程**：可以实现统一的构建、测试和部署流程
- **高效依赖管理**：使用pnpm的硬链接和符号链接优化依赖安装
- **智能发布**：通过Lerna实现只发布已更改的包
- **自动化版本管理**：基于conventional commits自动生成版本和变更日志

### 工作区详情

- **frontend**：Vue 3 前端应用
- **backend**：Express 后端服务
- **Atom-Stats**：代码统计分析工具
- **packages/shared-types**：TypeScript 类型定义共享包
- **packages/eslint-config**：共享的 ESLint 配置
- **packages/tsconfig**：共享的 TypeScript 配置
- **packages/ui**：共享UI组件库

## 快速开始

### 环境要求

- Node.js v18.0.0+
- pnpm v8.0.0+
- PostgreSQL v14.0.0+
- Redis v6.0.0+

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/your-username/atom-video.git
cd atom-video
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

```bash
# 前端环境变量
cd frontend
cp .env.example .env.local

# 后端环境变量
cd ../backend
cp .env.example .env
```

4. 启动开发服务器

```bash
# 启动所有服务
pnpm dev

# 或分别启动
pnpm dev:frontend
pnpm dev:backend
```

## 项目文档

本文档包含 Atom Video 项目的详细技术文档和开发指南。

## 目录结构

```
docs/
├── api/                    # API 文档
│   ├── README.md          # API 文档概述
│   ├── auth.md            # 认证相关 API
│   ├── user.md            # 用户相关 API
│   ├── video.md           # 视频相关 API
│   ├── comment.md         # 评论相关 API
│   └── interaction.md     # 互动相关 API
│
├── deployment/            # 部署相关文档
│   ├── README.md         # 部署概述
│   ├── frontend.md       # 前端部署指南
│   ├── backend.md        # 后端部署指南
│   └── docker.md         # Docker 部署指南
│
├── development/          # 开发相关文档
│   ├── README.md        # 开发概述
│   ├── setup.md         # 环境搭建指南
│   ├── git-workflow.md  # Git 工作流程
│   ├── coding-standards.md # 编码规范
│   ├── testing.md       # 测试指南
│   └── contributing.md  # 贡献指南
│
├── technical/           # 技术架构文档
│   ├── README.md       # 技术架构概述
│   ├── frontend-architecture.md # 前端架构
│   ├── backend-architecture.md # 后端架构
│   ├── database.md     # 数据库设计
│   └── security.md     # 安全架构
│
└── user/              # 用户文档
    ├── README.md     # 用户文档概述
    ├── guide.md      # 用户指南
    └── faq.md        # 常见问题
```

## 文档说明

### API 文档
- 详细描述了所有 API 端点的使用方法
- 包含请求/响应示例
- 包含错误码说明
- 包含认证要求

### 部署文档
- 包含各种环境下的部署指南
- 包含 Docker 部署说明
- 包含 CI/CD 配置说明
- 包含监控和日志配置

### 开发文档
- 包含环境搭建指南
- 包含 Git 工作流程说明
- 包含编码规范
- 包含测试指南
- 包含贡献指南

### 技术架构文档
- 包含前端架构说明
- 包含后端架构说明
- 包含数据库设计
- 包含安全架构说明

### 用户文档
- 包含用户使用指南
- 包含常见问题解答
- 包含功能说明

## 文档更新说明

本文档会随着项目的发展持续更新。主要更新内容包括：

1. 新增功能说明
2. API 变更说明
3. 架构调整说明
4. 部署流程更新
5. 开发规范更新

## 贡献文档

如果您发现文档中的任何问题或需要补充的内容，欢迎提交 Pull Request。请确保：

1. 遵循现有的文档格式
2. 使用 Markdown 语法
3. 保持文档结构清晰
4. 提供必要的示例和说明

## 文档维护

文档维护由项目核心团队负责，主要职责包括：

1. 定期检查文档准确性
2. 更新过时的内容
3. 补充新的功能说明
4. 优化文档结构
5. 处理文档相关的 Issue

## 联系方式

如有任何文档相关的问题，请通过以下方式联系：

- GitHub Issues: https://github.com/FightingTrip/atom-video/issues
- 项目维护者: @FightingTrip

## 许可证

本项目采用 [MIT 许可证](../LICENSE)。 