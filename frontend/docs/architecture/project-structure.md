# 项目结构

本文档详细描述 Atom 前端项目的目录结构和文件组织方式，为开发团队提供清晰的代码导航指南。

## 1. 项目目录结构

```
frontend/
├── .husky/             # Git hooks 配置
├── .vscode/            # VS Code 编辑器配置
├── docs/               # 项目文档
│   └── architecture/   # 架构设计文档
├── public/             # 静态资源目录
├── src/                # 源代码目录
│   ├── assets/         # 静态资源
│   ├── components/     # 组件目录
│   ├── composables/    # 组合式函数
│   ├── constants/      # 常量定义
│   ├── directives/     # 自定义指令
│   ├── layouts/        # 布局组件
│   ├── models/         # 数据模型
│   ├── pages/          # 页面组件
│   ├── plugins/        # 插件
│   ├── router/         # 路由配置
│   ├── services/       # API 服务
│   ├── stores/         # 状态管理
│   ├── styles/         # 全局样式
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   ├── main.ts         # 应用入口
│   └── env.d.ts        # 环境变量类型声明
├── tests/              # 测试目录
│   ├── e2e/            # 端到端测试
│   └── unit/           # 单元测试
├── .browserslistrc     # 浏览器兼容性配置
├── .env                # 环境变量
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── .eslintrc.js        # ESLint 配置
├── .gitignore          # Git 忽略文件
├── index.html          # HTML 模板
├── package.json        # 项目依赖配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 构建配置
└── README.md           # 项目说明
```

## 2. 关键目录详解

### 2.1 `src/components/`

组件目录采用分层组织，包含以下子目录：

```
components/
├── base/           # 基础 UI 组件
│   ├── Button/
│   ├── Card/
│   ├── Dialog/
│   ├── Form/
│   └── ...
├── business/       # 业务组件
│   ├── video/      # 视频相关组件
│   ├── user/       # 用户相关组件
│   ├── comment/    # 评论相关组件
│   └── ...
└── common/         # 通用业务组件
    ├── Header/
    ├── Footer/
    ├── Sidebar/
    └── ...
```

#### 组件命名规范

- 基础组件使用 `Base` 前缀，如 `BaseButton.vue`
- 业务组件使用功能描述命名，如 `VideoPlayer.vue`
- 通用业务组件使用描述性命名，如 `PageHeader.vue`

#### 单文件组件结构

每个组件目录结构如下：

```
Button/
├── BaseButton.vue      # 组件实现
├── BaseButton.test.ts  # 组件测试
└── index.ts            # 导出文件
```

### 2.2 `src/composables/`

组合式函数按功能领域组织：

```
composables/
├── auth/           # 认证相关
│   ├── useAuth.ts
│   └── usePermission.ts
├── form/           # 表单相关
│   ├── useForm.ts
│   └── useValidation.ts
├── ui/             # UI 相关
│   ├── useBreakpoints.ts
│   └── useTheme.ts
└── ...
```

### 2.3 `src/pages/`

页面组件按功能模块组织：

```
pages/
├── auth/           # 认证页面
│   ├── LoginPage.vue
│   └── RegisterPage.vue
├── home/           # 首页相关
│   └── HomePage.vue
├── video/          # 视频相关页面
│   ├── VideoDetailPage.vue
│   ├── VideoListPage.vue
│   └── VideoUploadPage.vue
└── ...
```

### 2.4 `src/services/`

API 服务按业务领域组织：

```
services/
├── api/            # API 客户端配置
│   ├── client.ts   # Axios 实例配置
│   └── interceptors.ts  # 请求/响应拦截器
├── user/           # 用户相关 API
│   └── userService.ts
├── video/          # 视频相关 API
│   └── videoService.ts
└── ...
```

### 2.5 `src/stores/`

状态管理按业务模块组织：

```
stores/
├── auth.ts         # 认证状态
├── user.ts         # 用户状态
├── video.ts        # 视频状态
└── ...
```

