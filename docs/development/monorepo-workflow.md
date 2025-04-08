# Monorepo 工作流指南

本文档详细介绍了在Atom Video项目中使用Monorepo进行开发的工作流程和常见场景解决方案。

## 常见开发场景

### 场景1：创建前后端共享的新功能

当开发需要前后端协同的功能时（如添加一个新的视频互动功能），推荐以下工作流：

1. **首先定义共享类型**

```bash
# 1. 在shared-types中定义新类型
cd packages/shared-types
```

在适当的文件中添加类型定义，例如在`src/api/interaction.d.ts`中：

```typescript
export interface VideoLikeRequestDto {
  videoId: string;
}

export interface CommentCreateDto {
  videoId: string;
  content: string;
  parentId?: string;
}

export interface CommentResponseDto {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  likesCount: number;
  isLiked?: boolean;
  replies?: CommentResponseDto[];
}
```

2. **构建共享类型包**

```bash
# 构建类型包使其对其他包可用
pnpm --filter @atom/shared-types build
```

3. **在后端实现API**

```bash
# 切换到后端项目
cd ../../backend
```

创建相应的控制器、服务和路由：

```typescript
// 在后端中使用共享类型
import { CommentCreateDto, CommentResponseDto } from '@atom/shared-types';

// 实现相应的API
```

4. **在前端实现UI和交互**

```bash
# 切换到前端项目
cd ../frontend
```

创建组件和服务：

```typescript
// 在前端中使用共享类型
import { CommentResponseDto } from '@atom/shared-types';

// 实现组件和API调用
```

5. **并行启动服务测试**

```bash
# 返回项目根目录
cd ..
pnpm dev
```

### 场景2：修复跨多个包的Bug

当需要修复涉及多个包的Bug时：

```bash
# 1. 创建修复分支
git checkout -b fix/issue-123

# 2. 修改相关包（例如shared-types和frontend）
code packages/shared-types/src/models/video.d.ts
code frontend/src/components/VideoPlayer.vue

# 3. 测试变更
pnpm dev

# 4. 提交更改（注意使用conventional commits格式）
git add .
git commit -m "fix: correct video playback rate type (#123)"

# 5. 推送到远程仓库
git push origin fix/issue-123
```

### 场景3：添加新的共享包

添加新的共享包（例如添加一个通用的UI组件库）：

```bash
# 1. 创建新包目录
mkdir -p packages/ui-components
cd packages/ui-components

# 2. 初始化包
pnpm init

# 3. 添加必要的依赖
pnpm add vue typescript -D
pnpm add @atom/shared-types -D
```

编辑`package.json`：

```json
{
  "name": "@atom/ui-components",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc && vue-tsc",
    "dev": "tsc --watch"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  }
}
```

创建组件并导出：

```bash
# 4. 构建新包
pnpm build

# 5. 在其他包中使用
cd ../../frontend
pnpm add @atom/ui-components

# 使用新组件
import { Button } from '@atom/ui-components';
```

### 场景4：更新依赖

更新整个Monorepo或特定包的依赖：

```bash
# 更新所有包的依赖
pnpm update -r

# 更新特定包的特定依赖
pnpm update axios --filter frontend

# 检查过时的依赖
npx npm-check-updates -u --filter frontend
```

### 场景5：清理项目

定期清理项目以保持良好状态：

```bash
# 清理所有构建输出和缓存
pnpm clean

# 删除所有node_modules
pnpm clean:deps

# 重新安装所有依赖
pnpm install
```

## 高级场景

### 场景6：处理依赖冲突

当出现依赖冲突时：

1. 首先分析冲突原因：

```bash
pnpm why conflicting-package
```

2. 在根目录的`package.json`中添加覆盖：

```json
"pnpm": {
  "overrides": {
    "conflicting-package": "1.2.3"
  }
}
```

3. 重新安装依赖：

```bash
pnpm install
```

### 场景7：版本发布

发布新版本：

```bash
# 1. 确保所有测试通过
pnpm test

# 2. 使用Lerna更新版本
pnpm version

# 3. 生成CHANGELOG
# Lerna会自动基于conventional commits生成

# 4. 发布包
pnpm publish
```

### 场景8：包间链接调试

在本地链接包进行调试：

```bash
# 方法1：使用pnpm的工作区特性（已自动启用）
# 当修改共享包时，引用该包的项目将自动使用本地版本

# 方法2：强制重新构建和链接
pnpm --filter @atom/shared-types build
pnpm install --force
```

## 常见问题与解决

### 问题：pnpm安装出错

```bash
# 解决方案
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

### 问题：TypeScript路径解析错误

```bash
# 检查tsconfig.json中的paths配置
# 确保类似如下配置：

{
  "compilerOptions": {
    "paths": {
      "@atom/*": ["packages/*/src"]
    }
  }
}
```

### 问题：Lerna命令失败

```bash
# 尝试清理Lerna缓存
npx lerna clean
rm -rf node_modules/.cache/lerna
```

### 问题：子包脚本无法访问全局安装的工具

```bash
# 在根package.json中将工具添加为开发依赖
pnpm add -D typescript eslint prettier -w
```

## 最佳实践

1. **养成定期更新的习惯**：
   - 每周运行一次`pnpm update -r`
   - 定期检查依赖的安全漏洞

2. **保持干净的工作区**：
   - 使用`.gitignore`排除所有构建产物
   - 定期运行`pnpm clean`

3. **良好的提交习惯**：
   - 遵循conventional commits规范
   - 关联提交与问题（`fix #123`）

4. **灵活使用工作区过滤器**：
   - `--filter "frontend"`：仅前端
   - `--filter "backend..."`：后端及其依赖
   - `--filter "!./packages/eslint-config"`：除eslint-config外所有包

5. **优化CI/CD流程**：
   - 仅构建更改的包
   - 缓存pnpm store以加速安装

## 参考文档

- [Monorepo最佳实践](../technical/monorepo-best-practices.md)
- [Monorepo开发指南](../monorepo-guide.md)
- [pnpm工作区文档](https://pnpm.io/workspaces)
- [Lerna命令参考](https://github.com/lerna/lerna/tree/main/commands) 