# Atom Video前端开发文档

## Mock系统与离线功能说明

本文档记录了Atom Video前端项目的Mock系统和离线功能的实现原理和使用方法。

### 系统架构

#### 核心组件

1. **Mock数据系统**：
   - `services/mockData.ts` - 提供模拟数据生成器
   - `services/mockHandlers.ts` - 注册API路径处理器
   - `utils/mockUtils.ts` - 提供Mock相关的工具函数
   - `services/api.ts` - 提供API调用的实现，支持Mock模式

2. **本地存储系统**：
   - `utils/storageUtils.ts` - 提供安全的本地存储操作

3. **离线支持**：
   - `utils/mockUtils.ts` - 提供离线模式检测和管理
   - `services/api/errorHandler.ts` - 网络错误处理与离线模式切换
   - `services/api/client.ts` - API客户端，支持离线模式检测

#### 系统功能特点

- 自动检测网络状态变化，无网络时自动进入离线模式
- 所有用户操作都保存在本地存储，保证离线体验
- Mock数据生成逻辑与API处理分离，易于维护
- TypeScript类型安全，避免隐式any类型错误
- 开发模式下提供控制台工具，便于调试

### 最近更新

1. **类型安全改进**：
   - 修复了`api.ts`中`MockHandler`接口的类型定义
   - 将`handler: any | ((url: string, data?: any) => any)`改为更精确的`handler: (url: string, data?: Record<string, any>) => any)`
   - 解决了mockHandlers.ts中的隐式any类型错误

2. **模块关系梳理**：
   - `services/`目录下的mock功能是面向生产环境的，支持离线模式
   - `mock/`目录下的文件主要用于开发测试，不会出现在生产环境

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

```typescript
registerMockHandler({
  method: 'GET', // HTTP方法
  url: '/api/new-endpoint', // API端点路径，可以是字符串或正则表达式
  handler: (url: string, params?: Record<string, any>) => {
    // 处理逻辑，返回模拟数据
    return {
      success: true,
      data: { /* 模拟数据 */ },
    };
  },
});
```

#### 添加新的模拟数据生成器

```typescript
export const getNewMockData = (id: string): SomeType => {
  // 生成模拟数据的逻辑
  return {
    id,
    // 其他字段
  };
};
```

### 离线模式功能

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

### 最佳实践

1. 本地存储有大小限制（一般5MB左右），使用`cleanupOldestItems`函数定期清理过时数据
2. 生产环境中应该只在网络故障时自动启用离线模式，而不主动使用mock数据
3. 编写新的API服务时应考虑离线降级方案，确保良好的用户体验
4. 定期测试离线功能，确保系统在网络状态变化时表现正常

### 注意事项

1. Mock数据只应该在开发和测试环境中使用
2. 生产环境中只有在网络故障时才会自动启用离线模式
3. 离线功能应作为降级措施，而非主要功能
4. 当网络恢复时，应及时同步本地操作到服务器

# 模拟数据库系统文档

## 概述
本项目实现了一个完整的模拟数据库系统，用于前端开发和测试。系统包括以下主要组件：

1. **模拟数据库** - 提供数据存储和CRUD操作
2. **模拟API** - 使用MSW拦截API请求并提供模拟响应
3. **数据迁移系统** - 处理模型结构变更和数据迁移
4. **开发工具** - 可视化界面用于管理和查看模拟数据

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
import { initMockDatabase } from './utils/mockInitializer';

// 在应用启动时调用
initMockDatabase();
```

### 检查数据库初始化状态
```typescript
import { isMockDatabaseInitialized } from './utils/mockInitializer';

if (isMockDatabaseInitialized()) {
  // 数据库已初始化，可以使用
} else {
  // 需要先初始化数据库
}
```

### 重置模拟数据库
```typescript
import { resetMockDatabase } from './utils/mockInitializer';

// 清除数据并重新初始化
resetMockDatabase();
```

### 检查和执行迁移
```typescript
import { checkNeedsMigration, runMigrations } from './utils/mockDbMigration';

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