# Atom Video

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-8.15.4-orange.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](package.json)
[![Vue](https://img.shields.io/badge/Vue-3.4.15-4FC08D.svg)](frontend/package.json)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg)](backend/package.json)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791.svg)](backend/package.json)

一个面向开发者的视频技术分享与学习平台，采用 Monorepo 架构，使用 Vue 3、TypeScript 和 Express 构建。

## 项目开发进度

### 已完成功能

- [x] **核心布局**
  - [x] 响应式侧边栏（可折叠）
  - [x] 顶部导航栏
  - [x] 页脚组件
  - [x] 暗色/亮色主题切换

- [x] **主页功能**
  - [x] 视频卡片列表
  - [x] 标签分类系统
  - [x] 无限滚动加载
  - [x] 视频推荐算法（基础版）

- [x] **用户认证系统**
  - [x] 登录表单与验证
  - [x] 注册功能
  - [x] 社交账号登录（Google, GitHub）
  - [x] 忘记密码/重置密码
  - [x] 记住我功能
  - [x] 基于JWT的认证（前端部分）

- [x] **国际化支持**
  - [x] 中文/英文切换
  - [x] 自动检测浏览器语言
  - [x] 用户语言偏好保存

- [x] **视频播放系统**
  - [x] 视频播放器组件
  - [x] 多清晰度切换
  - [x] 弹幕系统
  - [x] 快捷键控制
  - [x] 自适应布局
  - [x] 主题适配

- [x] **用户个人中心**
  - [x] 用户资料展示
  - [x] 用户上传的视频列表
  - [x] 关注/取消关注功能
  - [x] 无限滚动加载
  - [x] 头像上传功能

- [x] **后端模块化重构**
  - [x] 认证模块 (auth)
  - [x] 用户模块 (user)
  - [x] 视频模块 (video)
  - [x] 标签模块 (tag)
  - [x] 搜索模块 (search)
  - [x] 评论模块 (comment)
  - [x] 收藏模块 (favorite)
  - [x] 订阅模块 (subscription)
  - [x] 互动模块 (interaction)
  - [x] 通用模块 (common)

### 进行中功能

- [ ] **视频互动系统**
  - [x] 评论功能
  - [x] 点赞功能
  - [x] 收藏功能
  - [ ] 分享功能

- [ ] **用户设置**
  - [x] 个人资料编辑
  - [x] 账号安全设置
  - [ ] 通知设置
  - [ ] 隐私设置

- [ ] **后端API开发**
  - [x] 用户认证API
  - [x] 视频管理API
  - [x] 评论系统API
  - [x] 用户互动API

- [ ] **后端框架迁移**
  - [x] 项目结构设计
  - [x] Express迁移到NestJS
  - [x] 认证模块重构
  - [ ] Prisma数据模型完善
  - [ ] API端点重新实现
  - [ ] 测试用例编写

## 技术栈

### 前端
- Vue 3.4.15
- TypeScript 5.3.3
- Pinia (状态管理)
- Vue Router
- Tailwind CSS
- Vite

### 后端
- Express.js / NestJS
- TypeScript 5.3.3
- PostgreSQL
- Prisma ORM
- Redis
- JWT 认证

### 开发工具
- pnpm 8.15.4
- ESLint + Prettier
- Jest/Vitest
- GitHub Actions
- Docker

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

## 快速开始

### 环境要求

- Node.js v18.0.0+
- pnpm v8.15.4+
- PostgreSQL v14.0.0+
- Redis v6.0.0+

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
- [测试账号指南](./docs/development/test-accounts.md)
- [Git 工作流程](./docs/development/git-workflow.md)
- [编码规范](./docs/development/coding-standards.md)
- [API 文档](./docs/api/README.md)
- [前端架构](./docs/technical/frontend-architecture.md)
- [后端架构](./docs/technical/backend-architecture.md)
- [测试指南](./docs/development/testing.md)
- [部署指南](./docs/deployment/README.md)

## 贡献指南

我们欢迎所有形式的贡献，无论是新功能、bug修复还是文档改进。请查看[贡献指南](./docs/development/contributing.md)了解更多详情。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
