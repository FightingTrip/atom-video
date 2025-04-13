# 创作者 API

## 概述

本文档描述了 Atom Video 平台的创作者相关 API。

## 目录

- [创作者 API](#创作者-api)
  - [概述](#概述)
  - [目录](#目录)
  - [获取创作者统计数据](#获取创作者统计数据)
    - [请求](#请求)
    - [响应](#响应)
  - [获取创作者频道信息](#获取创作者频道信息)
    - [请求](#请求-1)
    - [响应](#响应-1)
  - [获取创作者视频列表](#获取创作者视频列表)
    - [请求](#请求-2)
    - [响应](#响应-2)
  - [获取创作者最近评论](#获取创作者最近评论)
    - [请求](#请求-3)
    - [响应](#响应-3)
  - [保存频道设置](#保存频道设置)
    - [请求](#请求-4)
    - [响应](#响应-4)
  - [保存视频品牌设置](#保存视频品牌设置)
    - [请求](#请求-5)
    - [响应](#响应-5)
  - [获取视频分析数据](#获取视频分析数据)
    - [请求](#请求-6)
    - [响应](#响应-6)
  - [错误响应](#错误响应)

## 获取创作者统计数据

### 请求

```http
GET /api/creator/stats
Authorization: Bearer jwt_token
```

### 响应

```json
{
  "views": {
    "value": 12580,
    "trend": 5.2
  },
  "subscribers": {
    "value": 835,
    "trend": 2.8
  },
  "likes": {
    "value": 3248,
    "trend": 8.7
  },
  "comments": {
    "value": 947,
    "trend": 3.5
  },
  "watchTime": {
    "value": 4235,
    "trend": 7.2
  },
  "videos": {
    "value": 24,
    "recentCount": 3
  }
}
```

## 获取创作者频道信息

### 请求

```http
GET /api/creator/channel
Authorization: Bearer jwt_token
```

### 响应

```json
{
  "id": "channel_id",
  "name": "频道名称",
  "description": "频道描述",
  "bannerUrl": "横幅URL",
  "avatarUrl": "头像URL",
  "themeColor": "#58a6ff",
  "subscriberCount": 835,
  "totalViews": 12580,
  "verified": true,
  "createdAt": "2024-04-04T10:00:00Z"
}
```

## 获取创作者视频列表

### 请求

```http
GET /api/creator/videos
Authorization: Bearer jwt_token

# 查询参数
?page=1
&limit=10
&status=published    # 可选: published, drafts, scheduled
&sort=latest         # 可选: latest, popular, oldest
```

### 响应

```json
{
  "total": 24,
  "page": 1,
  "limit": 10,
  "videos": [
    {
      "id": "video_id",
      "title": "视频标题",
      "description": "视频描述",
      "thumbnailUrl": "封面URL",
      "duration": 120,
      "viewCount": 1000,
      "likeCount": 100,
      "commentCount": 50,
      "visibility": "PUBLIC",
      "publishedAt": "2024-04-04T10:00:00Z",
      "createdAt": "2024-04-03T10:00:00Z"
    }
  ]
}
```

## 获取创作者最近评论

### 请求

```http
GET /api/creator/comments/recent
Authorization: Bearer jwt_token

# 查询参数
?limit=5
```

### 响应

```json
{
  "comments": [
    {
      "id": "comment_id",
      "content": "评论内容",
      "createdAt": "2024-04-04T10:00:00Z",
      "status": "已审核",
      "video": {
        "id": "video_id",
        "title": "视频标题"
      },
      "user": {
        "id": "user_id",
        "nickname": "用户昵称",
        "avatar": "头像URL"
      }
    }
  ]
}
```

## 保存频道设置

### 请求

```http
POST /api/creator/channel/settings
Content-Type: application/json
Authorization: Bearer jwt_token

{
  "name": "频道名称",
  "description": "频道描述",
  "themeColor": "#58a6ff",
  "avatar": "文件对象或Base64",
  "banner": "文件对象或Base64"
}
```

### 响应

```json
{
  "id": "channel_id",
  "name": "频道名称",
  "description": "频道描述",
  "bannerUrl": "新的横幅URL",
  "avatarUrl": "新的头像URL",
  "themeColor": "#58a6ff",
  "updatedAt": "2024-04-04T10:00:00Z"
}
```

## 保存视频品牌设置

### 请求

```http
POST /api/creator/branding/settings
Content-Type: application/json
Authorization: Bearer jwt_token

{
  "watermark": {
    "image": "Base64编码图像",
    "position": "bottomRight",
    "opacity": 70,
    "size": 15
  },
  "intro": {
    "video": "Base64编码视频",
    "autoAdd": true,
    "transition": "fade"
  },
  "outro": {
    "video": "Base64编码视频",
    "autoAdd": true,
    "transition": "fade",
    "addSubscribeButton": true
  },
  "theme": {
    "color": "58a6ff"
  }
}
```

### 响应

```json
{
  "watermark": {
    "url": "水印URL",
    "position": "bottomRight",
    "opacity": 70,
    "size": 15
  },
  "intro": {
    "url": "片头URL",
    "autoAdd": true,
    "transition": "fade"
  },
  "outro": {
    "url": "片尾URL",
    "autoAdd": true,
    "transition": "fade",
    "addSubscribeButton": true
  },
  "theme": {
    "color": "58a6ff"
  },
  "updatedAt": "2024-04-04T10:00:00Z"
}
```

## 获取视频分析数据

### 请求

```http
GET /api/creator/analytics/video/:videoId
Authorization: Bearer jwt_token

# 查询参数
?period=30d    # 可选: 7d, 30d, 90d, 365d
```

### 响应

```json
{
  "overview": {
    "views": 1250,
    "watchTime": 18500,
    "avgWatchDuration": 120,
    "likes": 85,
    "comments": 32,
    "shares": 15
  },
  "trends": {
    "dates": ["2024-03-01", "2024-03-02", "..."],
    "views": [120, 145, "..."],
    "watchTime": [1800, 2100, "..."]
  },
  "demographics": {
    "age": [
      { "group": "18-24", "percentage": 35 },
      { "group": "25-34", "percentage": 45 },
      { "group": "35-44", "percentage": 15 },
      { "group": "45+", "percentage": 5 }
    ],
    "devices": [
      { "type": "desktop", "percentage": 65 },
      { "type": "mobile", "percentage": 30 },
      { "type": "tablet", "percentage": 5 }
    ]
  },
  "retention": {
    "points": [
      { "second": 0, "percentage": 100 },
      { "second": 30, "percentage": 90 },
      { "second": 60, "percentage": 75 },
      { "second": 90, "percentage": 60 },
      { "second": "...", "percentage": "..." }
    ]
  }
}
```

## 错误响应

所有 API 在发生错误时都会返回以下格式的响应：

```json
{
  "message": "错误信息",
  "code": "错误代码"
}
```

常见的错误代码：

- `NOT_CREATOR`: 用户不是创作者
- `UNAUTHORIZED`: 未授权
- `FORBIDDEN`: 禁止访问
- `VIDEO_NOT_FOUND`: 视频不存在
- `INVALID_FILE`: 无效的文件
- `FILE_TOO_LARGE`: 文件太大
- `ANALYTICS_UNAVAILABLE`: 分析数据不可用 