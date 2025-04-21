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

## 技术栈

### 前端
- Vue 3.4.15
- TypeScript 5.3.3
- Pinia (状态管理)
- Vue Router
- Tailwind CSS
- Vite

### 后端
- Express.js
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

# Atom Video 优化功能

本次更新为Atom Video视频平台添加了多项现代化功能和性能优化，提升用户体验和交互性能。

## 视频播放器优化

### 1. 画中画模式 (PIP)
- 在视频播放时可切换到画中画模式，支持在浏览其他内容的同时继续观看视频
- 通过顶部控制栏中的专用按钮访问

### 2. 手势控制
- 支持触摸设备上的手势控制：
  - 水平滑动调整视频进度
  - 垂直滑动调整音量
  - 双击切换播放/暂停

### 3. 视频截图功能
- 用户可以随时截取视频当前帧并下载图片
- 保存的截图可用于分享或归档

### 4. 视频章节支持
- 显示视频的章节列表，便于快速导航到特定内容部分
- 章节进度可视化显示
- 支持折叠/展开章节列表

## 用户体验增强

### 1. 自动播放下一个视频
- 视频结束后自动播放推荐视频或播放队列中的下一个视频
- 带有倒计时和预览的过渡界面
- 用户可随时取消或跳过倒计时

### 2. 视频播放队列
- 允许用户创建自定义播放队列
- 支持从推荐视频中快速添加到队列
- 提供保存播放队列为永久播放列表的功能

### 3. 视频质量自动调节
- 根据网络状况自动选择最佳视频质量
- 智能带宽检测和质量调整
- 用户可手动选择特定质量或使用自动模式

## 社交功能扩展

### 1. 时间戳评论
- 在评论中插入当前播放时间的时间戳
- 其他用户可点击时间戳跳转到视频的特定时间点
- 支持在评论中@提及其他用户

### 2. 视频片段分享
- 选择视频的特定片段进行分享
- 自定义片段的开始和结束时间
- 生成带有时间参数的分享链接

### 3. 更丰富的分享选项
- 支持多种社交平台的分享
- 可设置分享时的起始时间点
- 提供链接复制和二维码分享功能

## 性能优化

### 1. 视频预加载
- 自动预加载下一个可能观看的视频
- 根据网络状况和用户设置调整预加载策略
- 显示预加载进度指示

### 2. 自适应流媒体
- 根据设备和网络条件提供最佳视频质量
- 无缝切换不同质量级别的视频流
- 带宽监测和反馈系统

### 3. 响应式优化
- 针对移动设备优化的触控界面
- 改进的控件尺寸和交互区域
- 自适应布局适配不同屏幕尺寸

## 安装说明

所有优化功能已集成到现有代码库中，无需额外安装步骤。

## 使用方法

### 画中画模式
点击视频播放器顶部控制栏中的"画中画"按钮启用画中画模式。

### 手势控制
- 在视频上水平滑动可调整进度
- 垂直滑动可调整音量
- 双击视频可切换播放/暂停状态

### 视频章节
在视频播放器下方的章节面板中，点击章节标题可跳转到对应时间点。

### 视频播放队列
1. 在推荐视频上点击"+"按钮将视频添加到队列
2. 点击"播放队列"按钮查看和管理当前队列
3. 可以保存队列为播放列表供将来使用

### 视频片段分享
1. 点击"分享"按钮
2. 选择"分享视频片段"
3. 设置片段的开始和结束时间
4. 点击"分享片段"生成链接

## 实现技术

- Vue 3 组合式API
- HTML5 视频API
- Naive UI组件库
- 本地存储与会话管理
- 自适应流媒体技术
- 触摸事件处理
- Canvas API (用于截图功能)

## 兼容性

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 移动设备 (iOS 12+, Android 8+)
- 触摸屏和非触摸屏设备

## 注意事项

- 部分功能(如画中画模式)在某些浏览器中可能不可用
- 视频预加载功能会增加数据使用量，在移动网络下可能会受到限制
- 自动播放功能受浏览器自动播放策略影响，可能需要用户交互后才能启用
