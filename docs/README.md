# Atom Video 项目文档

本文档包含 Atom Video 项目的技术文档和开发指南。

## 项目概述

Atom Video 是一个面向开发者的视频技术分享平台，采用 Monorepo 架构设计，提供以下核心功能：

- 视频上传与观看
- 用户认证与个人资料管理
- 标签与分类系统
- 评论与互动功能
- 内容创作与管理

## 技术栈

### 前端技术
- Vue 3 + TypeScript
- Pinia (状态管理)
- Vue Router
- Tailwind CSS
- Vite (构建工具)

### 后端技术
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Passport JWT

## Monorepo 架构

项目采用 Monorepo 架构，使用 pnpm workspaces 管理多个相关包：

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

## 文档目录

- **api/** - API端点文档
- **development/** - 开发指南和流程
- **technical/** - 技术架构文档
- **deployment/** - 部署文档

## 快速链接

- [环境搭建指南](./development/setup.md)
- [API文档](./api/README.md)
- [架构文档](./technical/architecture.md)
- [后端框架迁移](./development/roadmap.md)
- [Monorepo使用指南](./monorepo-guide.md)

## 文档贡献

如果您发现文档中的任何问题或需要补充的内容，欢迎提交 Pull Request。请确保：

1. 遵循现有的文档格式
2. 使用 Markdown 语法
3. 保持文档结构清晰

## 联系方式

- **项目维护者**: [@zjtdzyx](https://github.com/zjtdzyx)
- **技术支持**: yuxiangzhang040727@gmail.com
- **问题反馈**: [Issues](https://github.com/FightingTrip/atom-video/issues) 