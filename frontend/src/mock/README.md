# 模拟数据库系统文档

## 概述
本项目实现了一个完整的模拟数据库系统，用于前端开发和测试。系统包括以下主要组件：

1. **模拟数据库** - 提供数据存储和CRUD操作
2. **模拟API** - 使用MSW拦截API请求并提供模拟响应
3. **数据迁移系统** - 处理模型结构变更和数据迁移
4. **开发工具** - 可视化界面用于管理和查看模拟数据

## 最新更新

### 性能优化
- 使用`markRaw`包装图标组件，防止不必要的响应式处理，提高性能
- 减少不必要的响应式对象创建，避免Vue警告

### API处理器修复
- 修复了创作者API处理程序注册问题，确保所有API端点能够正确响应
- 解决了以下API端点的模拟处理：
  - `/api/creator/stats`
  - `/api/creator/videos`
  - `/api/creator/comments`
  - `/api/creator/trends/content`
  - `/api/creator/trends/views`
  - `/api/creator/channel`
  - `/api/creator/trends/engagement`
  - `/api/creator/trends/revenue`
  - `/api/creator/top-videos`

### 认证处理优化
- 通知API在开发环境下即使未认证也能返回成功响应
- 确保`/api/user/notifications/unread-count`在开发环境中能正确工作

### UI组件改进
- 添加缺失的`NSkeleton`组件到Naive UI导入，修复组件解析错误

## 模拟数据库迁移系统

### 背景
在开发过程中，数据模型经常需要变更和升级。为了保持前端客户端与模拟数据的兼容性，我们实现了一个数据迁移系统，以自动处理模型变更并迁移已有数据。

### 组件结构

1. **模型定义** - `mock/models.ts`
   - 定义所有数据模型的接口
   - 包括用户、视频、评论等核心模型

2. **数据库实现** - `mock/mockDb.ts`
   - 提供数据存储和查询功能
   - 实现各种CRUD操作和业务逻辑

3. **迁移工具** - `utils/mockDbMigration.ts`
   - 管理数据库版本
   - 执行数据迁移操作
   - 提供迁移API

4. **开发工具界面** - `components/mock/MockDevTools.vue`
   - 可视化界面用于管理模拟数据
   - 包含迁移状态显示和操作按钮

5. **模拟接口** - `mock/dataGenerationHandler.ts`
   - 提供数据生成API
   - 支持动态创建测试数据

### 迁移系统工作原理

1. **版本管理**
   - 使用localStorage存储当前数据库版本号
   - 通过比较版本号确定是否需要迁移

2. **自动迁移**
   - 应用启动时自动检查数据库版本
   - 如需迁移，自动执行相应的迁移操作

3. **手动迁移**
   - 通过开发工具界面手动触发迁移
   - 显示当前版本和迁移状态

### 当前迁移版本

#### 版本1：用户location属性迁移
- 将用户顶级location属性迁移到social.location
- 兼容旧版本API同时访问两个位置
- 更新所有用户创建和更新逻辑

## 使用方法

### 初始化模拟数据库
```typescript
import { initMockDatabase } from '@/utils/mockInitializer';

// 在应用启动时调用
initMockDatabase();
```

### 检查数据库初始化状态
```typescript
import { isMockDatabaseInitialized } from '@/utils/mockInitializer';

if (isMockDatabaseInitialized()) {
  // 数据库已初始化，可以使用
} else {
  // 需要先初始化数据库
}
```

### 重置模拟数据库
```typescript
import { resetMockDatabase } from '@/utils/mockInitializer';

// 清除数据并重新初始化
resetMockDatabase();
```

### 检查和执行迁移
```typescript
import { checkNeedsMigration, runMigrations } from '@/utils/mockDbMigration';

// 检查是否需要迁移
if (checkNeedsMigration()) {
  // 执行迁移
  await runMigrations();
}
```

## 开发工具使用

开发界面提供了以下功能：

1. **状态** - 显示模拟数据库的状态和初始化情况
2. **数据** - 提供数据生成和管理工具
3. **迁移** - 显示迁移状态和执行迁移操作

### 数据生成

可以生成以下类型的测试数据：
- 用户
- 视频
- 评论
- 举报

### 迁移操作

- **运行迁移** - 执行所有待执行的迁移操作
- **重置迁移状态** - 将迁移状态重置为初始状态

## 添加新迁移

当需要添加新的数据模型变更时，按照以下步骤操作：

1. 增加 `CURRENT_MIGRATION_VERSION` 版本号
2. 在 `mockDbMigration.ts` 中添加新的迁移函数
3. 在 `runMigrations` 中调用新的迁移函数
4. 更新模型定义和相关实现代码

示例：
```typescript
/**
 * 迁移到版本2：增加用户偏好设置
 */
async function migrateToVersion2(): Promise<void> {
  console.log('[Migration] 执行迁移到版本2：添加用户偏好设置');
  
  try {
    // 获取所有用户数据
    const users = await mockDb.getAllUsers();
    
    // 为每个用户添加默认偏好设置
    for (const user of users) {
      if (!user.preferences) {
        const updateData: Partial<User> = {
          preferences: {
            categories: [],
            tags: [],
            lastWatched: []
          }
        };
        
        await mockDb.updateUser(user.id, updateData);
      }
    }
    
    console.log('[Migration] 成功添加用户偏好设置');
  } catch (error) {
    console.error('[Migration] 用户偏好设置迁移失败:', error);
    throw error;
  }
}
```

## 注意事项

1. 模拟数据库仅用于开发和测试环境
2. 数据存储在浏览器的localStorage中，关闭浏览器或清除缓存会导致数据丢失
3. 大量数据可能会影响浏览器性能，建议定期清理
4. 迁移脚本应保持幂等性，能够安全地多次执行 