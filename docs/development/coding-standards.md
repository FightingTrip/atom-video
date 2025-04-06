# 编码规范

本文档规定了 Atom Video 项目的编码规范和最佳实践，特别针对 Monorepo 架构下的多包开发规范。

## 1. 通用规范

### 1.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | 使用 kebab-case （小写字母和连字符） | `video-player.vue`, `auth-service.ts` |
| 目录名 | 使用 kebab-case （小写字母和连字符） | `user-management/`, `video-processing/` |
| 类名 | 使用 PascalCase （大驼峰式） | `VideoPlayer`, `AuthService` |
| 接口名 | 使用 PascalCase，以 I 开头 | `IUser`, `IVideoMetadata` |
| 类型名 | 使用 PascalCase，以 T 开头 | `TVideoStatus`, `TUserRole` |
| 常量 | 使用大写字母和下划线 | `MAX_FILE_SIZE`, `API_BASE_URL` |
| 变量/属性 | 使用 camelCase （小驼峰式） | `currentUser`, `videoUrl` |
| 函数/方法 | 使用 camelCase （小驼峰式） | `getUserData()`, `playVideo()` |
| 组件名 | 使用 PascalCase （大驼峰式） | `VideoPlayer`, `UserProfile` |
| CSS 类名 | 使用 BEM 方法论 | `video-player__control--active` |

### 1.2 代码格式

- 缩进使用 2 个空格
- 行尾不保留空格
- 文件结尾添加空行
- 每行不超过 100 个字符
- 使用 UTF-8 编码格式
- 使用单引号 `'` 而非双引号 `"`
- 在运算符前后添加空格
- 使用 ES6+ 语法特性

### 1.3 注释规范

- 使用 JSDoc 风格的注释文档
- 为公共 API 和复杂逻辑添加注释
- 避免无意义的注释
- 使用 TODO、FIXME、NOTE 等标记特殊注释

```typescript
/**
 * 用户服务，处理用户相关操作
 * @class
 */
class UserService {
  /**
   * 获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<User>} 用户信息
   * @throws {Error} 如果用户不存在
   */
  async getUser(userId: string): Promise<User> {
    // TODO: 添加缓存机制
    return this.userRepository.findById(userId);
  }
}
```

## 2. 前端编码规范

### 2.1 Vue 组件规范

#### 2.1.1 文件组织

- 每个组件放在单独的文件中
- 组件文件使用 PascalCase 命名
- 组件在模板中使用 PascalCase 或 kebab-case 引用

```vue
<!-- 正确: -->
<UserProfile />
<!-- 或 -->
<user-profile></user-profile>

<!-- 错误: -->
<userProfile />
```

#### 2.1.2 组件结构

- 遵循 Vue 单文件组件的顺序：`<script>`, `<template>`, `<style>`
- 在 `<script setup>` 中使用明确的组织结构：
  1. 导入语句
  2. 接口和类型定义
  3. 组件属性 (props/emits)
  4. 组件状态
  5. 计算属性
  6. 侦听器
  7. 生命周期钩子
  8. 方法

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

// 2. 类型定义
interface Props {
  videoId: string;
  autoplay?: boolean;
}

// 3. 组件属性
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pause'): void;
}>();

// 4. 组件状态
const isPlaying = ref(false);
const currentTime = ref(0);

// 5. 计算属性
const formattedTime = computed(() => {
  return new Date(currentTime.value * 1000).toISOString().substr(14, 5);
});

// 6. 侦听器
watch(isPlaying, (newValue) => {
  if (newValue) {
    emit('play');
  } else {
    emit('pause');
  }
});

// 7. 生命周期
onMounted(() => {
  if (props.autoplay) {
    play();
  }
});

// 8. 方法
function play() {
  isPlaying.value = true;
}

function pause() {
  isPlaying.value = false;
}
</script>
```

#### 2.1.3 样式规范

- 使用 `scoped` 限制样式作用域
- 使用 BEM 命名规范
- 优先使用 Tailwind CSS 工具类
- 针对主题切换使用 CSS 变量

```vue
<style scoped>
.video-player {
  width: 100%;
  height: auto;
}

.video-player__controls {
  display: flex;
  align-items: center;
}

