# 环境搭建指南

本文档提供了 Atom Video 项目的完整环境搭建指南，包括开发环境要求、安装步骤和常见问题解决方案。

## 1. 系统要求

### 1.1 必需软件

| 软件      | 最低版本  | 推荐版本  | 说明                           |
|-----------|----------|-----------|-------------------------------|
| Node.js   | 18.0.0   | 20.0.0+   | JavaScript 运行环境           |
| pnpm      | 7.0.0    | 8.0.0+    | 包管理器，支持 Monorepo       |
| Git       | 2.20.0   | 2.30.0+   | 版本控制系统                  |
| PostgreSQL| 14.0.0   | 15.0.0+   | 关系型数据库                  |
| Redis     | 6.0.0    | 7.0.0+    | 缓存和消息队列                |
| FFmpeg    | 4.0.0    | 5.0.0+    | 视频处理工具（可选）           |

### 1.2 推荐开发工具

- **Visual Studio Code**：推荐的代码编辑器
- **Postman** 或 **Insomnia**：API 测试工具
- **DBeaver** 或 **pgAdmin**：数据库管理工具
- **Redis Desktop Manager**：Redis 可视化管理工具

## 2. 安装步骤

### 2.1 安装 Node.js

#### Windows
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装 LTS 版本
3. 在命令行中验证安装：`node -v` 和 `npm -v`

#### macOS
使用 Homebrew 安装：
```bash
brew install node
```

#### Linux
使用包管理器安装（Ubuntu/Debian）：
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.2 安装 pnpm

确保 Node.js 已正确安装后，执行以下命令安装 pnpm：

```bash
npm install -g pnpm
```

验证安装：
```bash
pnpm --version
```

### 2.3 安装 Git

