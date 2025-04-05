# 快速开始

本指南将帮助您快速设置和运行 Atom-Stats 项目。

## 环境准备

1. **Node.js 环境**
   - 安装 Node.js 18.0.0 或更高版本
   - 推荐使用 nvm 管理 Node.js 版本

2. **包管理器**
   - 安装 pnpm 8.0.0 或更高版本
   ```bash
   npm install -g pnpm
   ```

3. **开发工具**
   - VS Code（推荐）
   - 安装推荐的扩展：
     - ESLint
     - Prettier
     - TypeScript Vue Plugin
     - Tailwind CSS IntelliSense

## 项目设置

1. **克隆项目**
   ```bash
   git clone https://github.com/atom-dev/atom-stats.git
   cd atom-stats
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **环境配置**
   复制环境变量模板文件：
   ```bash
   cp .env.example .env
   ```
   根据需要修改 .env 文件中的配置。

4. **启动开发服务器**
   ```bash
   pnpm dev
   ```
   访问 http://localhost:5175 查看项目。

## 项目结构

```
atom-stats/
├── src/                # 源代码目录
├── public/             # 静态资源
├── docs/              # 项目文档
├── tests/             # 测试文件
└── scripts/           # 工具脚本
```

## 开发工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **开发新功能**
   - 遵循项目代码规范
   - 添加必要的测试
   - 保持提交信息清晰

3. **运行测试**
   ```bash
   pnpm test          # 运行单元测试
   pnpm test:e2e      # 运行 E2E 测试
   ```

4. **代码检查**
   ```bash
   pnpm lint         # 运行 ESLint 检查
   pnpm format       # 格式化代码
   ```

5. **提交变更**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature
   ```

## 常见问题

### 1. 依赖安装失败
- 检查 Node.js 版本
- 清除 pnpm 缓存：`pnpm store prune`
- 删除 node_modules 后重新安装

### 2. 开发服务器启动失败
- 检查端口占用情况
- 确认环境变量配置正确
- 查看详细错误日志

### 3. 测试运行失败
- 确保所有依赖已正确安装
- 检查测试环境配置
- 查看测试覆盖率报告

## 下一步

- 阅读[开发规范](./coding-standards.md)
- 查看[架构设计](../design/architecture.md)
- 了解[组件开发](./components.md)指南
- 参考[API文档](./api.md)

## 获取帮助

- 查看[常见问题](../user-guide/faq.md)
- 提交 [Issue](https://github.com/atom-dev/atom-stats/issues)
- 加入开发者社区