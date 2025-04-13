# Atom Video

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-8.15.4-orange.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](package.json)
[![Vue](https://img.shields.io/badge/Vue-3.4.15-4FC08D.svg)](frontend/package.json)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](backend/package.json)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791.svg)](backend/package.json)

一个面向开发者的视频技术分享与学习平台，采用 Monorepo 架构，使用 Vue 3、TypeScript 和 NestJS 构建。

## 主要功能

- 视频分享与观看
- 用户认证与个人中心
- 创作者工作台
- 视频互动系统（评论、点赞、收藏）
- 标签与分类系统
- 国际化支持（中/英文）
- 暗色/亮色主题切换

## 技术栈

### 前端
- Vue 3
- TypeScript
- Pinia (状态管理)
- Vue Router
- Tailwind CSS
- Vite

### 后端
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT 认证

### 开发工具
- pnpm (包管理器)
- ESLint + Prettier
- Jest/Vitest
- GitHub Actions

## 快速开始

### 环境要求

- Node.js v18.0.0+
- pnpm v8.15.4+
- PostgreSQL v14.0.0+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/FightingTrip/atom-video.git
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

详细文档请参考 [docs](./docs) 目录：

- [环境搭建指南](./docs/development/setup.md)
- [API 文档](./docs/api/README.md)
- [架构文档](./docs/technical/architecture.md)
- [贡献指南](./docs/development/contributing.md)

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 维护者

- **项目负责人**: [@zjtdzyx](https://github.com/zjtdzyx)
- **联系邮箱**: yuxiangzhang040727@gmail.com
- **项目仓库**: [FightingTrip/atom-video](https://github.com/FightingTrip/atom-video)
