# Atom Video

一个现代化的视频分享平台，采用 Monorepo 架构。

## 技术栈

### 前端
- Vue 3
- TypeScript
- Tailwind CSS
- Vite
- Pinia
- Vue Router

### 后端
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

## 项目结构

```
atom-video/
├── frontend/          # 前端项目
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── ...
├── backend/          # 后端项目
│   ├── src/         # 源代码
│   ├── prisma/      # 数据库模型
│   └── ...
├── docs/            # 项目文档
└── ...
```

## 开发指南

### 环境要求
- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14

### 安装
```bash
# 安装依赖
pnpm install
```

### 开发
```bash
# 启动前端和后端开发服务器
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

### 测试
```bash
# 运行所有测试
pnpm test

# 运行前端测试
pnpm test:frontend

# 运行后端测试
pnpm test:backend
```

### 代码规范

本项目使用 ESLint 和 Prettier 进行代码规范检查和格式化：

```bash
# 运行代码检查
pnpm lint

# 格式化代码
pnpm format
```

### Git 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## CI/CD

本项目使用 GitHub Actions 进行持续集成和部署：

- 代码检查
- 自动测试
- 自动构建
- 自动部署（待实现）

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'feat: Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
