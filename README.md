# Atom Video

一个基于 Web 的开发者教育视频 CMS 系统，旨在为开发者提供一个学习、分享与交流技术视频的平台。

## 项目结构

```
atom-video/
├── frontend/        # 前端代码 (Vue 3 + Vite)
├── backend/         # 后端代码 (Express + TypeScript)
└── docs/           # 项目文档
```

## 技术栈

### 前端
- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Naive UI

### 后端
- Express.js
- TypeScript
- PostgreSQL
- Prisma
- JWT 认证

## 开发环境设置

### 后端
1. 进入后端目录
```bash
cd backend
```

2. 安装依赖
```bash
pnpm install
```

3. 设置环境变量
```bash
cp .env.example .env
```
然后编辑 .env 文件，设置必要的环境变量。

4. 运行数据库迁移
```bash
pnpm prisma migrate dev
```

5. 启动开发服务器
```bash
pnpm dev
```

### 前端（待实现）
1. 进入前端目录
```bash
cd frontend
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

## API 文档

API 文档位于 `docs/api` 目录下。

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

[MIT](LICENSE) 