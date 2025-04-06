# Git 工作流程

本文档描述了 Atom Video 项目的 Git 工作流程和代码提交规范，特别针对 Monorepo 架构下的协作开发。

## 1. 分支策略

### 1.1 主要分支

- **main**: 生产环境分支，稳定版本
- **dev**: 开发环境分支，最新开发版本
- **release**: 预发布分支，用于测试和准备发布

### 1.2 辅助分支

- **feature/\***: 功能分支，用于开发新功能
- **bugfix/\***: 缺陷修复分支，用于修复非紧急 bug
- **hotfix/\***: 紧急修复分支，用于修复生产环境 bug
- **refactor/\***: 重构分支，用于代码重构
- **docs/\***: 文档分支，用于更新文档

### 1.3 分支命名规范

分支名称应采用以下格式：

- 功能分支: `feature/[功能名称]` 或 `feature/[模块]-[功能名称]`
- 缺陷修复: `bugfix/[问题简述]` 或 `bugfix/[问题ID]`
- 紧急修复: `hotfix/[问题简述]` 或 `hotfix/[问题ID]`
- 重构分支: `refactor/[模块名称]`
- 文档分支: `docs/[文档内容简述]`

**示例**:
- `feature/user-authentication`
- `feature/frontend-video-player`
- `bugfix/login-redirect-issue`
- `hotfix/critical-security-issue`
- `refactor/backend-api`
- `docs/api-documentation`

## 2. 工作流程

### 2.1 开发新功能

1. 从最新的 `dev` 分支创建功能分支
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/your-feature-name
   ```

2. 在功能分支上进行开发
   ```bash
   # 进行更改...
   git add .
   git commit -m "feat: 实现新功能"
   ```

3. 保持与 `dev` 分支同步
   ```bash
   git checkout dev
   git pull
   git checkout feature/your-feature-name
   git merge dev
   # 解决冲突（如有）
   ```

4. 完成功能开发后，提交 Pull Request 到 `dev` 分支

### 2.2 修复缺陷

1. 从最新的 `dev` 分支创建 bugfix 分支
   ```bash
   git checkout dev
   git pull
   git checkout -b bugfix/issue-description
   ```

2. 修复缺陷
   ```bash
   # 进行修复...
   git add .
   git commit -m "fix: 修复XX问题"
   ```

3. 提交 Pull Request 到 `dev` 分支

### 2.3 紧急修复

1. 从 `main` 分支创建 hotfix 分支
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/critical-issue
   ```

2. 修复问题
   ```bash
   # 进行修复...
   git add .
   git commit -m "fix: 修复紧急问题"
   ```

3. 提交 Pull Request 到 `main` 分支
4. 修复合并到 `main` 后，也需要合并到 `dev` 分支

### 2.4 版本发布

1. 从 `dev` 分支创建 `release` 分支
   ```bash
   git checkout dev
   git pull
   git checkout -b release/v1.0.0
   ```

2. 修复发现的问题并更新版本号
   ```bash
   # 进行最终修复和调整...
   git add .
   git commit -m "chore: 准备发布v1.0.0"
   ```

3. 测试通过后，提交 Pull Request 到 `main` 分支
4. 在 `main` 分支上创建版本标签
   ```bash
   git checkout main
   git pull
   git tag -a v1.0.0 -m "版本 1.0.0"
   git push origin v1.0.0
   ```
5. 将 `release` 分支合并回 `dev` 分支

## 3. Monorepo 特殊考虑

### 3.1 跨包更改

当更改影响多个子包时：

1. 在提交信息中使用对应的作用域
   ```bash
   git commit -m "feat(frontend,backend): 实现跨包功能"
   ```

2. 确保同时更新相关的共享类型或配置
   ```bash
   git commit -m "feat(shared-types,frontend): 添加新的共享类型定义"
   ```

### 3.2 子包版本管理

在 Monorepo 中管理子包版本：

1. 使用 `changeset` 记录版本变更
   ```bash
   pnpm changeset
   # 选择受影响的包并描述变更
   ```

2. 在发布前整合变更集
   ```bash
   pnpm changeset version
   # 这会更新各个包的版本
   ```

3. 发布更新的包
   ```bash
   pnpm publish -r
   ```

