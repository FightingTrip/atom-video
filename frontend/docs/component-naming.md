# 组件命名规范

本文档详细说明了Atom-Video项目中的组件命名规范，以保证代码库的一致性和可维护性。

## 命名约定

### 业务组件

所有位于`components/business`目录下的业务组件应遵循以下命名约定：

- **格式**：`[模块名][功能名]Component.vue`
- **示例**：
  - `VideoCardComponent.vue` 
  - `UserProfileComponent.vue`
  - `CommentListComponent.vue`

### 页面组件

所有位于`pages`目录下的页面组件应遵循以下命名约定：

- **格式**：`[模块名][功能名]Page.vue`
- **示例**：
  - `VideoDetailPage.vue`
  - `ProfilePage.vue`
  - `HomePage.vue`

### 通用组件

所有位于`components/common`目录下的通用组件应遵循以下命名约定：

- **格式**：`[功能名].vue`
- **示例**：
  - `Button.vue`
  - `Modal.vue`
  - `Icon.vue`

## 文件头注释规范

每个组件文件都应该包含标准化的文件头注释：

```vue
/**
 * @file [文件名].vue
 * @description [组件描述] - [组件类型说明]
 * @author Atom Video Team
 * @date [最后更新日期]
 */
```

## 组件类型说明

为了清晰地区分不同类型的组件，我们在文件头注释中明确标识组件的类型：

- **业务组件**：实现特定业务功能的组件
- **页面组件**：呈现整个页面的组件，通常由多个业务组件组成
- **通用组件**：可在多个场景中复用的基础UI组件

## 引用路径示例

```js
// 引用业务组件
import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';

// 引用页面组件
import VideoDetailPage from '@/pages/video/VideoDetailPage.vue';

// 引用通用组件
import Button from '@/components/common/Button.vue';
```

## 测试文件命名

测试文件的命名应与被测试的组件保持一致：

- **格式**：`[组件名].test.[js|ts]`
- **示例**：
  - `VideoCardComponent.test.ts`
  - `UserProfileComponent.test.ts`

## 命名规范的好处

1. **清晰的组件类型识别**：通过命名可以立即知道组件的类型和用途
2. **避免命名冲突**：添加后缀可减少与其他组件或第三方库冲突的可能性
3. **更一致的代码库结构**：统一的命名规则提高代码可读性和可维护性
4. **更明确的引用路径**：避免混淆类似名称的组件

## 重命名历史

以下是根据此规范重命名的部分关键组件：

- `VideoCard.vue` → `VideoCardComponent.vue`
- `VideoPlayer.vue` → `VideoPlayerComponent.vue`
- `Home.vue` → `HomeComponent.vue`
- `CommentList.vue` → `CommentListComponent.vue`
- `Profile.vue` → `UserProfileComponent.vue`
- `Settings.vue` → `UserSettingsComponent.vue`

## 注意事项

- 重命名组件后必须更新所有引用该组件的导入语句
- 确保更新组件的测试文件名，保持一致性
- 在组件文件头部添加正确的注释，明确标识组件类型

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