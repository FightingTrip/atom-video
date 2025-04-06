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

项目采用 Monorepo 架构，使用 pnpm workspaces + Lerna 管理多个相关包：

```
atom-video/
├── frontend/           # 前端应用
├── backend/            # 后端应用
├── packages/           # 共享包
│   ├── eslint-config/  # ESLint配置
│   ├── shared-types/   # 共享类型定义
│   └── tsconfig/       # TypeScript配置
└── docs/               # 项目文档
```

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

### 工作区详情

- **frontend**：Vue 3 前端应用
- **backend**：Express 后端服务
- **packages/shared-types**：TypeScript 类型定义共享包
- **packages/eslint-config**：共享的 ESLint 配置
- **packages/tsconfig**：共享的 TypeScript 配置

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

详细文档请参考以下链接：

- [环境搭建指南](./development/setup.md)
- [Git 工作流程](./development/git-workflow.md)
- [编码规范](./development/coding-standards.md)
- [API 文档](./api/README.md)
- [前端架构](./technical/frontend-architecture.md)
- [后端架构](./technical/backend-architecture.md)
- [测试指南](./development/testing.md)
- [部署指南](./deployment/README.md)

## 当前进度

### 已完成功能

- 用户注册与登录
- 视频上传与转码
- 视频播放器
- 个人资料管理
- 基础UI组件
- Monorepo架构搭建
- 用户互动功能(点赞、评论、收藏)

### 开发中功能

- 视频评论系统
- 用户订阅功能
- 内容推荐算法
- 通知系统

### 计划功能

- 实时聊天
- 视频编辑工具
- 移动端适配
- 高级搜索功能
- 数据分析面板

## 贡献指南

我们欢迎所有形式的贡献，无论是新功能、bug修复还是文档改进。请查看[贡献指南](./development/contributing.md)了解更多详情。

## 联系方式

- 项目负责人：[Your Name](mailto:your.email@example.com)
- 团队邮箱：team@atomvideo.com
- GitHub Issues：[issues](https://github.com/your-username/atom-video/issues)

## 许可证

本项目采用 [MIT 许可证](../LICENSE)。 