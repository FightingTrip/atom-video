# Git 工作流

## 分支管理

### 分支命名规范

- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于集成功能
- `feature/*`: 功能分支，用于开发新功能
- `fix/*`: 修复分支，用于修复问题
- `release/*`: 发布分支，用于版本发布
- `hotfix/*`: 紧急修复分支，用于生产环境紧急修复

### 分支创建规则

1. 从 `develop` 分支创建功能分支：
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. 从 `main` 分支创建紧急修复分支：
```bash
git checkout main
git pull origin main
git checkout -b hotfix/your-fix-name
```

## 提交规范

### 提交信息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 提交类型

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI 配置文件和脚本的改动
- `revert`: 回滚到某个版本

### 提交示例

```bash
# 新功能
git commit -m "feat(auth): 添加用户注册功能"

# 修复问题
git commit -m "fix(video): 修复视频上传进度显示问题"

# 文档更新
git commit -m "docs(readme): 更新项目安装说明"

# 代码格式
git commit -m "style(lint): 修复 ESLint 警告"

# 重构
git commit -m "refactor(api): 重构视频处理服务"

# 性能优化
git commit -m "perf(video): 优化视频转码性能"

# 测试
git commit -m "test(auth): 添加用户认证测试用例"

# 构建工具
git commit -m "chore(deps): 更新依赖包版本"

# CI 配置
git commit -m "ci(github): 添加 GitHub Actions 工作流"
```

## 代码审查

### Pull Request 流程

1. 创建功能分支并开发
2. 提交代码并推送到远程
3. 创建 Pull Request
4. 等待代码审查
5. 根据反馈修改代码
6. 合并到目标分支

### 代码审查清单

- [ ] 代码符合项目规范
- [ ] 功能测试通过
- [ ] 单元测试覆盖
- [ ] 文档更新
- [ ] 无冲突
- [ ] 代码简洁清晰

## 版本发布

### 版本号规范

遵循 [语义化版本](https://semver.org/)：

- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 发布流程

1. 从 `develop` 创建 `release` 分支：
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
```

2. 更新版本号：
```bash
# 更新 package.json 版本号
pnpm version 1.0.0
```

3. 合并到 `main` 和 `develop`：
```bash
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags

git checkout develop
git merge release/v1.0.0
git push origin develop
```

4. 删除 `release` 分支：
```bash
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

## 紧急修复

### 热修复流程

1. 从 `main` 创建 `hotfix` 分支：
```bash
git checkout main
git pull origin main
git checkout -b hotfix/urgent-fix
```

2. 修复问题并提交：
```bash
git commit -m "fix(video): 紧急修复视频播放崩溃问题"
```

3. 合并到 `main` 和 `develop`：
```bash
git checkout main
git merge hotfix/urgent-fix
git tag v1.0.1
git push origin main --tags

git checkout develop
git merge hotfix/urgent-fix
git push origin develop
```

4. 删除 `hotfix` 分支：
```bash
git branch -d hotfix/urgent-fix
git push origin --delete hotfix/urgent-fix
```

## 最佳实践

1. **保持分支更新**
   - 定期从主分支拉取更新
   - 及时解决冲突

2. **提交粒度**
   - 每个提交应该是一个完整的逻辑单元
   - 避免大而全的提交

3. **提交信息**
   - 使用清晰的提交信息
   - 遵循提交规范

4. **代码审查**
   - 认真对待代码审查
   - 及时响应审查意见

5. **分支管理**
   - 及时删除已合并的分支
   - 保持分支结构清晰 