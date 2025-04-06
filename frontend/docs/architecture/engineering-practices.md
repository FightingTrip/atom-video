# Atom Video 工程实践指南

本文档详细说明Atom Video项目的工程实践和开发规范，帮助团队成员一致地遵循最佳实践。

## 目录

1. [代码风格和规范](#代码风格和规范)
2. [Monorepo最佳实践](#monorepo最佳实践)
3. [Git工作流](#git工作流)
4. [构建和部署流程](#构建和部署流程)
5. [测试策略](#测试策略)
6. [代码审查指南](#代码审查指南)
7. [性能优化实践](#性能优化实践)
8. [安全实践](#安全实践)
9. [文档规范](#文档规范)
10. [持续集成与发布](#持续集成与发布)

## 代码风格和规范

### TypeScript 规范

- 使用严格模式 (`strict: true`)
- 优先使用类型注解，避免使用 `any`
- 使用接口定义对象结构，类型别名用于联合类型和类型映射
- 遵循[TypeScript规范指南](https://google.github.io/styleguide/tsguide.html)

### Vue 开发规范

- 使用Vue 3 Composition API进行组件开发
- 每个组件应该具有清晰的职责，遵循单一职责原则
- 组件命名应使用PascalCase
- 组件props应定义类型和默认值

### CSS/SCSS 规范

- 使用BEM命名方法论
- 使用CSS变量管理主题和设计标记
- 组件样式使用scoped方式或CSS Modules
- 布局优先使用Flexbox和CSS Grid

### 目录结构和文件组织

- 按功能模块组织文件
- 公共组件放在 `components/common` 目录下
- 页面组件放在 `views` 或 `pages` 目录下
- 业务逻辑和状态管理与UI分离

## Monorepo最佳实践

### 包管理

- 使用pnpm作为首选包管理工具
- 采用workspace协议引用内部依赖 (`"@atom/shared-types": "workspace:*"`)
- 使用`.npmrc`配置确保一致的安装行为

#### pnpm配置详情

项目的`.npmrc`文件配置如下：

```
engine-strict=true
auto-install-peers=true
shamefully-hoist=true
strict-peer-dependencies=false
shell-emulator=true
node-linker=hoisted
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
link-workspace-packages=true

# 保持pnpm-lock.yaml稳定
save-prefix=""

# 包管理兼容性
use-node-version=18.0.0
prefer-workspace-packages=true

# 安全设置
audit=false

# 缓存设置
cache-dir=./.pnpm-store
store-dir=./.pnpm-store
```

这些配置确保：
- `node-linker=hoisted`: 使用提升模式，提高与其他包管理器的兼容性
- `public-hoist-pattern[]`: 将ESLint和Prettier相关包提升到根目录，避免重复安装
- `prefer-workspace-packages`: 优先使用工作区内的包版本

### 包设计原则

- **共享类型**：在`packages/shared-types`中定义跨项目共享的TypeScript类型
- **共享配置**：在`packages/eslint-config`和`packages/tsconfig`中维护公共配置
- **工具包**：将通用工具函数或组件抽象为独立包

#### 实现的共享包

目前项目已实现以下共享包：

1. **@atom/shared-types**: 共享TypeScript类型定义
   ```
   shared-types/
   ├── api/               # API相关类型
   ├── models/            # 数据模型类型
   ├── utils/             # 工具类型
   ├── index.d.ts         # 类型导出
   └── package.json
   ```

2. **@atom/eslint-config**: 共享ESLint配置
   ```
   eslint-config/
   ├── index.js           # 基础配置
   ├── vue.js             # Vue项目配置
   ├── node.js            # Node.js项目配置
   └── package.json
   ```

3. **@atom/tsconfig**: 共享TypeScript配置
   ```
   tsconfig/
   ├── base.json          # 基础配置
   ├── vue-app.json       # Vue应用配置
   ├── node.json          # Node.js应用配置
   └── package.json
   ```

### 版本管理

- 使用固定依赖版本（避免"^"和"~"）
- 内部包采用工作区引用而非版本号
- 对外部依赖设置版本范围限制

#### 根目录package.json配置

```json
{
  "name": "atom-video",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "frontend",
    "backend",
    "packages/*"
  ],
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.4",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:mock": "pnpm --filter frontend dev:mock",
    "dev:backend": "pnpm --filter backend dev",
    "build": "pnpm -r --sequential build",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build",
    "lint": "pnpm -r --parallel lint",
    "test": "pnpm -r test"
    // 其他脚本...
  },
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
}
```

### 构建和测试

- 使用快捷命令：`pnpm -r build`、`pnpm -r --parallel test`
- 使用过滤器选择特定包：`pnpm --filter frontend build`
- 将公共配置集中管理

#### 常用命令示例

```bash
# 开发所有项目
pnpm dev

# 仅开发前端
pnpm dev:frontend

# 构建所有项目
pnpm build

# 测试所有项目
pnpm test

# 清理依赖和构建产物
pnpm clean
```

## Git工作流

### 分支策略

- 主分支: `main` - 生产环境代码
- 开发分支: `develop` - 开发环境代码
- 功能分支: `feature/feature-name` - 新功能开发
- 修复分支: `fix/bug-name` - 修复bug
- 发布分支: `release/version` - 版本发布准备

### 提交规范

遵循[Conventional Commits](https://www.conventionalcommits.org/)规范:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

提交类型:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 只修改文档
- `style`: 不影响代码含义的修改(空格、格式、缺少分号等)
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

#### Commitlint配置

项目使用`commitlint.config.cjs`文件进行提交信息验证：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式调整
        'refactor', // 重构
        'test',     // 测试相关
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回滚
        'perf',     // 性能优化
        'ci',       // CI配置
        'build'     // 构建相关
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100]
  }
};
```

### 代码审查流程

1. 创建功能分支进行开发
2. 完成后创建Pull Request
3. 至少1名团队成员审查代码
4. CI自动运行测试和构建
5. 所有检查通过后合并

## 构建和部署流程

### 开发环境

- 使用`pnpm dev`运行本地开发服务器
- 使用Vite提供的热重载进行快速开发

### 构建过程

使用标准化的构建命令:
- `pnpm build` - 构建所有包和应用
- `pnpm build:frontend` - 只构建前端
- `pnpm build:backend` - 只构建后端

### 环境配置

使用`.env`文件管理环境变量:
- `.env` - 基础配置
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

## 测试策略

### 单元测试

- 使用Vitest进行Vue组件和工具函数测试
- 测试文件与源代码文件同级放置，命名为`*.spec.ts`
- 关注函数逻辑和组件行为测试

### 集成测试

- 使用Vue Test Utils测试组件交互
- 模拟API请求和用户交互
- 测试组件之间的集成

### 端到端测试

- 使用Cypress进行端到端测试
- 测试关键用户流程
- 在CI中运行以确保功能稳定性

## 代码审查指南

### 审查重点

- 代码是否符合项目规范
- 业务逻辑是否正确
- 是否有潜在的性能问题
- 测试覆盖是否充分
- 文档是否完善

### 审查流程

1. 关注代码结构和设计模式
2. 检查错误处理和边界情况
3. 验证业务需求的实现
4. 检查测试覆盖度
5. 提供建设性反馈

## 性能优化实践

### 前端优化

- 懒加载组件和路由
- 使用虚拟滚动处理长列表
- 优化资源加载顺序
- 合理使用缓存策略
- 按需加载第三方库

### 后端优化

- 数据库查询优化
- 合理使用缓存
- API响应优化
- 异步处理长时间任务

## 安全实践

### 前端安全

- 防止XSS攻击
- CSRF保护
- 安全的认证流程
- 敏感数据处理

### API安全

- 请求验证和清洗
- 访问控制和权限检查
- 速率限制防止滥用
- 安全的错误处理

## 文档规范

### 代码文档

- 为公共API提供JSDoc注释
- 为复杂逻辑添加详细注释
- 使用有意义的变量和函数名称

### 项目文档

- 在`docs`目录维护架构和设计文档
- 更新README文件保持最新
- 提供开发者入门指南

## 持续集成与发布

### CI流程

- 每次提交自动运行测试
- 构建检查确保项目可以成功构建
- 代码质量和测试覆盖率检查

### 部署流程

- 自动化构建和部署
- 灰度发布新功能
- 部署后监控系统健康状况
