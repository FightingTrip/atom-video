# API 文档

## 概述

Atom Video API 文档描述了所有可用的后端API端点，基于NestJS框架实现。本文档提供了使用这些API所需的所有信息，包括端点路径、请求方法、参数说明和响应格式。

## 认证

大多数API端点需要认证才能访问。我们使用JWT（JSON Web Token）进行认证。请参阅[认证API文档](./auth.md)了解如何获取和使用访问令牌。

## API端点

### 用户相关

- [认证API](./auth.md): 用户注册、登录和认证相关
- [用户API](./user.md): 用户个人资料管理

### 内容相关

- [视频API](./video.md): 视频上传、获取和管理
- [评论API](./comment.md): 评论创建和获取
- [创作者API](./creator.md): 创作者特有功能

### 互动相关

- [订阅API](./subscription.md): 订阅频道管理
- [点赞API](./interaction.md): 点赞内容管理
- [收藏API](./favorite.md): 收藏内容管理

## 请求格式

所有API请求应使用JSON格式的请求体，并包含适当的Content-Type头：

```
Content-Type: application/json
```

## 认证请求

对于需要认证的请求，必须在请求头中包含授权令牌：

```
Authorization: Bearer <access_token>
```

## 响应格式

所有API响应都以JSON格式返回，并包含标准状态码：

| 状态码 | 说明 |
|-------|-----|
| 200   | 成功 |
| 201   | 创建成功 |
| 400   | 请求格式错误 |
| 401   | 认证失败 |
| 403   | 权限不足 |
| 404   | 资源不存在 |
| 500   | 服务器错误 |

## 分页

支持分页的API端点接受以下查询参数：

- `page`: 页码，默认为1
- `limit`: 每页项目数，默认为10

示例：
```
GET /api/videos?page=2&limit=20
```

## 基础信息

- 基础URL: `https://api.atomvideo.com`
- API版本: v1
- 认证方式: Bearer Token
- 项目仓库: [GitHub](https://github.com/FightingTrip/atom-video)
- 联系邮箱: yuxiangzhang040727@gmail.com

## 视频管理

### 获取视频列表

```http
GET /api/v1/videos
```

查询参数：
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10）
- `sort`: 排序方式（可选：latest, popular）
- `category`: 分类ID（可选）

响应：
```json
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "thumbnail": "string",
      "duration": "number",
      "views": "number",
      "createdAt": "string",
      "author": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

### 上传视频

```http
POST /api/v1/videos
```

请求体（multipart/form-data）：
- `title`: 视频标题
- `description`: 视频描述
- `video`: 视频文件
- `thumbnail`: 缩略图文件
- `category`: 分类ID

响应：
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "thumbnail": "string",
  "duration": "number",
  "status": "string"
}
```

## 错误处理

所有API错误响应的格式如下：

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

常见错误代码：
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器内部错误 