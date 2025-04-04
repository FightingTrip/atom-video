# Atom Video

Atom Video 是一个现代化的视频分享平台，采用前后端分离架构，提供流畅的视频上传、播放和社交互动体验。

## 技术栈

### 前端
- Vue 3 + TypeScript
- Tailwind CSS
- Pinia (状态管理)
- Vue Router
- Axios (HTTP 客户端)

### 后端
- Express.js
- Prisma (ORM)
- PostgreSQL
- JWT (认证)
- Redis (缓存)

## 主要功能

### 已实现功能 (2025年4月)
- ✅ 用户认证系统（注册、登录、密码重置）
- ✅ 视频上传（支持拖拽、进度显示）
- ✅ 视频播放器（支持字幕、画中画）
- ✅ 互动功能（点赞、收藏、评论）
- ✅ 用户管理（个人资料、角色权限）
- ✅ 安全特性（速率限制、数据压缩）
- ✅ 视频处理（转码、封面生成）
- ✅ 内容管理（分类、标签）
- ✅ 搜索系统（全文搜索、推荐）

### 开发中功能
- 🚧 社交功能（关注、私信）
- 🚧 通知系统
- 🚧 直播功能
- 🚧 移动端优化
- 🚧 API 开放平台

### 计划功能
- 📅 数据分析面板
- 📅 广告系统
- 📅 国际化支持
- 📅 视频会议
- 📅 协作编辑

## 项目结构

```
atom-video/
├── frontend/           # Vue 3 前端项目
│   ├── src/
│   │   ├── components/ # 可复用组件
│   │   ├── views/      # 页面组件
│   │   ├── stores/     # Pinia 状态管理
│   │   ├── router/     # 路由配置
│   │   └── utils/      # 工具函数
│   └── public/         # 静态资源
│
├── backend/            # Express.js 后端项目
│   ├── src/
│   │   ├── config/     # 配置文件
│   │   ├── controllers/# 控制器
│   │   ├── middleware/ # 中间件
│   │   ├── routes/     # 路由
│   │   ├── services/   # 服务层
│   │   ├── types/      # 类型定义
│   │   └── utils/      # 工具函数
│   └── prisma/         # Prisma 配置
│
└── docs/              # 项目文档
    ├── api/           # API 文档
    ├── development/   # 开发指南
    ├── technical/     # 技术文档
    └── deployment/    # 部署文档
```

## 快速开始

### 环境要求
- Node.js >= 18
- PostgreSQL >= 15
- Redis >= 7
- FFmpeg >= 6

### 安装依赖
```bash
# 安装前端依赖
cd frontend
pnpm install

# 安装后端依赖
cd ../backend
pnpm install
```

### 配置环境变量
```bash
# 复制环境变量示例文件
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 编辑环境变量文件
# 配置数据库连接、JWT密钥等
```

### 启动开发服务器
```bash
# 启动后端服务
cd backend
pnpm dev

# 启动前端服务
cd frontend
pnpm dev
```

## 文档

- [API 文档](docs/api/README.md)
- [开发指南](docs/development/README.md)
- [技术文档](docs/technical/README.md)
- [部署文档](docs/deployment/README.md)

## 贡献指南

欢迎提交 Pull Request 或创建 Issue。请确保遵循以下规范：

1. 遵循项目的代码风格
2. 添加必要的测试
3. 更新相关文档
4. 提交清晰的提交信息

## 联系方式

- 项目负责人：[@zjtdzyx](https://github.com/zjtdzyx)
- 技术支持：yuxiangzhang040727@gmail.com
- 问题反馈：[Issues](https://github.com/zjtdzyx/atom-video/issues)

## 许可证

MIT License 