# Atom Video

[![License](https://img.shields.io/github/license/FightingTrip/atom-video)](https://github.com/FightingTrip/atom-video/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D8.0.0-orange)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.3.4-green)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14.0-blue)](https://www.postgresql.org/)

一个现代化的视频分享平台，采用 Monorepo 架构，使用 Vue 3 + TypeScript + Express 构建。

## ✨ 特性

- 🎥 视频上传与播放
- 🔐 用户认证与授权
- 💬 实时评论系统
- ❤️ 点赞与收藏
- 👥 用户关注系统
- 📱 响应式设计
- 🌐 国际化支持
- 📊 数据统计与分析

## 📋 目录

- [Atom Video](#atom-video)
  - [✨ 特性](#-特性)
  - [📋 目录](#-目录)
  - [🚀 快速开始](#-快速开始)
    - [环境要求](#环境要求)
    - [安装](#安装)
    - [开发](#开发)
    - [构建](#构建)
  - [🏗️ 项目结构](#️-项目结构)
  - [🛠️ 技术栈](#️-技术栈)
    - [前端](#前端)
    - [后端](#后端)
  - [📚 开发指南](#-开发指南)
    - [代码规范](#代码规范)
    - [测试](#测试)
    - [Git 提交规范](#git-提交规范)
  - [🚢 部署指南](#-部署指南)
  - [📖 API 文档](#-api-文档)
  - [🤝 贡献指南](#-贡献指南)
  - [📄 许可证](#-许可证)
  - [📞 联系方式](#-联系方式)
  - [🙏 致谢](#-致谢)

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14.0
- Redis >= 6.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/FightingTrip/atom-video.git
cd atom-video

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量

# 初始化数据库
cd backend
pnpm prisma migrate dev
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 仅启动前端
pnpm dev:frontend

# 仅启动后端
pnpm dev:backend
```

### 构建

```bash
# 构建所有项目
pnpm build

# 构建前端
pnpm build:frontend

# 构建后端
pnpm build:backend
```

## 🏗️ 项目结构

```
atom-video/
├── frontend/          # 前端项目
│   ├── src/          # 源代码
│   │   ├── api/     # API 接口
│   │   ├── assets/  # 静态资源
│   │   ├── components/ # 组件
│   │   ├── composables/ # 组合式函数
│   │   ├── router/  # 路由配置
│   │   ├── store/   # 状态管理
│   │   ├── styles/  # 样式文件
│   │   ├── types/   # 类型定义
│   │   └── utils/   # 工具函数
│   ├── public/      # 公共资源
│   └── tests/       # 测试文件
├── backend/         # 后端项目
│   ├── src/        # 源代码
│   │   ├── controllers/ # 控制器
│   │   ├── middleware/  # 中间件
│   │   ├── models/     # 数据模型
│   │   ├── routes/     # 路由
│   │   ├── services/   # 服务
│   │   ├── utils/      # 工具函数
│   │   └── validators/ # 验证器
│   ├── prisma/     # 数据库模型
│   └── tests/      # 测试文件
├── docs/           # 项目文档
│   ├── api/        # API 文档
│   ├── deployment/ # 部署文档
│   └── development/# 开发文档
└── scripts/        # 脚本文件
```

## 🛠️ 技术栈

### 前端

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - 类型安全的 JavaScript 超集
- Vite - 下一代前端构建工具
- Pinia - Vue 的状态管理库
- Vue Router - Vue 的路由管理器
- Tailwind CSS - 实用优先的 CSS 框架
- Vitest - 测试框架
- Vue Test Utils - Vue 组件测试工具

### 后端

- Node.js - JavaScript 运行时
- Express - Web 应用框架
- TypeScript - 类型安全的 JavaScript 超集
- Prisma - 下一代 ORM
- PostgreSQL - 关系型数据库
- Redis - 内存数据库
- Jest - JavaScript 测试框架
- Supertest - HTTP 测试库

## 📚 开发指南

### 代码规范

本项目使用 ESLint 和 Prettier 进行代码规范检查和格式化：

```bash
# 运行代码检查
pnpm lint

# 格式化代码
pnpm format
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行前端测试
pnpm test:frontend

# 运行后端测试
pnpm test:backend

# 查看测试覆盖率
pnpm test:coverage
```

### Git 提交规范

本项目使用 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 🚢 部署指南

详细的部署说明请参考 [部署文档](docs/deployment/README.md)。

## 📖 API 文档

详细的 API 文档请参考 [API 文档](docs/api/README.md)。

## 🤝 贡献指南

我们欢迎任何形式的贡献！请查看我们的 [贡献指南](CONTRIBUTING.md) 了解更多信息。

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'feat: Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目负责人：张宇翔
- 邮箱：zjtdzyx@163.com
- GitHub：[FightingTrip](https://github.com/FightingTrip)

## 🙏 致谢

感谢所有为这个项目做出贡献的人！
