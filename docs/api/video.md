# 视频 API

## 概述

本文档描述了 Atom Video 平台的视频相关 API。

## 目录

- [上传视频](#上传视频)
- [获取视频列表](#获取视频列表)
- [获取视频详情](#获取视频详情)
- [更新视频信息](#更新视频信息)
- [删除视频](#删除视频)
- [视频点赞](#视频点赞)
- [视频评论](#视频评论)

## 上传视频

### 请求

```http
POST /api/videos
Content-Type: multipart/form-data
Authorization: Bearer jwt_token

{
  "title": "视频标题",
  "description": "视频描述",
  "file": "视频文件",
  "thumbnail": "封面图片（可选）",
  "tags": ["标签1", "标签2"]
}
```

### 响应

```json
{
  "id": "video_id",
  "title": "视频标题",
  "description": "视频描述",
  "url": "视频URL",
  "thumbnail": "封面URL",
  "duration": 120,
  "views": 0,
  "likes": 0,
  "tags": ["标签1", "标签2"],
  "createdAt": "2024-04-04T10:00:00Z",
  "updatedAt": "2024-04-04T10:00:00Z",
  "user": {
    "id": "user_id",
    "username": "username",
    "avatar": "avatar_url"
  }
}
```

## 获取视频列表

### 请求

```http
GET /api/videos
Authorization: Bearer jwt_token（可选）

# 查询参数
?page=1
&limit=10
&sort=latest
&tag=标签
&search=关键词
```

### 响应

```json
{
  "total": 100,
  "page": 1,
  "limit": 10,
  "videos": [
    {
      "id": "video_id",
      "title": "视频标题",
      "description": "视频描述",
      "thumbnail": "封面URL",
      "duration": 120,
      "views": 1000,
      "likes": 100,
      "createdAt": "2024-04-04T10:00:00Z",
      "user": {
        "id": "user_id",
        "username": "username",
        "avatar": "avatar_url"
      }
    }
  ]
}
```

## 获取视频详情

### 请求

```http
GET /api/videos/:id
Authorization: Bearer jwt_token（可选）
```

### 响应

```json
{
  "id": "video_id",
  "title": "视频标题",
  "description": "视频描述",
  "url": "视频URL",
  "thumbnail": "封面URL",
  "duration": 120,
  "views": 1000,
  "likes": 100,
  "tags": ["标签1", "标签2"],
  "createdAt": "2024-04-04T10:00:00Z",
  "updatedAt": "2024-04-04T10:00:00Z",
  "user": {
    "id": "user_id",
    "username": "username",
    "avatar": "avatar_url"
  },
  "comments": [
    {
      "id": "comment_id",
      "content": "评论内容",
      "createdAt": "2024-04-04T10:00:00Z",
      "user": {
        "id": "user_id",
        "username": "username",
        "avatar": "avatar_url"
      }
    }
  ]
}
```

## 更新视频信息

### 请求

```http
PATCH /api/videos/:id
Content-Type: application/json
Authorization: Bearer jwt_token

{
  "title": "新标题",
  "description": "新描述",
  "tags": ["新标签1", "新标签2"]
}
```

### 响应

```json
{
  "id": "video_id",
  "title": "新标题",
  "description": "新描述",
  "url": "视频URL",
  "thumbnail": "封面URL",
  "duration": 120,
  "views": 1000,
  "likes": 100,
  "tags": ["新标签1", "新标签2"],
  "updatedAt": "2024-04-04T10:00:00Z"
}
```

## 删除视频

### 请求

```http
DELETE /api/videos/:id
Authorization: Bearer jwt_token
```

### 响应

```json
{
  "message": "视频删除成功"
}
```

## 视频点赞

### 请求

```http
POST /api/videos/:id/like
Authorization: Bearer jwt_token
```

### 响应

```json
{
  "message": "点赞成功",
  "likes": 101
}
```

## 视频评论

### 发表评论

```http
POST /api/videos/:id/comments
Content-Type: application/json
Authorization: Bearer jwt_token

{
  "content": "评论内容"
}
```

### 响应

```json
{
  "id": "comment_id",
  "content": "评论内容",
  "createdAt": "2024-04-04T10:00:00Z",
  "user": {
    "id": "user_id",
    "username": "username",
    "avatar": "avatar_url"
  }
}
```

### 获取评论列表

```http
GET /api/videos/:id/comments
Authorization: Bearer jwt_token（可选）

# 查询参数
?page=1
&limit=10
```

### 响应

```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "comments": [
    {
      "id": "comment_id",
      "content": "评论内容",
      "createdAt": "2024-04-04T10:00:00Z",
      "user": {
        "id": "user_id",
        "username": "username",
        "avatar": "avatar_url"
      }
    }
  ]
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

- `VIDEO_NOT_FOUND`: 视频不存在
- `UNAUTHORIZED`: 未授权
- `FORBIDDEN`: 禁止访问
- `INVALID_FILE`: 无效的文件
- `FILE_TOO_LARGE`: 文件太大
- `INVALID_FORMAT`: 无效的格式 