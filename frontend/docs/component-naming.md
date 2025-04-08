# Atom Video 组件命名规范

## 组件分类与职责

我们的组件分为两类：Common 和 Business，它们有明确的职责划分和命名规范。

### Common 组件

Common 组件是纯展示型组件，不包含业务逻辑，可跨业务模块复用。

#### 命名规则
- 使用 PascalCase 命名法
- 名称应反映组件功能而非业务含义
- 相关组件应使用相同前缀
- 文件名与组件名一致

#### 示例
- `Button.vue` - 按钮组件
- `VideoCard.vue` - 视频卡片组件
- `VideoGrid.vue` - 视频网格组件
- `LoadingSpinner.vue` - 加载动画组件

#### 目录结构
```
components/
  common/
    button/
      Button.vue
      ToggleButton.vue
    video/
      VideoCard.vue
      VideoGrid.vue
    loading/
      LoadingSpinner.vue
    feedback/
      ErrorMessage.vue
      EmptyState.vue
```

### Business 组件

Business 组件是与特定业务逻辑相关的组件，通常由多个 Common 组件组合而成。

#### 命名规则
- 使用 PascalCase 命名法
- 名称应反映所属业务模块
- 不应包含 UI 相关后缀（如Card、Grid等）
- 文件名与组件名一致

#### 示例
- `Login.vue` - 登录业务组件
- `Profile.vue` - 用户资料业务组件
- `VideoDetail.vue` - 视频详情业务组件
- `Explore.vue` - 探索页业务组件

#### 目录结构
```
components/
  business/
    auth/
      Login.vue
      Register.vue
    user/
      Profile.vue
      Settings.vue
    video/
      VideoDetail.vue
      VideoUpload.vue
    feed/
      Home.vue
      Explore.vue
```

## 组件通信规范

### Common 组件
- 通过 props 接收数据
- 通过 events 向上传递事件
- 不应直接访问 store 或发起 API 请求
- Props 命名使用 camelCase

### Business 组件
- 可以访问 store 和发起 API 请求
- 可以使用路由功能
- 应通过 props 向 Common 组件传递数据
- 应监听并处理 Common 组件触发的事件

## 类型定义规范

- 所有组件的 props 和 events 应有明确的类型定义
- Common 组件应使用通用类型（如从 `@/types` 导入）
- Business 组件可以定义特定于业务的内部类型
- props 默认值应与其类型一致

## 样式规范

- Common 组件应使用 scoped styles
- 使用 CSS 变量实现主题支持
- 避免在 Common 组件中使用特定于业务的颜色和尺寸
- Business 组件可以覆盖 Common 组件的一些样式，但应限制在必要范围内

## 文档规范

- 组件应包含文件顶部的注释，说明用途和作者
- Props 应有完整的注释说明其用途和类型
- 复杂的组件应包含使用示例
- 组件应在 Storybook 中有对应的 story 