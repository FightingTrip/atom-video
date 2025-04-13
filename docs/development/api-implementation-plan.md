# API实现计划

本文档列出了需要实现的API端点和对应的后端模块，作为从Express到NestJS框架迁移的一部分。

## 创作者模块

需要在NestJS中实现`creator`模块，包含以下API端点：

### 1. 创作者统计数据 API

- **端点**: `GET /api/creator/stats`
- **控制器**: `CreatorStatsController.getStats`
- **服务**: `CreatorStatsService.getStats`
- **描述**: 获取创作者的统计数据，包括视图数、订阅者数、点赞数等
- **数据来源**: 通过Prisma从视频、订阅、评论等表中聚合数据

### 2. 创作者频道信息 API

- **端点**: `GET /api/creator/channel`
- **控制器**: `CreatorChannelController.getChannel`
- **服务**: `CreatorChannelService.getChannel`
- **描述**: 获取创作者的频道信息
- **数据来源**: 用户表中的创作者信息

### 3. 创作者视频列表 API

- **端点**: `GET /api/creator/videos`
- **控制器**: `CreatorVideoController.getVideos`
- **服务**: `CreatorVideoService.getVideos`
- **描述**: 获取创作者的视频列表
- **数据来源**: 视频表，按创作者ID过滤

### 4. 创作者最近评论 API

- **端点**: `GET /api/creator/comments/recent`
- **控制器**: `CreatorCommentController.getRecentComments`
- **服务**: `CreatorCommentService.getRecentComments`
- **描述**: 获取创作者视频的最近评论
- **数据来源**: 评论表，关联视频和用户表

### 5. 保存视频品牌设置 API

- **端点**: `POST /api/creator/branding/settings`
- **控制器**: `CreatorBrandingController.saveSettings`
- **服务**: `CreatorBrandingService.saveSettings`
- **描述**: 保存创作者的视频品牌设置
- **数据来源**: 创建或更新品牌设置表

## 视频模块

需要实现`video`模块，包含以下API端点：

### 1. 视频上传 API

- **端点**: `POST /api/videos`
- **控制器**: `VideoController.uploadVideo`
- **服务**: `VideoService.uploadVideo`
- **描述**: 上传新视频
- **数据来源**: 视频表，文件存储服务

### 2. 视频更新 API

- **端点**: `PUT /api/videos/:id`
- **控制器**: `VideoController.updateVideo`
- **服务**: `VideoService.updateVideo`
- **描述**: 更新视频信息
- **数据来源**: 视频表

## 订阅模块

需要实现`subscription`模块，包含以下API端点：

### 1. 获取用户订阅 API

- **端点**: `GET /api/subscriptions`
- **控制器**: `SubscriptionController.getUserSubscriptions`
- **服务**: `SubscriptionService.getUserSubscriptions`
- **描述**: 获取用户的订阅列表
- **数据来源**: 订阅表，关联用户表

### 2. 添加订阅 API

- **端点**: `POST /api/subscriptions/:channelId`
- **控制器**: `SubscriptionController.subscribeToChannel`
- **服务**: `SubscriptionService.subscribeToChannel`
- **描述**: 订阅频道
- **数据来源**: 订阅表

### 3. 取消订阅 API

- **端点**: `DELETE /api/subscriptions/:channelId`
- **控制器**: `SubscriptionController.unsubscribeFromChannel`
- **服务**: `SubscriptionService.unsubscribeFromChannel`
- **描述**: 取消订阅频道
- **数据来源**: 订阅表

## 评论模块

需要实现`comment`模块，包含以下API端点：

### 1. 获取视频评论 API

- **端点**: `GET /api/videos/:id/comments`
- **控制器**: `CommentController.getVideoComments`
- **服务**: `CommentService.getVideoComments`
- **描述**: 获取视频的评论列表
- **数据来源**: 评论表

### 2. 添加评论 API

- **端点**: `POST /api/videos/:id/comments`
- **控制器**: `CommentController.addComment`
- **服务**: `CommentService.addComment`
- **描述**: 添加评论
- **数据来源**: 评论表

## Prisma数据模型设计

基于API需求，需要设计以下Prisma模型：

### 1. 创作者品牌设置模型

```prisma
model CreatorBranding {
  id          Int      @id @default(autoincrement())
  creatorId   Int      @unique
  creator     User     @relation(fields: [creatorId], references: [id])
  
  watermarkUrl     String?
  watermarkPosition String?
  watermarkOpacity  Float?
  watermarkSize     Float?
  
  introUrl     String?
  introAutoAdd Boolean @default(false)
  introTransition String?
  
  outroUrl     String?
  outroAutoAdd Boolean @default(false)
  outroTransition String?
  outroSubscribeButton Boolean @default(false)
  
  themeColor   String?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 2. 视频观看记录模型

```prisma
model VideoView {
  id          Int      @id @default(autoincrement())
  videoId     Int
  video       Video    @relation(fields: [videoId], references: [id])
  userId      Int?
  user        User?    @relation(fields: [userId], references: [id])
  
  watchDuration       Int
  completionPercentage Float
  deviceType          String?
  
  createdAt   DateTime @default(now())
}
```

## 实现优先级

1. 创作者基本信息 API（频道信息、统计数据）
2. 创作者视频和评论 API
3. 视频上传和管理 API
4. 订阅管理 API
5. 评论功能 API
6. 品牌设置 API

## NestJS模块结构设计

每个模块应遵循以下结构：

```
module/
├── dto/                  # 数据传输对象
│   ├── create-xxx.dto.ts
│   └── update-xxx.dto.ts
├── entities/             # 实体定义
│   └── xxx.entity.ts
├── xxx.controller.ts     # 控制器
├── xxx.service.ts        # 服务
├── xxx.module.ts         # 模块定义
└── xxx.spec.ts           # 测试文件
``` 