#### Windows
1. 访问 [Git 官网](https://git-scm.com/)
2. 下载并安装 Git for Windows
3. 在命令行中验证安装：`git --version`

#### macOS
使用 Homebrew 安装：
```bash
brew install git
```

#### Linux
使用包管理器安装（Ubuntu/Debian）：
```bash
sudo apt-get update
sudo apt-get install git
```

### 2.4 安装 PostgreSQL

#### Windows
1. 访问 [PostgreSQL 下载页面](https://www.postgresql.org/download/windows/)
2. 下载并安装 PostgreSQL 安装包
3. 安装过程中设置管理员密码
4. 在命令行中验证安装：`psql --version`

#### macOS
使用 Homebrew 安装：
```bash
brew install postgresql
brew services start postgresql
```

#### Linux
使用包管理器安装（Ubuntu/Debian）：
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2.5 安装 Redis

#### Windows
1. 使用 Windows Subsystem for Linux (WSL) 或
2. 下载 [Redis for Windows](https://github.com/tporadowski/redis/releases)

#### macOS
使用 Homebrew 安装：
```bash
brew install redis
brew services start redis
```

#### Linux
使用包管理器安装（Ubuntu/Debian）：
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 2.6 安装 FFmpeg（可选，用于视频处理）

#### Windows
1. 访问 [FFmpeg 下载页面](https://ffmpeg.org/download.html)
2. 下载 Windows 构建版本
3. 解压并将 bin 目录添加到系统 PATH

#### macOS
使用 Homebrew 安装：
```bash
brew install ffmpeg
```

#### Linux
使用包管理器安装（Ubuntu/Debian）：
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

## 3. 项目配置

### 3.1 克隆项目

```bash
git clone https://github.com/your-username/atom-video.git
cd atom-video
```

### 3.2 安装依赖

在 Monorepo 项目中，使用 pnpm 安装所有工作区的依赖：

```bash
pnpm install
```

这将安装根目录和所有子包（frontend、backend、shared packages）的依赖项。

### 3.3 环境变量配置

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

# 文件存储配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100000000
```

### 3.4 数据库初始化

1. 确保 PostgreSQL 服务正在运行
2. 创建数据库：

```bash
# 连接到PostgreSQL
psql -U postgres

# 在PostgreSQL命令行中创建数据库
CREATE DATABASE atom_video;
\q
```

3. 执行数据库迁移：

```bash
cd backend
pnpm prisma migrate dev
```

这将创建表结构并应用所有迁移。

### 3.5 启动开发服务器

在项目根目录运行以下命令启动所有服务：

```bash
pnpm dev
```

或者分别启动前端和后端：

```bash
# 启动前端
pnpm dev:frontend

# 启动后端
pnpm dev:backend
```

## 4. 验证安装

成功启动后：

- 前端服务将运行在：http://localhost:5173
- 后端服务将运行在：http://localhost:3000
- API文档将可在以下地址访问：http://localhost:3000/api/docs

## 5. Monorepo 工作流程

### 5.1 包之间的依赖

如果需要在子包之间添加依赖，使用以下命令：

```bash
# 例如，让frontend依赖shared-types包
pnpm --filter frontend add @atom/shared-types@workspace
```

### 5.2 添加外部依赖

添加外部依赖到特定工作区：

```bash
# 添加依赖到前端
pnpm --filter frontend add lodash

# 添加开发依赖到后端
pnpm --filter backend add -D jest
```

添加全局开发依赖：

```bash
pnpm add -Dw typescript
```

### 5.3 共享包开发

修改共享包后，不需要手动构建或链接。工作区配置已经设置好引用关系，修改会自动反映到依赖项目中。

## 6. 常见问题

### 6.1 依赖安装问题

**问题**: `pnpm install` 失败

**解决方案**:
1. 删除 `node_modules` 目录和 `pnpm-lock.yaml` 文件
2. 确保 Node.js 版本兼容 (使用 `nvm` 切换版本)
3. 重新运行 `pnpm install`

### 6.2 数据库连接问题

**问题**: 无法连接到数据库

**解决方案**:
1. 确认 PostgreSQL 服务正在运行
2. 检查数据库用户名和密码是否正确
3. 确认数据库连接URL格式正确
4. 检查防火墙设置是否阻止连接

### 6.3 Redis 连接问题

**问题**: 无法连接到 Redis

**解决方案**:
1. 确认 Redis 服务正在运行
2. 检查 Redis 连接 URL 是否正确
3. 检查 Redis 默认端口 (6379) 是否开放

### 6.4 端口冲突

**问题**: 启动服务时端口被占用

**解决方案**:
1. 找出使用端口的进程：
   - Windows: `netstat -ano | findstr :PORT`
   - Linux/Mac: `lsof -i :PORT`
2. 终止进程或在配置文件中修改端口

### 6.5 Monorepo 依赖关系问题

**问题**: 工作区包之间的依赖不生效

**解决方案**:
1. 确保在 `package.json` 中正确设置了 `workspaces` 字段
2. 检查是否使用了 `@workspace` 标记引用本地包
3. 运行 `pnpm install` 重新建立依赖关系
4. 检查 `.npmrc` 配置，确保 `link-workspace-packages=true` 已设置

## 7. 开发工具配置

### 7.1 VSCode 推荐扩展

在项目根目录的 `.vscode/extensions.json` 中定义了推荐的 VSCode 扩展：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",          // ESLint
    "esbenp.prettier-vscode",          // Prettier
    "vue.volar",                       // Vue
    "prisma.prisma",                   // Prisma
    "bradlc.vscode-tailwindcss",       // Tailwind CSS
    "graphql.vscode-graphql",          // GraphQL
    "mikestead.dotenv",                // .env 文件支持
    "ms-azuretools.vscode-docker"      // Docker
  ]
}
```

### 7.2 编辑器配置

在项目根目录的 `.vscode/settings.json` 中配置了编辑器设置：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## 8. 提交前检查

提交代码前，确保运行以下命令检查代码质量：

```bash
# 运行所有包的代码检查
pnpm lint

# 运行所有包的测试
pnpm test

# 构建所有包
pnpm build
```

项目配置了提交钩子，会自动运行这些检查，只有全部通过才能提交代码。 