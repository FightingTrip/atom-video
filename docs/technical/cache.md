# 缓存策略

## 1. 缓存选型

Atom Video 使用 Redis 作为缓存系统，主要考虑以下因素：

- 高性能的内存存储
- 丰富的数据结构
- 持久化支持
- 集群部署能力

## 2. 缓存策略

### 2.1 用户数据缓存

```typescript
// 用户信息缓存
const userCache = {
  key: `user:${userId}`,
  ttl: 3600, // 1小时
  fields: ['id', 'username', 'avatar', 'bio']
};

// 用户统计缓存
const userStatsCache = {
  key: `user:${userId}:stats`,
  ttl: 300, // 5分钟
  fields: ['videos', 'subscribers', 'subscriptions']
};
```

### 2.2 视频数据缓存

```typescript
// 视频信息缓存
const videoCache = {
  key: `video:${videoId}`,
  ttl: 3600, // 1小时
  fields: ['id', 'title', 'description', 'thumbnail', 'duration', 'views', 'likes']
};

// 视频列表缓存
const videoListCache = {
  key: `videos:${page}:${limit}:${sort}`,
  ttl: 300, // 5分钟
  fields: ['id', 'title', 'thumbnail', 'duration', 'views', 'likes']
};
```

### 2.3 评论数据缓存

```typescript
// 评论列表缓存
const commentListCache = {
  key: `video:${videoId}:comments:${page}:${limit}`,
  ttl: 300, // 5分钟
  fields: ['id', 'content', 'createdAt', 'user']
};
```

## 3. 缓存更新策略

### 3.1 写操作更新

- 创建/更新数据时，同时更新缓存
- 删除数据时，同时删除缓存
- 批量操作时，使用事务确保一致性

### 3.2 读操作更新

- 缓存未命中时，从数据库读取并更新缓存
- 使用互斥锁防止缓存击穿
- 设置合理的过期时间

## 4. 缓存预热

### 4.1 定时预热

- 热门视频列表
- 用户排行榜
- 推荐内容

### 4.2 事件驱动预热

- 新视频发布
- 用户关注
- 视频点赞

## 5. 缓存监控

### 5.1 性能监控

- 缓存命中率
- 响应时间
- 内存使用率

### 5.2 告警机制

- 缓存服务异常
- 命中率过低
- 内存使用过高

## 6. 缓存优化

### 6.1 数据结构优化

- 使用合适的数据结构
- 压缩存储数据
- 避免大 key

### 6.2 配置优化

- 合理设置过期时间
- 调整内存策略
- 优化持久化配置 