# API 文档

## 基础信息

- 基础URL: `https://api.atomvideo.com`
- API版本: v1
- 认证方式: Bearer Token

## 认证

### 登录

```http
POST /api/v1/auth/login
```

请求体：
```json
{
  "email": "string",
  "password": "string"
}
```

响应：
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### 注册

```http
POST /api/v1/auth/register
```

请求体：
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

响应：
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

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