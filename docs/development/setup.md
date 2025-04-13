# 环境搭建指南

本文档提供了 Atom Video 项目的完整环境搭建指南，包括开发环境要求、安装步骤和常见问题解决方案。

## 1. 系统要求

### 1.1 必需软件

| 软件      | 最低版本  | 推荐版本  | 说明                           |
|-----------|----------|-----------|-------------------------------|
| Node.js   | 18.0.0   | 20.0.0+   | JavaScript 运行环境           |
| pnpm      | 8.0.0    | 8.15.0+   | 包管理器，支持 Monorepo       |
| Git       | 2.20.0   | 2.30.0+   | 版本控制系统                  |
| PostgreSQL| 14.0.0   | 15.0.0+   | 关系型数据库                  |
| Redis     | 6.0.0    | 7.0.0+    | 缓存和消息队列                |

### 1.2 推荐开发工具

- **Visual Studio Code**：推荐的代码编辑器
  - 推荐插件：ESLint, Prettier, Vue Language Features, Prisma
- **Postman** 或 **Insomnia**：API 测试工具
- **DBeaver** 或 **pgAdmin**：数据库管理工具

## 2. 项目配置

### 2.1 克隆项目

```bash
git clone https://github.com/your-username/atom-video.git
cd atom-video
```

### 2.2 安装依赖

在 Monorepo 项目中，使用 pnpm 安装所有工作区的依赖：

```bash
pnpm install
```

这将安装根目录和所有子包（frontend、backend、packages）的依赖项。

### 2.3 环境变量配置

#### 前端配置

1. 进入前端目录：`cd frontend`
2. 复制示例环境配置：`cp .env.example .env.local`
3. 根据需要编辑 `.env.local` 文件

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_TITLE=Atom Video
```

#### 后端配置

1. 进入后端目录：`cd backend`
2. 复制示例环境配置：`cp .env.example .env`
3. 根据需要编辑 `.env` 文件

```
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DATABASE_URL=postgresql://postgres:password@localhost:5432/atom_video

# Redis配置
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 2.4 数据库设置

#### 创建PostgreSQL数据库

```bash
psql -U postgres
CREATE DATABASE atom_video;
\q
```

#### 初始化Prisma

```bash
cd backend
pnpm prisma migrate dev --name init
```

这将创建数据库表结构并生成Prisma客户端。

#### 导入初始数据（可选）

```bash
pnpm prisma db seed
```

## 3. 运行项目

### 3.1 开发模式

#### 运行所有服务（前端+后端）

```bash
# 在项目根目录执行
pnpm dev
```

#### 分别运行服务

```bash
# 运行前端
pnpm dev:frontend

# 运行后端
pnpm dev:backend
```

### 3.2 前端开发

前端服务将在 http://localhost:4000 运行，主要技术栈：
- Vue 3 + TypeScript
- Pinia 状态管理
- Vue Router
- TailwindCSS

### 3.3 后端开发

后端服务将在 http://localhost:3000 运行，主要技术栈：
- NestJS
- TypeScript
- Prisma ORM
- Passport JWT

#### NestJS CLI

安装NestJS CLI可以帮助快速生成模块、控制器、服务等：

```bash
pnpm add -g @nestjs/cli

# 生成新模块
nest g module modules/new-module

# 生成控制器
nest g controller modules/new-module

# 生成服务
nest g service modules/new-module
```

## 4. 常见问题

### 4.1 依赖安装问题

如果遇到依赖安装错误，尝试以下步骤：

```bash
# 清除依赖缓存
pnpm store prune

# 重新安装
pnpm install --force
```

### 4.2 Prisma问题

如果遇到Prisma相关错误，尝试：

```bash
# 重新生成Prisma客户端
pnpm prisma generate

# 或重置数据库
pnpm prisma migrate reset
```

### 4.3 端口冲突

如果端口被占用，可以修改环境变量中的端口号：
- 前端：修改`vite.config.ts`中的端口
- 后端：修改`.env`文件中的PORT变量 