.video-player__button--play {
  background-color: var(--primary-color);
}
</style>
```

### 2.2 Typescript 使用规范

- 总是显式定义类型，避免使用 `any`
- 使用接口定义对象结构，使用类型别名定义联合类型
- 使用枚举表示固定的选项集合
- 使用 `unknown` 而非 `any` 表示不确定类型
- 函数总是定义返回类型

```typescript
// 正确
function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// 错误
function getUser(id) {
  return api.get(`/users/${id}`);
}
```

### 2.3 路由规范

- 路由配置集中管理
- 路由路径使用 kebab-case
- 路由名称使用 camelCase

```typescript
const routes = [
  {
    path: '/user-profile',
    name: 'userProfile',
    component: UserProfile,
    meta: {
      requiresAuth: true,
      title: '用户资料'
    }
  }
];
```

### 2.4 状态管理规范

- 使用 Pinia 进行状态管理
- Store 按模块划分
- 使用 `defineStore` 创建 store
- Action 命名使用动词开头（fetch, update, create, delete）

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchCurrentUser() {
      this.isLoading = true;
      try {
        this.currentUser = await api.get('/user/me');
        this.error = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
```

## 3. 后端编码规范

### 3.1 目录结构

按照功能模块组织代码：

```
src/
├── controllers/    # 控制器
├── services/       # 业务逻辑
├── repositories/   # 数据访问
├── models/         # 数据模型
├── middlewares/    # 中间件
├── utils/          # 工具函数
├── config/         # 配置
└── types/          # 类型定义
```

### 3.2 API 设计

- 使用 RESTful 风格 API
- URL 使用复数名词，例如 `/users` 而非 `/user`
- 使用 HTTP 方法表示操作：
  - GET: 获取资源
  - POST: 创建资源
  - PUT/PATCH: 更新资源
  - DELETE: 删除资源
- 使用 HTTP 状态码表示结果
- 返回格式一致

```typescript
// API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

### 3.3 异常处理

- 使用自定义异常类
- 集中处理异常
- 使用适当的 HTTP 状态码
- 提供有意义的错误信息

```typescript
// 定义异常类
class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 使用异常类
function getUserById(id: string) {
  const user = userRepository.findById(id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  return user;
}

// 中间件处理异常
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      error: err.message
    });
  }
  
  // 处理其他异常
  return res.status(500).json({
    success: false,
    data: null,
    error: 'Internal Server Error'
  });
});
```

### 3.4 数据库操作

- 使用 ORM（如 Prisma）访问数据库
- 事务中处理关联操作
- 使用索引优化查询性能
- 避免 N+1 查询问题

```typescript
// 使用 Prisma 进行数据库操作
async function createUserWithProfile(userData: UserInput) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: userData.email,
        password: await hashPassword(userData.password)
      }
    });
    
    await tx.profile.create({
      data: {
        userId: user.id,
        name: userData.name,
        avatar: userData.avatar
      }
    });
    
    return user;
  });
}
```

## 4. Monorepo 架构规范

### 4.1 目录结构

遵循以下 Monorepo 目录结构：

```
atom-video/
├── frontend/           # 前端应用
│   ├── src/            # 源代码
│   ├── public/         # 静态资源
│   └── package.json    # 前端依赖
├── backend/            # 后端应用
│   ├── src/            # 源代码
│   └── package.json    # 后端依赖
├── packages/           # 共享包
│   ├── eslint-config/  # ESLint 配置
│   ├── tsconfig/       # TypeScript 配置
│   └── shared-types/   # 共享类型定义
├── package.json        # 工作区配置
└── .npmrc              # npm/pnpm 配置
```

### 4.2 包命名规范

- 使用组织前缀：`@atom/`
- 包名使用小写字母和连字符
- 内部包：`@atom/shared-types`, `@atom/eslint-config`, `@atom/tsconfig`
- 应用包：`@atom/frontend`, `@atom/backend`

### 4.3 依赖管理

- 在根 `package.json` 定义工作区
- 使用 `pnpm` 包管理器
- 将开发依赖（ESLint, TypeScript）提升到根目录
- 使用精确版本号，避免 `^` 和 `~`

```json
// 根 package.json
{
  "name": "atom-video",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "packages/*"
  ],
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r --sequential build",
    "lint": "pnpm -r --parallel lint",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "typescript": "5.4.3",
    "eslint": "8.56.0"
  }
}
```

### 4.4 共享包开发规范

#### 4.4.1 类型定义包

- 使用 `.d.ts` 文件定义类型
- 明确导出所有类型
- 按功能模块组织类型
- 提供详细的 JSDoc 文档

```typescript
// packages/shared-types/api/user.d.ts
/**
 * 用户详情接口
 */
