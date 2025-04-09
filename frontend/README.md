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
