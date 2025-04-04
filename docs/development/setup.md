# 环境搭建

## 系统要求

- Node.js 20.x LTS
- pnpm 8.x
- Git 2.x
- PostgreSQL 15.x
- Redis 7.x

## 开发环境配置

### 1. 安装 Node.js

#### Windows
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装 LTS 版本
3. 验证安装：
```bash
node --version
npm --version
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install node@20

# 添加到 PATH
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### 2. 安装 pnpm

```bash
# 使用 npm 安装
npm install -g pnpm@8

# 验证安装
pnpm --version
```

### 3. 安装 Git

#### Windows
1. 访问 [Git 官网](https://git-scm.com/)
2. 下载并安装
3. 验证安装：
```bash
git --version
```

#### macOS
```bash
brew install git
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

### 4. 安装 PostgreSQL

#### Windows
1. 访问 [PostgreSQL 官网](https://www.postgresql.org/download/windows/)
2. 下载并安装
3. 设置环境变量

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-15

# CentOS/RHEL
sudo yum install postgresql15-server
sudo postgresql-15-setup initdb
sudo systemctl enable postgresql-15
sudo systemctl start postgresql-15
```

### 5. 安装 Redis

#### Windows
1. 使用 WSL2 安装 Ubuntu
2. 在 Ubuntu 中安装 Redis

#### macOS
```bash
brew install redis
brew services start redis
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# CentOS/RHEL
sudo yum install redis
sudo systemctl enable redis
sudo systemctl start redis
```

## 项目设置

### 1. 克隆项目

```bash
git clone https://github.com/your-org/atom-video.git
cd atom-video
```

### 2. 安装依赖

```bash
# 安装所有依赖
pnpm install

# 安装前端依赖
cd packages/frontend
pnpm install

# 安装后端依赖
cd ../backend
pnpm install
```

### 3. 环境变量配置

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置必要的环境变量：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=atom_video

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=100mb

# 前端配置
VITE_API_BASE_URL=http://localhost:3000
```

### 4. 数据库初始化

```bash
# 创建数据库
createdb atom_video

# 运行迁移
cd packages/backend
pnpm migration:run
```

### 5. 启动开发服务器

```bash
# 启动前端开发服务器
cd packages/frontend
pnpm dev

# 启动后端开发服务器
cd ../backend
pnpm dev
```

## 开发工具推荐

### 编辑器
- [VS Code](https://code.visualstudio.com/)
- [WebStorm](https://www.jetbrains.com/webstorm/)

### VS Code 插件推荐
- ESLint
- Prettier
- Volar
- TypeScript Vue Plugin
- GitLens
- Docker
- PostgreSQL

### 浏览器插件
- Vue.js devtools
- Redux DevTools
- JSON Formatter

## 常见问题

### 1. 依赖安装失败
- 检查 Node.js 和 pnpm 版本
- 清除缓存后重试：
```bash
pnpm store prune
pnpm install
```

### 2. 数据库连接失败
- 检查 PostgreSQL 服务是否运行
- 验证数据库配置是否正确
- 检查防火墙设置

### 3. Redis 连接失败
- 检查 Redis 服务是否运行
- 验证 Redis 配置是否正确
- 检查防火墙设置

### 4. 端口冲突
- 检查是否有其他服务占用端口
- 修改配置文件中的端口号

## 获取帮助

- 查看项目文档
- 在 GitHub 上提交 Issue
- 联系项目维护者 