### 2.6 `src/styles/`

全局样式文件组织：

```
styles/
├── components.css     # 组件通用样式
├── index.css          # 样式入口文件
├── tailwind.css       # Tailwind 配置
├── theme.css          # 主题相关样式
└── variables.css      # CSS 变量定义
```

## 3. 文件命名规范

项目采用以下命名规范：

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| Vue 组件 | PascalCase | `VideoPlayer.vue` |
| TypeScript 文件 | camelCase | `videoService.ts` |
| 测试文件 | 原文件名.test.ts | `videoService.test.ts` |
| 样式文件 | kebab-case | `button-styles.css` |
| 常量文件 | UPPER_CASE | `API_ENDPOINTS.ts` |

## 4. 模块导入规范

模块导入顺序：

1. 外部库导入
2. 类型导入
3. 项目内部模块导入
4. 样式导入

示例：

```typescript
// 外部库导入
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 类型导入
import type { Video } from '@/types/video'

// 项目内部模块导入
import { videoService } from '@/services/video/videoService'
import BaseButton from '@/components/base/Button/BaseButton.vue'

// 样式导入
import '@/styles/components/video-player.css'
```

## 5. 别名路径配置

项目配置了以下路径别名以简化导入：

| 别名 | 路径 |
|------|------|
| `@` | `src/` |
| `@components` | `src/components/` |
| `@composables` | `src/composables/` |
| `@services` | `src/services/` |
| `@styles` | `src/styles/` |
| `@utils` | `src/utils/` |

使用示例：

```typescript
import BaseButton from '@components/base/Button/BaseButton.vue'
import { useAuth } from '@composables/auth/useAuth'
```

## 6. 组件编写规范

### 6.1 Vue 组件结构

组件采用以下结构顺序：

```vue
<script setup lang="ts">
// 1. 导入部分
// 2. 类型定义
// 3. Props 和 Emits 定义
// 4. 变量声明
// 5. 组合式函数调用
// 6. 计算属性
// 7. 监听器
// 8. 生命周期钩子
// 9. 方法定义
</script>

<template>
  <!-- 模板部分 -->
</template>

<style scoped>
/* 样式部分 */
</style>
```

### 6.2 Props 定义规范

```typescript
// 推荐的 Props 定义方式
const props = defineProps<{
  title: string
  count?: number
  isActive?: boolean
}>()

// 带默认值的 Props
withDefaults(defineProps<{
  title: string
  count?: number
  isActive?: boolean
}>(), {
  count: 0,
  isActive: false
})
```

### 6.3 组合式函数规范

```typescript
// useUser.ts
export function useUser() {
  // 状态
  const user = ref<User | null>(null)
  
  // 方法
  const fetchUser = async (id: string) => {
    // 实现...
  }
  
  // 返回暴露的状态和方法
  return {
    user,
    fetchUser
  }
}
```

## 7. 测试文件组织

### 7.1 单元测试

```
tests/unit/
├── components/    # 组件测试
├── composables/   # 组合式函数测试
├── services/      # 服务测试
└── utils/         # 工具函数测试
```

### 7.2 端到端测试

```
tests/e2e/
├── fixtures/      # 测试数据
├── specs/         # 测试规范
└── support/       # 测试支持文件
```

## 8. 环境配置

项目使用 `.env` 文件管理环境变量:

- `.env` - 所有环境共享的变量
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量

环境变量命名规范：所有环境变量以 `VITE_` 前缀开头，使用大写字母和下划线。

示例：

```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

## 9. 资源管理

静态资源组织方式：

```
assets/
├── icons/         # 图标资源
├── images/        # 图片资源
├── fonts/         # 字体资源
└── videos/        # 视频资源
```

## 10. 总结

Atom 前端项目采用清晰的目录结构和命名规范，确保代码组织的一致性和可维护性。开发人员应遵循本文档中的规范，确保项目结构的统一性。如需添加新的目录或变更组织方式，应先更新本文档并获得团队共识。 