### 3.3 工作区选择性提交

仅提交特定子包的更改：

```bash
git add packages/frontend/src
git commit -m "feat(frontend): 更新前端组件"
```

## 4. 提交信息规范

我们采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，所有提交信息必须遵循以下格式：

```
<类型>(<作用域>): <描述>

[可选的正文]

[可选的脚注]
```

### 4.1 类型

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构（既不是新功能也不是修复 bug）
- **perf**: 性能优化
- **test**: 添加或修改测试
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI 配置变更
- **build**: 影响构建系统或外部依赖的更改
- **revert**: 回滚之前的提交

### 4.2 作用域

作用域应指明更改影响的子包或模块：

- **frontend**: 前端相关
- **backend**: 后端相关
- **shared-types**: 共享类型定义
- **eslint-config**: ESLint 配置
- **tsconfig**: TypeScript 配置
- **docs**: 文档
- **api**: API 相关
- **auth**: 认证相关
- **video**: 视频功能相关
- **user**: 用户功能相关

### 4.3 提交信息示例

```
feat(frontend): 添加视频播放器组件

新增视频播放器组件，支持自动播放和画中画功能

BREAKING CHANGE: 移除了旧版播放器API
```

```
fix(backend): 修复用户认证失败问题

修复了当用户密码包含特殊字符时认证失败的问题

Ref: #123
```

```
chore(shared-types): 更新依赖版本

更新TypeScript到5.4.0版本
```

## 5. 代码审查

### 5.1 审查要点

- 代码是否符合项目的编码规范
- 是否有适当的测试覆盖
- 在 Monorepo 中是否正确处理了包间依赖
- 是否考虑了性能、安全性和可维护性
- 提交信息是否符合规范

### 5.2 Pull Request 流程

1. 创建 Pull Request 前，确保：
   - 分支已与目标分支同步
   - 所有测试通过
   - 代码通过 lint 检查
   - 提交信息符合规范

2. Pull Request 标题应遵循提交信息格式
   例如：`feat(frontend): 添加视频播放器组件`

3. 在描述中提供详细信息：
   - 所实现的功能或修复的问题
   - 测试方法
   - 相关 issue 链接
   - 屏幕截图（如适用）

4. 至少需要一个审阅者批准后才能合并

5. 使用 Squash and Merge 策略合并，保持提交历史整洁

## 6. 持续集成

我们使用 GitHub Actions 进行持续集成，每个 Pull Request 都会自动运行以下检查：

- **lint**: 代码规范检查
- **test**: 单元测试和集成测试
- **build**: 构建检查

所有检查通过后才能合并 Pull Request。

## 7. 常见问题

### 7.1 如何处理合并冲突

```bash
# 拉取目标分支的最新代码
git checkout target-branch
git pull

# 切回你的分支
git checkout your-branch

# 合并目标分支
git merge target-branch

# 解决冲突
# 编辑文件，解决冲突标记
git add .
git commit -m "merge: 解决冲突"
```

### 7.2 如何修改最后一次提交

```bash
git commit --amend
# 或者不修改提交信息
git commit --amend --no-edit
```

### 7.3 如何撤销本地更改

```bash
# 撤销工作区的更改
git checkout -- file-name

# 撤销暂存区的更改
git reset HEAD file-name
```

### 7.4 如何撤销已推送的提交

```bash
# 创建回滚提交
git revert commit-hash

# 推送回滚提交
git push origin your-branch
```

## 8. 最佳实践

### 8.1 频繁提交

- 保持小而频繁的提交，每个提交专注于一个更改
- 避免在一个提交中包含不相关的更改

### 8.2 保持分支同步

- 定期与目标分支同步，避免大型合并冲突
- 在提交 Pull Request 前确保已与目标分支同步

### 8.3 撰写清晰的提交信息

- 使用明确的动词开始描述
- 清晰说明做了什么，而不是为什么做
- 在正文中解释更改的原因和背景

### 8.4 Monorepo 提交技巧

- 对于跨多个包的更改，考虑使用多个提交，每个提交专注于一个包
- 在共享包中进行更改时，始终考虑对其他包的影响
- 确保更新相关的测试和文档 