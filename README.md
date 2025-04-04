# Atom Video

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-8.x-orange.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](package.json)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](frontend/package.json)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg)](backend/package.json)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791.svg)](backend/package.json)
[![ESM](https://img.shields.io/badge/ESM-Enabled-4FC08D.svg)](package.json)

一个面向开发者的视频技术分享与学习平台，采用 Monorepo 架构，使用 Vue 3、TypeScript 和 Express 构建。

## 最新更新

- ✨ 完成基础路由配置
- 🎨 实现深色模式切换
- 🌐 添加国际化支持
- 🔧 修复路由加载问题
- 📦 优化项目结构

## 特性

- 🎥 技术视频分享与学习
- 👥 开发者社区与互动
- 🔍 智能标签与搜索
- 🌐 国际化支持
- 🎨 现代化 UI/UX
- ⚡ 高性能与可扩展性
- 🔒 安全认证与授权
- 📱 响应式设计
- 🌙 深色模式
- ♿ 无障碍支持
- 🔄 实时更新
- 📊 数据分析

## 目录

- [Atom Video](#atom-video)
  - [最新更新](#最新更新)
  - [特性](#特性)
  - [目录](#目录)
  - [快速开始](#快速开始)
    - [环境要求](#环境要求)
    - [安装](#安装)
    - [开发命令](#开发命令)
  - [注意事项](#注意事项)
  - [项目结构](#项目结构)
  - [技术栈](#技术栈)
    - [前端](#前端)
    - [后端](#后端)
    - [开发工具](#开发工具)
    - [模块系统](#模块系统)
  - [开发指南](#开发指南)
    - [代码规范](#代码规范)
    - [提交规范](#提交规范)
    - [分支管理](#分支管理)
  - [部署指南](#部署指南)
    - [环境要求](#环境要求-1)
    - [部署步骤](#部署步骤)
  - [API 文档](#api-文档)
  - [贡献指南](#贡献指南)
  - [许可证](#许可证)
  - [联系我们](#联系我们)
  - [致谢](#致谢)

## 快速开始

### 环境要求

- Node.js 20.x
- pnpm 8.x
- PostgreSQL 15.x（可选，目前使用 Mock 数据）

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/atom-video.git
cd atom-video

# 安装依赖
pnpm install

# 启动前端开发服务器（使用 Mock 数据）
pnpm dev:mock

# 或者启动完整开发环境
pnpm dev
```

### 开发命令

```bash
# 启动前端开发服务器（Mock 模式，在frontend目录下）
pnpm dev:mock

# 启动前端开发服务器
pnpm dev:frontend

# 启动后端开发服务器
pnpm dev:backend

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码格式化
pnpm format
```

## 注意事项

1. **Windows 用户注意**：
   - 请使用 PowerShell 作为默认终端
   - 项目使用 ESM 模块系统，确保 Node.js 版本 >= 20.x

2. **开发模式**：
   - 默认使用 Mock 数据模式，无需后端服务
   - 使用哈希路由模式，避免刷新 404 问题

3. **依赖安装**：
   - 使用 `pnpm` 作为包管理器
   - 如果遇到依赖问题，尝试删除 `node_modules` 后重新安装

## 项目结构

```
atom-dev-hub/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 组件
│   │   ├── composables/    # 组合式函数
│   │   ├── directives/     # 自定义指令
│   │   ├── locales/        # 国际化文件
│   │   ├── plugins/        # 插件
│   │   ├── router/         # 路由
│   │   ├── services/       # API 服务
│   │   ├── stores/         # 状态管理
│   │   ├── types/          # TypeScript 类型
│   │   ├── utils/          # 工具函数
│   │   └── views/          # 页面
│   └── ...
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── config/         # 配置
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 服务
│   │   ├── types/          # TypeScript 类型
│   │   └── utils/          # 工具函数
│   └── ...
└── ...
```

## 技术栈

### 前端

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - 类型安全的 JavaScript 超集
- Vite - 下一代前端构建工具
- Pinia - Vue 的状态管理库
- Vue Router - Vue.js 的官方路由
- Tailwind CSS - 实用优先的 CSS 框架
- Vue I18n - Vue.js 的国际化插件
- Axios - 基于 Promise 的 HTTP 客户端
- Jest - JavaScript 测试框架
- ESLint - 代码检查工具
- Prettier - 代码格式化工具

### 后端

- Node.js - JavaScript 运行时
- Express - Node.js Web 应用框架
- TypeScript - 类型安全的 JavaScript 超集
- PostgreSQL - 关系型数据库
- Prisma - 下一代 ORM
- JWT - JSON Web Token 认证
- Jest - JavaScript 测试框架
- ESLint - 代码检查工具
- Prettier - 代码格式化工具

### 开发工具

- pnpm - 快速、节省磁盘空间的包管理器
- Husky - Git hooks 工具
- lint-staged - 在 Git 暂存文件上运行 linters
- commitlint - 提交消息 lint 工具
- concurrently - 同时运行多个命令

### 模块系统

- ESM (ECMAScript Modules) - 现代 JavaScript 模块系统
  - 使用 `import/export` 语法
  - 支持静态分析
  - 更好的 Tree Shaking
  - 原生浏览器支持
  - 现代化的开发体验

## 开发指南

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 使用 Conventional Commits 规范
- 编写单元测试
- 保持代码简洁和可维护性

### 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 分支管理

- main: 主分支，用于生产环境
- develop: 开发分支，用于开发环境
- feature/*: 功能分支
- bugfix/*: 修复分支
- release/*: 发布分支

## 部署指南

### 环境要求

- Node.js 20.x
- pnpm 8.x
- PostgreSQL 15.x
- Nginx
- PM2

### 部署步骤

1. 克隆仓库
2. 安装依赖
3. 配置环境变量
4. 构建项目
5. 配置 Nginx
6. 启动服务

详细部署步骤请参考 [部署文档](docs/deployment.md)。

## API 文档

API 文档使用 Swagger 生成，可在开发环境中访问：
```
http://localhost:3000/api-docs
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

详细贡献指南请参考 [贡献文档](CONTRIBUTING.md)。

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

- 项目维护者：@zjtdzyx(https://github.com/zjtdzyx)
- 邮箱：yuxiangzhang0727@gmail.com
- 项目主页：https://github.com/zjtdzyx/atom-video

## 致谢

感谢所有为本项目做出贡献的开发者！
