# 认证 API

## 概述

本文档描述了 Atom Video 平台基于NestJS实现的认证相关 API。

## 认证架构

Atom Video 使用JWT (JSON Web Token) 和 Passport 实现认证，权限控制通过基于角色的访问控制（RBAC）实现。

### JWT认证流程

1. 用户提供凭据（用户名/密码）
2. 服务器验证凭据并生成JWT
3. JWT返回给客户端并保存（通常在localStorage或Cookie中）
4. 后续请求在Authorization头中携带JWT
5. 服务器验证JWT并授权访问

### 角色系统

系统定义了以下角色：

- `USER`: 普通用户
- `CREATOR`: 内容创作者
- `ADMIN`: 管理员

## API端点

### 用户注册

**端点:** `POST /api/auth/register`  
**描述:** 创建新用户账号  
**权限:** 公开访问

#### 请求

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### 响应

```json
{
  "message": "注册成功，请查收验证邮件",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "isVerified": false,
    "roles": ["USER"]
  }
}
```

### 用户登录

**端点:** `POST /api/auth/login`  
**描述:** 验证用户凭据并返回JWT令牌  
**权限:** 公开访问

#### 请求

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 响应

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "avatar": "avatar_url",
    "isVerified": true,
    "roles": ["USER", "CREATOR"]
  }
}
```

## 保护路由

要访问受保护的路由，需要在请求头中包含JWT令牌：

```http
GET /api/protected-route
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 获取当前用户

**端点:** `GET /api/auth/me`  
**描述:** 获取当前认证用户的信息  
**权限:** 需要认证

#### 请求

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 响应

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "avatar": "avatar_url",
  "isVerified": true,
  "roles": ["USER", "CREATOR"]
}
```

### 用户登出 (客户端实现)

由于JWT是无状态的，服务端不存储令牌，因此"登出"主要由客户端实现：

1. 客户端删除存储的令牌
2. 可选：将令牌加入黑名单（需要服务端实现）

## 角色授权使用

在NestJS控制器或方法上使用`@Roles`装饰器来限制访问：

```typescript
// 创作者专属端点
@Get('creator/dashboard')
@Roles('CREATOR')
getCreatorDashboard() {
  // 只有创作者角色可访问
}

// 管理员专属端点
@Delete('users/:id')
@Roles('ADMIN')
deleteUser() {
  // 只有管理员角色可访问
}
```

## 错误响应

所有 API 在发生错误时都会返回以下格式的响应：

```json
{
  "statusCode": 401,
  "message": "未经授权",
  "error": "Unauthorized"
}
```

常见错误响应：

- `401 Unauthorized`: 认证失败（无效令牌、令牌过期等）
- `403 Forbidden`: 权限不足（无权访问特定资源）
- `400 Bad Request`: 请求格式不正确 