# API实现计划

本文档列出了需要实现的API端点和对应的后端模块，作为从模拟数据到真实后端API改造的一部分。

## 创作者模块 (新建)

需要在后端创建新的`creator`模块，实现以下API端点：

### 1. 创作者统计数据 API

- **端点**: `GET /api/creator/stats`
- **控制器**: `CreatorStatsController.getStats`
- **服务**: `CreatorStatsService.getStats`
- **描述**: 获取创作者的统计数据，包括视图数、订阅者数、点赞数等
- **数据源**: 从视频、订阅、评论等集合中聚合数据

### 2. 创作者频道信息 API

- **端点**: `GET /api/creator/channel`
- **控制器**: `CreatorChannelController.getChannel`
- **服务**: `CreatorChannelService.getChannel`
- **描述**: 获取创作者的频道信息
- **数据源**: 用户集合中的创作者信息

### 3. 创作者视频列表 API

- **端点**: `GET /api/creator/videos`
- **控制器**: `CreatorVideoController.getVideos`
- **服务**: `CreatorVideoService.getVideos`
- **描述**: 获取创作者的视频列表
- **数据源**: 视频集合，过滤创作者ID

### 4. 创作者最近评论 API

- **端点**: `GET /api/creator/comments/recent`
- **控制器**: `CreatorCommentController.getRecentComments`
- **服务**: `CreatorCommentService.getRecentComments`
- **描述**: 获取创作者视频的最近评论
- **数据源**: 评论集合，关联视频和用户集合

### 5. 保存频道设置 API

- **端点**: `POST /api/creator/channel/settings`
- **控制器**: `CreatorChannelController.saveSettings`
- **服务**: `CreatorChannelService.saveSettings`
- **描述**: 保存创作者的频道设置
- **数据源**: 更新用户集合中的创作者信息

### 6. 保存视频品牌设置 API

- **端点**: `POST /api/creator/branding/settings`
- **控制器**: `CreatorBrandingController.saveSettings`
- **服务**: `CreatorBrandingService.saveSettings`
- **描述**: 保存创作者的视频品牌设置
- **数据源**: 创建或更新品牌设置集合

### 7. 获取视频分析数据 API

- **端点**: `GET /api/creator/analytics/video/:videoId`
- **控制器**: `CreatorAnalyticsController.getVideoAnalytics`
- **服务**: `CreatorAnalyticsService.getVideoAnalytics`
- **描述**: 获取特定视频的分析数据
- **数据源**: 视频观看记录、互动数据等

## 视频模块 (扩展)

需要扩展现有的`video`模块，实现以下API端点：

### 1. 视频上传 API

- **端点**: `POST /api/videos`
- **控制器**: `VideoController.uploadVideo`
- **服务**: `VideoService.uploadVideo`
- **描述**: 上传新视频
- **数据源**: 视频集合，文件存储服务

### 2. 视频更新 API

- **端点**: `PUT /api/videos/:id`
- **控制器**: `VideoController.updateVideo`
- **服务**: `VideoService.updateVideo`
- **描述**: 更新视频信息
- **数据源**: 视频集合

### 3. 视频章节管理 API

- **端点**: `POST /api/videos/:id/chapters`
- **控制器**: `VideoChapterController.addChapter`
- **服务**: `VideoChapterService.addChapter`
- **描述**: 为视频添加章节
- **数据源**: 章节集合

## 订阅模块 (扩展)

需要扩展现有的`subscription`模块，实现以下API端点：

### 1. 获取用户订阅 API

- **端点**: `GET /api/subscriptions`
- **控制器**: `SubscriptionController.getUserSubscriptions`
- **服务**: `SubscriptionService.getUserSubscriptions`
- **描述**: 获取用户的订阅列表
- **数据源**: 订阅集合，关联用户集合

### 2. 添加订阅 API

- **端点**: `POST /api/subscriptions/:channelId`
- **控制器**: `SubscriptionController.subscribeToChannel`
- **服务**: `SubscriptionService.subscribeToChannel`
- **描述**: 订阅频道
- **数据源**: 订阅集合

### 3. 取消订阅 API

- **端点**: `DELETE /api/subscriptions/:channelId`
- **控制器**: `SubscriptionController.unsubscribeFromChannel`
- **服务**: `SubscriptionService.unsubscribeFromChannel`
- **描述**: 取消订阅频道
- **数据源**: 订阅集合

## 评论模块 (扩展)

需要扩展现有的`comment`模块，实现以下API端点：

### 1. 获取视频评论 API

- **端点**: `GET /api/videos/:id/comments`
- **控制器**: `CommentController.getVideoComments`
- **服务**: `CommentService.getVideoComments`
- **描述**: 获取视频的评论列表
- **数据源**: 评论集合

### 2. 添加评论 API

- **端点**: `POST /api/videos/:id/comments`
- **控制器**: `CommentController.addComment`
- **服务**: `CommentService.addComment`
- **描述**: 添加评论
- **数据源**: 评论集合

## 数据库设计调整

基于API需求，需要创建或调整以下数据库集合：

### 1. 创作者品牌设置集合 (`creator_branding`)

```javascript
{
  _id: ObjectId,
  creatorId: ObjectId,
  watermark: {
    url: String,
    position: String,
    opacity: Number,
    size: Number
  },
  intro: {
    url: String,
    autoAdd: Boolean,
    transition: String
  },
  outro: {
    url: String,
    autoAdd: Boolean,
    transition: String,
    addSubscribeButton: Boolean
  },
  theme: {
    color: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. 视频观看记录集合调整 (`video_views`)

```javascript
{
  _id: ObjectId,
  videoId: ObjectId,
  userId: ObjectId,
  watchDuration: Number,
  completionPercentage: Number,
  deviceType: String,
  timestamp: Date
}
```

## 实现优先级

1. 创作者基本信息 API（频道信息、统计数据）
2. 创作者视频和评论 API
3. 视频上传和管理 API
4. 订阅管理 API
5. 评论功能 API
6. 品牌设置 API
7. 分析数据 API

## 下一步行动

1. 创建creator模块的基本结构
   - 模型定义
   - 控制器
   - 服务层
   - 路由配置

2. 实现创作者统计数据API
   - 聚合查询优化
   - 缓存策略
   - 权限控制 