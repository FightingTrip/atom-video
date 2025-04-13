# Atom Video Monorepo 开发指南

本指南帮助开发者理解并有效使用Atom Video项目的Monorepo架构。

## 环境准备

确保系统已安装以下工具：
- Node.js v18+
- pnpm v8+
- Git

## 项目结构

```
atom-video/
├── frontend/            # Vue 3前端应用
│   ├── src/             # 前端源代码
│   └── package.json     # 前端包配置
├── backend/             # NestJS后端服务
│   ├── src/             # 后端源代码
│   └── package.json     # 后端包配置
├── packages/            # 共享包目录
│   ├── shared-types/    # 共享TypeScript类型
│   ├── eslint-config/   # 共享ESLint配置
│   └── tsconfig/        # 共享TypeScript配置
├── .npmrc               # pnpm配置
├── package.json         # 工作区根配置
└── pnpm-workspace.yaml  # 工作区定义
```

## 日常开发流程

### 启动开发环境

```bash
# 启动所有项目（前端+后端）
pnpm dev

# 只启动前端
pnpm dev:frontend

# 只启动后端
pnpm dev:backend
```

### 安装依赖

```bash
# 安装依赖到根目录（通常用于开发工具）
pnpm add -D eslint -w

# 安装依赖到特定包
pnpm add axios --filter frontend
pnpm add @nestjs/core --filter backend

# 安装工作区包作为依赖
pnpm add @atom/shared-types --filter frontend
```

## NestJS 开发

### NestJS CLI

在backend目录中使用NestJS CLI快速生成代码：

```bash
# 安装CLI
pnpm add -g @nestjs/cli

# 生成模块
cd backend
nest g module modules/example

# 生成控制器
nest g controller modules/example

# 生成服务
nest g service modules/example

# 生成守卫
nest g guard modules/auth/guards/example
```

### NestJS模块结构

标准模块结构如下：

```
modules/example/
├── dto/                # 数据传输对象
├── entities/           # 实体定义
├── example.module.ts   # 模块定义
├── example.controller.ts # 控制器
├── example.service.ts  # 服务
└── example.spec.ts     # 测试
```

## 代码质量检查

```bash
# 运行所有包的代码检查
pnpm lint

# 检查特定包的代码
pnpm lint:frontend
pnpm lint:backend

# 格式化所有代码
pnpm format
```

## 构建和测试

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm build:frontend
pnpm build:backend

# 运行测试
pnpm test
pnpm test:frontend
pnpm test:backend
```

## 清理项目

```bash
# 清理所有构建和缓存文件
pnpm clean

# 删除所有node_modules目录
pnpm clean:deps
```

## 注意事项

1. 不要删除root的pnpm-lock.yaml文件
2. 子包中不需要单独的lock文件
3. 保持.npmrc配置一致
4. 共享包修改后记得重新构建
5. `.pnpm-store`只应存在于项目根目录，子目录中不应有独立的store
6. 定期更新依赖并检查安全漏洞

## 相关资源

- [项目技术架构文档](./technical/architecture.md)
- [pnpm官方文档](https://pnpm.io/workspaces)
- [NestJS官方文档](https://docs.nestjs.com)
- [Monorepo最佳实践](./technical/monorepo-best-practices.md)
- [项目仓库](https://github.com/FightingTrip/atom-video) 