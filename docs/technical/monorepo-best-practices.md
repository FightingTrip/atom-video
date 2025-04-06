# Monorepo最佳实践

## 项目简介

Atom Video采用了Monorepo架构进行开发，使用pnpm workspaces和Lerna作为主要工具来管理多个相关的项目包。这种架构允许我们在一个代码仓库中管理多个相互关联的项目，同时保持各个项目的独立性和可维护性。

## Monorepo架构优势

### 代码共享与重用
- **类型定义共享**：前后端共享相同的TypeScript类型定义，确保API契约一致性
- **工具函数复用**：通用功能封装为共享包，避免代码重复
- **配置统一管理**：ESLint、TypeScript、Jest等配置集中管理，确保代码质量标准一致

### 开发效率提升
- **原子化提交**：关联变更可以在一次提交中完成，保持系统一致性
- **统一构建流程**：使用相同的构建、测试和部署流程
- **简化依赖管理**：共享依赖安装一次，减少磁盘空间和安装时间

### 协作便利性
- **简化项目间协作**：团队成员可以方便地跨项目协作
- **统一版本控制**：所有项目使用相同的版本号，简化发布流程
- **全局视角**：开发者可以从整体视角理解系统架构

## 当前实践

### 1. 使用pnpm作为包管理器

pnpm的硬链接和符号链接策略使其成为Monorepo理想的包管理器:

```
# .npmrc配置
node-linker=hoisted              # 使用提升模式进行依赖管理
shamefully-hoist=true            # 兼容模式，确保依赖可正确解析
link-workspace-packages=true     # 启用工作区间依赖链接
shared-workspace-lockfile=true   # 使用共享的锁文件
save-workspace-protocol=true     # 使用工作区协议引用依赖
```

### 2. 工作区配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'frontend'
  - 'backend'
  - 'packages/*'
```

### 3. Lerna集成

```json
// lerna.json
{
  "version": "1.0.0",
  "npmClient": "pnpm",
  "useWorkspaces": true,
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish %s"
    },
    "version": {
      "conventionalCommits": true,
      "message": "chore(release): version %s"
    }
  },
  "packages": [
    "frontend",
    "backend",
    "packages/*"
  ]
}
```

### 4. 共享脚本

在根目录`package.json`中定义统一的脚本命令:

```json
"scripts": {
  "dev": "pnpm -r --parallel dev",
  "dev:frontend": "pnpm --filter frontend dev",
  "dev:backend": "pnpm --filter backend dev",
  "build": "pnpm -r --sequential build",
  "lint": "pnpm -r --parallel lint",
  "test": "pnpm -r test",
  "clean": "pnpm -r exec rm -rf node_modules dist .turbo coverage",
  "exec": "npx lerna exec",
  "watch": "npx lerna watch"
}
```

### 5. 共享包结构

```
packages/
├── shared-types/    # 共享TypeScript类型定义
├── eslint-config/   # 共享ESLint配置
└── tsconfig/        # 共享TypeScript配置
```

### 6. 依赖管理优化

- **提升公共依赖**：将常用开发工具提升到根目录
- **精确版本控制**：使用精确版本号避免版本偏差
- **依赖覆盖**：在根package.json中统一依赖版本

```json
"pnpm": {
  "peerDependencyRules": {
    "allowedVersions": {
      "vue": "3"
    }
  },
  "overrides": {
    "vue": "^3.4.15"
  }
}
```

## 最佳实践准则

### 依赖管理

1. **使用精确版本号**：避免使用`^`或`~`，确保版本一致性
2. **在根目录管理开发依赖**：ESLint、Prettier等开发工具放在根目录
3. **使用pnpm覆盖功能**：确保关键依赖版本一致
4. **定期更新依赖**：使用`pnpm update -r`统一更新依赖

### 项目结构

1. **明确职责分离**：每个包有明确的责任边界
2. **统一命名规范**：采用一致的命名方式（如`@atom/package-name`）
3. **独立版本管理**：每个包可以有自己的版本号（使用Lerna的独立版本模式）
4. **最小化依赖**：减少包之间的交叉依赖

### 构建与测试

1. **共享配置文件**：TypeScript、ESLint、Jest等配置共享
2. **独立但统一的构建**：每个包独立构建，但使用共同的构建脚本
3. **统一的CI流程**：在CI中构建和测试所有包
4. **增量构建**：只构建发生变化的包

### 开发工作流

1. **功能分支开发**：feature/bugfix分支用于开发
2. **跨包变更**：关联变更在同一PR中提交
3. **变更日志自动化**：使用conventional commits和Lerna自动生成changelog
4. **版本发布流程**：使用Lerna统一版本发布

## 常见问题与解决方案

### 问题1：依赖冲突

**解决方案**：
- 在根目录使用`pnpm.overrides`统一版本
- 避免在不同包中使用同一依赖的不同版本
- 使用`pnpm why <package>`检查依赖关系

### 问题2：构建顺序

**解决方案**：
- 使用`pnpm -r --sequential`确保按依赖顺序构建
- 使用Lerna的拓扑排序功能

### 问题3：测试隔离

**解决方案**：
- 每个包有独立的测试配置
- 使用Jest项目功能区分测试环境
- 使用`pnpm -r --parallel test`并行运行测试

### 问题4：IDE支持

**解决方案**：
- 使用工作区感知的IDE（如VS Code）
- 配置适当的TypeScript路径映射
- 使用项目级别的ESLint配置

## 未来改进计划

1. **增加Change Sets工具**：更细粒度的变更管理
2. **集成Turborepo**：优化构建缓存和依赖管理
3. **自动化依赖升级**：集成Renovate或Dependabot
4. **构建性能优化**：使用esbuild加速TypeScript编译
5. **模块联邦**：探索Webpack模块联邦实现微前端

## 参考资源

- [pnpm官方文档](https://pnpm.io/workspaces)
- [Lerna文档](https://github.com/lerna/lerna)
- [Monorepo工具比较](https://monorepo.tools)
- [TypeScript项目引用](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Nx Dev工具](https://nx.dev) 