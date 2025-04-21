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