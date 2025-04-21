# Atom Video 前端

Atom Video是一个现代视频分享平台，本仓库包含前端部分的代码。前端采用Vue 3、TypeScript和Vite构建，提供流畅的用户体验和高性能的视频播放功能。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI组件库**: Naive UI
- **CSS框架**: TailwindCSS
- **HTTP客户端**: Axios
- **国际化**: Vue I18n
- **测试**: Vitest
- **组件文档**: Storybook

## 项目架构

Atom Video前端采用模块化、组件化的架构，遵循以下原则：

1. **关注点分离**: UI展示与业务逻辑分离
2. **组件复用**: 通用UI组件与业务组件分离
3. **类型安全**: 使用TypeScript确保类型安全
4. **状态集中**: 使用Pinia集中管理状态
5. **主题支持**: 使用CSS变量支持明暗主题

## 目录结构

```
frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 资源文件(图片、字体等)
│   ├── components/      # 组件
│   │   ├── common/      # 通用UI组件(与业务无关)
│   │   └── business/    # 业务组件(包含业务逻辑)
│   ├── composables/     # 组合式函数
│   ├── config/          # 配置文件
│   ├── constants/       # 常量定义
│   ├── directives/      # 自定义指令
│   ├── hooks/           # 自定义Hooks
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面组件
│   ├── router/          # 路由配置
│   ├── services/        # API服务
│   ├── stores/          # Pinia状态管理
│   ├── styles/          # 全局样式
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── .storybook/          # Storybook配置
├── docs/                # 文档
├── tests/               # 测试文件
└── vite.config.ts       # Vite配置
```

## 组件分类

### Common组件

Common组件是纯UI组件，不包含业务逻辑，可以跨模块复用。这些组件位于`src/components/common/`目录下，按功能分类：

