# 用户 API

## 概述

本文档描述了 Atom Video 平台的用户相关 API。

## 目录

- [获取用户信息](#获取用户信息)
- [更新用户信息](#更新用户信息)
- [更新用户头像](#更新用户头像)
- [获取用户视频](#获取用户视频)
- [获取用户订阅](#获取用户订阅)
- [获取用户粉丝](#获取用户粉丝)

## 获取用户信息

### 请求

```http
GET /api/users/:id
Authorization: Bearer jwt_token（可选）
```

### 响应

```json
{
  "id": "user_id",
  "username": "username",
  "email": "user@example.com",
  "avatar": "avatar_url",
  "bio": "个人简介",
  "createdAt": "2024-04-04T10:00:00Z",
  "stats": {
    "videos": 10,
    "subscribers": 100,
    "subscriptions": 50
  }
}
```

## 更新用户信息

### 请求

```http
PATCH /api/users/:id
Content-Type: application/json
Authorization: Bearer jwt_token

{
  "username": "new_username",
  "bio": "新的个人简介"
}
```

### 响应

```json
{
  "id": "user_id",
  "username": "new_username",
  "email": "user@example.com",
  "avatar": "avatar_url",
  "bio": "新的个人简介",
  "updatedAt": "2024-04-04T10:00:00Z"
}
```

## 更新用户头像

### 请求

```http
PATCH /api/users/:id/avatar
Content-Type: multipart/form-data
Authorization: Bearer jwt_token

{
  "avatar": "头像文件"
}
```

### 响应

```json
{
  "id": "user_id",
  "avatar": "新的头像URL",
  "updatedAt": "2024-04-04T10:00:00Z"
}
```

## 获取用户视频

### 请求

```http
GET /api/users/:id/videos
Authorization: Bearer jwt_token（可选）

# 查询参数
?page=1
&limit=10
&sort=latest
```

### 响应

```json
{
  "total": 20,
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
      "createdAt": "2024-04-04T10:00:00Z"
    }
  ]
}
```

## 获取用户订阅

### 请求

```http
GET /api/users/:id/subscriptions
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
  "subscriptions": [
    {
      "id": "user_id",
      "username": "username",
      "avatar": "avatar_url",
      "bio": "个人简介",
      "stats": {
        "videos": 10,
        "subscribers": 100
      }
    }
  ]
}
```

## 获取用户粉丝

### 请求

```http
GET /api/users/:id/subscribers
Authorization: Bearer jwt_token（可选）

# 查询参数
?page=1
&limit=10
```

### 响应

```json
{
  "total": 100,
  "page": 1,
  "limit": 10,
  "subscribers": [
    {
      "id": "user_id",
      "username": "username",
      "avatar": "avatar_url",
      "bio": "个人简介",
      "stats": {
        "videos": 10,
        "subscribers": 100
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

- `USER_NOT_FOUND`: 用户不存在
- `UNAUTHORIZED`: 未授权
- `FORBIDDEN`: 禁止访问
- `USERNAME_ALREADY_EXISTS`: 用户名已存在
- `INVALID_FILE`: 无效的文件
- `FILE_TOO_LARGE`: 文件太大 