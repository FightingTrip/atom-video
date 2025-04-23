# 前端模拟系统文档

## 系统概述

Atom Video前端模拟系统提供了完整的模拟数据和API响应，使前端开发可以在无后端环境下进行。系统由以下几个主要部分组成：

1. **模拟数据库** - 基于LocalStorage实现的持久化存储
2. **模拟API处理器** - 使用MSW库拦截网络请求并返回模拟数据
3. **数据迁移系统** - 处理数据模型变更
4. **开发工具** - 用于调试和管理模拟数据

## 文件结构

### 核心文件

- `frontend/src/utils/mockData.ts` - 初始模拟数据
- `frontend/src/utils/mockUtils.ts` - 工具函数（切换模拟模式等）
- `frontend/src/utils/mockDbMigration.ts` - 数据库迁移系统
- `frontend/src/utils/mockInitializer.ts` - 初始化模拟数据库
- `frontend/src/utils/mockMapper.ts` - 数据映射和转换

### API处理器

- `frontend/src/mock/browser.ts` - MSW浏览器配置
- `frontend/src/mock/handlers.ts` - 主API处理器
- `frontend/src/mock/creatorHandlers.ts` - 创作者API处理器
- `frontend/src/mock/userHandlers.ts` - 用户API处理器
- `frontend/src/mock/videoHandlers.ts` - 视频API处理器

## 最近更新

### 结构改进 (2023-11)
- 将原`utils/mock`目录下的文件整合到顶级`mock`目录，简化结构
- 移除冗余文件，包括`utils/mock/users.ts`和`utils/mock/videos.ts`

### 性能优化 (2023-10)
- 在DashboardPage.vue中使用`markRaw`包装图标组件，避免不必要的响应式处理
- 优化组件导入，减少内存占用

### API处理改进
- 修复创作者API处理程序注册，确保所有API端点正确工作
- 改进未授权请求处理，在开发环境下允许通知API未认证时仍返回有效数据
- 添加用户通知计数API模拟处理

## 使用说明

### 开启/关闭模拟模式

可以通过以下方式控制模拟模式：

1. 通过环境变量：设置`VITE_USE_MOCK`为`true`或`false`
2. 通过localStorage：设置`force_mock_mode`为`true`
3. 通过API：
   ```javascript
   import { enableMockMode, disableMockMode, toggleMockMode } from '@/utils/mockUtils';
   
   // 启用模拟模式
   enableMockMode();
   
   // 关闭模拟模式
   disableMockMode();
   
   // 切换模拟模式
   toggleMockMode();
   ```

### 重置模拟数据

```javascript
import { resetMockData } from '@/utils/mockData';

// 重置所有模拟数据
resetMockData();
```

## 数据迁移系统

当模拟数据结构需要变更时，可以使用数据迁移系统来保持数据一致性。迁移步骤：

1. 在`mockDbMigration.ts`中更新数据库版本
2. 添加新的迁移函数
3. 实现数据转换逻辑

详细示例请参考`mockDbMigration.ts`文件。 