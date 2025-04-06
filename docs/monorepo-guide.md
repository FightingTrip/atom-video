# Atom Video Monorepo 开发指南

本指南将帮助开发者理解并有效使用Atom Video项目的Monorepo架构，包括环境设置、日常开发流程和最佳实践。

## 环境准备

### 1. 安装必要工具

首先确保您的系统已安装以下工具：

```bash
# 安装Node.js (需要v18+)
# Windows: 使用官方安装包
# MacOS:
brew install node@18

# 安装pnpm (需要v8+)
npm install -g pnpm@latest

# 全局安装一些有用的工具
npm install -g rimraf concurrently typescript
```

### 2. 克隆仓库

```bash
git clone https://github.com/your-username/atom-video.git
cd atom-video
```

### 3. 安装依赖

```bash
# 使用pnpm安装所有工作区依赖
pnpm install
```

## 项目结构概览

```
atom-video/
├── frontend/                 # Vue 3前端应用
│   ├── src/                  # 前端源代码
│   ├── package.json          # 前端包配置
│   └── ...
├── backend/                  # Express后端服务
│   ├── src/                  # 后端源代码
│   ├── package.json          # 后端包配置
│   └── ...
├── packages/                 # 共享包目录
│   ├── shared-types/         # 共享TypeScript类型
│   ├── eslint-config/        # 共享ESLint配置
│   └── tsconfig/             # 共享TypeScript配置
├── .npmrc                    # pnpm配置
├── package.json              # 工作区根配置
├── pnpm-workspace.yaml       # 工作区定义
├── lerna.json                # Lerna配置
└── docs/                     # 项目文档
```

## 日常开发流程

### 1. 启动开发环境

```bash
# 启动所有项目（前端+后端）
pnpm dev

# 只启动前端
pnpm dev:frontend

# 只启动后端
pnpm dev:backend

# 使用Mock数据启动前端
pnpm dev:mock
```

### 2. 安装新依赖

```bash
# 安装依赖到根目录（通常用于开发工具）
pnpm add -D eslint -w

# 安装依赖到特定包
pnpm add axios --filter frontend
pnpm add express --filter backend

# 安装工作区包作为依赖
pnpm add @atom/shared-types --filter frontend
```

### 3. 创建新功能

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 开发完成后提交
git add .
git commit -m "feat: add new feature"

# 推送到远程
git push origin feature/new-feature
```

### 4. 运行测试

```bash
# 运行所有包的测试
pnpm test

# 运行特定包的测试
pnpm test:frontend
pnpm test:backend

# 监视模式运行测试
pnpm test:watch
```

### 5. 构建项目

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm build:frontend
pnpm build:backend
```

### 6. 代码质量检查

```bash
# 运行所有包的代码检查
pnpm lint

# 检查特定包的代码
pnpm lint:frontend
pnpm lint:backend

# 格式化所有代码
pnpm format
```

### 7. 清理项目

```bash
# 清理所有构建和缓存文件
pnpm clean

# 删除所有node_modules目录
pnpm clean:deps
```

## 使用Lerna命令

除了pnpm命令外，我们也可以直接使用Lerna命令：

```bash
# 列出所有包
pnpm list

# 查看变更的包
pnpm changed

# 对所有包执行命令
pnpm exec -- command

# 监视文件变化并执行命令
pnpm watch -- command
```

## 开发共享包

### 1. 创建新的共享包

```bash
# 创建目录
mkdir -p packages/new-package
cd packages/new-package

# 初始化包
pnpm init

# 修改package.json
{
  "name": "@atom/new-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### 2. 构建和测试共享包

```bash
# 构建特定共享包
pnpm --filter @atom/new-package build

# 将共享包链接到其他项目
pnpm add @atom/new-package --filter frontend
```

### 3. 发布共享包

共享包的发布通常由CI自动处理，但你也可以手动发布：

```bash
# 使用Lerna发布所有变更的包
pnpm publish
```

## 跨包开发工作流

开发跨多个包的功能时，建议以下工作流：

1. 首先在共享包中定义接口或类型
2. 构建共享包以使新类型可用
3. 在前端和后端实现功能
4. 并行运行前端和后端服务测试功能

```bash
# 实践示例
# 1. 更新shared-types包
cd packages/shared-types
# 编辑类型定义
pnpm build

# 2. 更新后端实现
cd ../../backend
# 编辑API实现

# 3. 更新前端实现
cd ../frontend
# 实现前端功能

# 4. 一起运行测试
cd ..
pnpm dev
```

## 依赖管理最佳实践

1. **合理划分依赖**
   - 运行时依赖：`dependencies`
   - 构建依赖：`devDependencies`
   - 可选依赖：`optionalDependencies`

2. **避免重复依赖**
   - 共享的开发工具放在根目录
   - 检查冗余依赖：`pnpm why <package>`

3. **版本控制**
   - 使用精确版本号
   - 统一使用pnpm解决版本冲突

4. **依赖更新**
   - 定期更新依赖：`pnpm update -r`
   - 使用`npm-check-updates`检查过时依赖

## 常见问题解决

### 问题1: 找不到共享包的类型定义

```bash
# 解决方法：重新构建共享包
pnpm --filter @atom/shared-types build
```

### 问题2: 依赖冲突

```bash
# 检查冲突依赖
pnpm why conflicting-package

# 在根package.json中添加覆盖
"pnpm": {
  "overrides": {
    "conflicting-package": "^version"
  }
}
```

### 问题3: 热重载不生效

```bash
# 重新启动开发服务器
pnpm dev:frontend --force
```

### 问题4: 构建失败

```bash
# 清理并重新构建
pnpm clean
pnpm install
pnpm build
```

## 高级用法

### 工作区过滤器

pnpm提供了强大的过滤功能：

```bash
# 对特定目录的包执行命令
pnpm --filter "./packages/**" <command>

# 对依赖某个包的所有包执行命令
pnpm --filter "...@atom/shared-types" <command>

# 对特定包及其依赖执行命令
pnpm --filter "backend..." <command>
```

### 并行与顺序执行

```bash
# 并行执行（适合相互独立的任务）
pnpm -r --parallel <command>

# 顺序执行（尊重依赖关系）
pnpm -r --sequential <command>
```

### 自定义工作流

可以在根目录的package.json中创建自定义脚本：

```json
"scripts": {
  "dev:all": "concurrently \"pnpm dev:frontend\" \"pnpm dev:backend\"",
  "start:prod": "pnpm build && node backend/dist/index.js"
}
```

## 持续集成与部署

我们的Monorepo配置了GitHub Actions工作流：

1. **CI工作流**：对所有PR和主分支提交运行测试
2. **发布工作流**：当版本标签推送时发布包
3. **部署工作流**：当主分支更新时部署应用

详细信息请参考`.github/workflows/`目录。

## 注意事项

1. 不要删除root的pnpm-lock.yaml文件
2. 子包中不需要单独的lock文件
3. 保持.npmrc配置一致
4. 共享包修改后记得重新构建

## 相关资源

- [项目技术架构文档](./technical/architecture.md)
- [pnpm官方文档](https://pnpm.io/workspaces)
- [Lerna文档](https://github.com/lerna/lerna)
- [Monorepo最佳实践](./technical/monorepo-best-practices.md) 