- **button/**: 按钮相关组件
- **feedback/**: 用户反馈组件(消息提示、空状态等)
- **form/**: 表单相关组件
- **layout/**: 布局相关组件
- **loading/**: 加载状态组件
- **media/**: 媒体相关组件
- **navigation/**: 导航相关组件
- **search/**: 搜索相关组件
- **video/**: 视频相关组件

### Business组件

Business组件是包含特定业务逻辑的组件，通常由多个Common组件组合而成。这些组件位于`src/components/business/`目录下，按业务模块分类：

- **auth/**: 认证相关组件(登录、注册等)
- **channel/**: 频道相关组件
- **comment/**: 评论相关组件
- **error/**: 错误处理组件
- **explore/**: 探索页相关组件
- **feed/**: 信息流相关组件
- **library/**: 媒体库相关组件
- **notification/**: 通知相关组件
- **profile/**: 个人资料相关组件
- **search/**: 搜索结果相关组件
- **settings/**: 设置相关组件
- **tag/**: 标签相关组件
- **user/**: 用户相关组件
- **video/**: 视频播放、上传相关组件

## 功能模块

平台包含以下主要功能模块：

1. **认证(Auth)**: 用户注册、登录、密码重置
2. **首页(Home)**: 个性化推荐、热门视频
3. **探索(Explore)**: 分类浏览、发现内容
4. **视频详情(Video)**: 视频播放、互动、分享
5. **用户(User)**: 个人资料、设置
6. **频道(Channel)**: 创作者频道、订阅
7. **搜索(Search)**: 全文搜索、过滤结果
8. **媒体库(Library)**: 历史记录、收藏、订阅
9. **上传(Upload)**: 视频上传、管理
10. **通知(Notification)**: 消息通知、订阅更新

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

#### 前后端联调

```bash
pnpm dev
```
#### 使用模拟数据

```bash
pnpm dev:mock
```

### 测试账号

平台提供了多种测试账号，方便在开发环境中测试不同用户角色和权限：

#### 管理员账号
```
账号: admin@atomvideo.com
密码: Admin@123
```

#### 创作者账号
```
账号: creator@atomvideo.com
密码: Password123
```

#### 普通用户账号
```
账号: user@atomvideo.com
密码: Password123
```

更多详情请参考[测试账号指南](../docs/development/test-accounts.md)。

### 构建生产版本

```bash
pnpm build:prod
```

### 运行测试

```bash
pnpm test
```

### 启动Storybook

```bash
pnpm storybook
```

## 组件开发规范

我们遵循严格的组件开发规范，详见[组件命名规范](./docs/component-naming.md)。

## 主题系统

Atom Video支持明暗主题切换，通过CSS变量实现。主题定义位于`src/styles/themes`目录。

## API服务

所有API请求都通过服务模块进行，位于`src/services`目录。使用Axios作为HTTP客户端，支持拦截器、响应处理和错误处理。

## 状态管理

使用Pinia进行状态管理，存储定义位于`src/stores`目录。每个业务模块有自己的store。

## 类型安全

严格使用TypeScript确保类型安全，类型定义位于`src/types`目录。

## 国际化

支持多语言，使用Vue I18n实现。语言文件位于`src/locales`目录。

## 贡献指南

1. 确保遵循组件开发规范
2. 为新组件编写Storybook故事
3. 添加适当的单元测试
4. 确保通过所有测试和lint检查
5. 提交PR前运行`pnpm build:check`

# 代码规范更新

## 组件命名规范

为提高代码的一致性和可维护性，我们对组件命名进行了规范化：

- **业务组件**：采用`[模块名][功能名]Component.vue`格式，如`VideoCardComponent.vue`
- **页面组件**：采用`[模块名][功能名]Page.vue`格式，如`VideoDetailPage.vue`

详细规范请查看 [组件命名规范文档](./docs/component-naming.md)。

此规范将帮助我们：
- 区分组件类型和用途
- 避免命名冲突
- 提高代码可读性

请所有开发者在创建新组件时遵循此规范。

## Mock模式与离线功能实现

本文档描述了Atom Video前端项目中的Mock模式和离线功能实现。

### 概述

Mock模式是一种允许前端应用在没有后端API服务的情况下运行的开发和测试模式。离线模式则允许在网络连接不可用时仍能提供有限的功能。两者结合使用，可以提供更好的开发和用户体验。

### 实现原理

#### 1. Mock数据系统

核心文件：
- `services/mockData.ts` - 提供模拟数据生成器
- `services/mockHandlers.ts` - 注册API路径处理器
- `utils/mockUtils.ts` - 提供Mock相关的工具函数
- `services/api.ts` - 提供API调用的实现，支持Mock模式

#### 2. 本地存储系统

- `utils/storageUtils.ts` - 提供安全的本地存储操作

#### 3. 离线支持

- `utils/mockUtils.ts` - 提供离线模式检测和管理
- `services/api/errorHandler.ts` - 网络错误处理与离线模式切换
- `services/api/client.ts` - API客户端，支持离线模式检测

### 使用方法

#### 开发者使用

1. **启用Mock模式**：
   - 设置环境变量 `VITE_USE_MOCK=true`
   - 或者在控制台使用 `window.devTools.enableMockMode()`

2. **启用离线模式**：
   - 在控制台使用 `window.devTools.enableOfflineMode()`
   - 或断开网络连接（会自动启用）

3. **切换模式**：
   - `window.devTools.toggleMockMode()`
   - `window.devTools.toggleOfflineMode()`

4. **检查当前状态**：
   - `window.devTools.isMockMode()`
   - `window.devTools.isOfflineMode()`

#### 添加新的Mock处理器

在`services/mockHandlers.ts`中的`registerAllMockHandlers`函数中添加新的处理器：

```typescript
registerMockHandler({
  method: 'GET', // HTTP方法
  url: '/api/new-endpoint', // API端点路径，可以是字符串或正则表达式
  handler: (url, params) => {
    // 处理逻辑，返回模拟数据
    return {
      success: true,
      data: { /* 模拟数据 */ },
    };
  },
});
```

#### 添加新的模拟数据生成器

在`services/mockData.ts`中添加新的数据生成函数：

```typescript
export const getNewMockData = (id: string): SomeType => {
  // 生成模拟数据的逻辑
  return {
    id,
    // 其他字段
  };
};
```

### 工作流程

1. 应用启动时会检查是否处于Mock模式或离线模式
2. 如果是，注册所有Mock处理器
3. 在API调用时，检查是否命中Mock处理器
4. 网络错误会自动切换到离线模式并使用Mock数据
5. 用户相关的操作会存储在本地存储中

### 离线模式功能限制

在离线模式下，用户可以：
- 浏览已加载的内容
- 查看历史记录
- 播放已缓存的视频
- 添加视频到收藏夹
- 点赞/取消点赞视频（本地操作，后续联网时会同步）

限制的功能：
- 无法上传新视频
- 无法搜索新内容
- 无法获取最新推荐

### 调试技巧

1. 在开发模式下，所有Mock工具都暴露在`window.devTools`对象中
2. 在控制台可以直接使用这些工具测试不同的场景
3. 通过浏览器网络面板的"离线"选项可以模拟网络断开

### 性能考虑

- 本地存储有大小限制（一般5MB左右）
- 使用`cleanupOldestItems`函数定期清理过时的数据
- 使用`getStorageUsage`和`isStorageNearLimit`监控存储使用情况

### 注意事项

1. Mock数据只应该在开发和测试环境中使用
2. 生产环境中只有在网络故障时才会自动启用离线模式
3. 离线功能应作为降级措施，而非主要功能