export interface IUser {
  /** 用户唯一标识 */
  id: string;
  /** 用户电子邮箱 */
  email: string;
  /** 用户显示名称 */
  displayName: string;
  /** 用户头像URL */
  avatarUrl?: string;
  /** 用户创建时间 */
  createdAt: string;
}
```

#### 4.4.2 配置共享包

- 保持配置简单，避免过度抽象
- 提供可扩展的基础配置
- 使用扩展机制定制配置
- 提供详细的使用文档

```js
// packages/eslint-config/index.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // 基础规则
  }
};

// packages/eslint-config/vue.js
module.exports = {
  extends: [
    './index.js',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    // Vue 特定规则
  }
};
```

### 4.5 包间依赖处理

- 包引用使用工作区语法
- 使用正确的版本引用方式
- 避免循环依赖
- 中心化类型定义

```json
// frontend/package.json
{
  "name": "@atom/frontend",
  "dependencies": {
    "@atom/shared-types": "workspace:*"
  }
}

// backend/package.json
{
  "name": "@atom/backend",
  "dependencies": {
    "@atom/shared-types": "workspace:*"
  }
}
```

### 4.6 Monorepo 特有规范

- 应用间不直接相互依赖
- 通过共享包共享代码
- 共享包应该是纯函数或类型
- 避免状态共享
- 避免构建依赖环

## 5. 测试规范

### 5.1 测试类型

- 单元测试：测试独立功能模块
- 集成测试：测试模块之间的集成
- E2E 测试：测试完整用户流程
- 组件测试：测试 UI 组件

### 5.2 测试命名和组织

- 测试文件命名：`*.test.ts` 或 `*.spec.ts`
- 测试目录：与源代码平行或使用 `__tests__` 目录
- 测试用例使用描述性命名

```typescript
// 用户服务测试
describe('UserService', () => {
  describe('getUser', () => {
    it('should return user by id when user exists', async () => {
      // 测试代码
    });
    
    it('should throw not found error when user does not exist', async () => {
      // 测试代码
    });
  });
});
```

### 5.3 测试覆盖率要求

- 单元测试覆盖率目标：80%+
- 集成测试覆盖关键流程
- E2E 测试覆盖核心用户流程

## 6. 文档规范

### 6.1 代码文档

- 使用 JSDoc 为函数和类添加文档
- 文档注释包括：描述、参数、返回值、异常
- 为复杂算法添加详细注释
- 为 API 提供详细说明

### 6.2 项目文档

- README.md：项目概述、安装指南
- CONTRIBUTING.md：贡献指南
- 架构文档：描述系统架构
- API 文档：API 使用说明
- 用户手册：用户使用指南

### 6.3 文档位置

- 代码文档：代码内部
- 项目文档：位于 `docs/` 目录
- API 文档：使用 Swagger/OpenAPI 自动生成
- 开发文档：位于 `docs/development/`

## 7. 安全规范

### 7.1 常见安全问题

- 避免 SQL 注入：使用参数化查询
- 避免 XSS：输入验证和输出编码
- 避免 CSRF：使用 CSRF Token
- 避免敏感信息泄露：不记录密码和令牌

### 7.2 认证和授权

- 使用 JWT 进行认证
- 实现细粒度的权限控制
- 密码存储使用强哈希算法（bcrypt）
- 实现登录失败限制

### 7.3 数据保护

- 敏感数据传输使用 HTTPS
- 敏感数据存储使用加密
- 实现数据备份和恢复机制
- 遵循最小权限原则

## 8. 性能优化规范

### 8.1 前端性能

- 懒加载和代码分割
- 减少 HTTP 请求
- 使用缓存策略
- 优化图片和静态资源

### 8.2 后端性能

- 使用数据库索引
- 实现缓存策略
- 异步处理耗时操作
- 优化数据库查询

### 8.3 监控和分析

- 使用性能监控工具
- 定期进行性能测试
- 分析性能瓶颈
- 持续优化性能

## 9. 最佳实践

### 9.1 可维护性

- 保持代码简洁
- 避免重复代码
- 使用设计模式解决复杂问题
- 编写可测试代码

### 9.2 可扩展性

- 使用模块化设计
- 定义清晰的接口
- 避免强耦合
- 考虑未来扩展

### 9.3 代码评审

- 所有代码通过评审后合并
- 评审关注点：可读性、性能、安全性
- 使用自动化工具辅助评审
- 积极接受和提供建设性反馈 