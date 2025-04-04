# 认证 API

## 概述

本文档描述了 Atom Video 平台的认证相关 API。

## 目录

- [用户注册](#用户注册)
- [用户登录](#用户登录)
- [邮箱验证](#邮箱验证)
- [重置密码](#重置密码)
- [OAuth 认证](#oauth-认证)
- [获取当前用户](#获取当前用户)
- [用户登出](#用户登出)

## 用户注册

### 请求

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

### 响应

```json
{
  "message": "注册成功，请查收验证邮件",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "isVerified": false
  }
}
```

## 用户登录

### 请求

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 响应

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "avatar": "avatar_url",
    "isVerified": true
  }
}
```

## 邮箱验证

### 请求

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token"
}
```

### 响应

```json
{
  "message": "邮箱验证成功"
}
```

## 重置密码

### 请求重置链接

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 响应

```json
{
  "message": "重置密码的链接已发送到您的邮箱"
}
```

### 重置密码

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "new_password"
}
```

### 响应

```json
{
  "message": "密码重置成功"
}
```

## OAuth 认证

### Google 登录

```http
GET /api/auth/google
```

### GitHub 登录

```http
GET /api/auth/github
```

### OAuth 回调

```http
GET /api/auth/google/callback
GET /api/auth/github/callback
```

## 获取当前用户

### 请求

```http
GET /api/auth/me
Authorization: Bearer jwt_token
```

### 响应

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "avatar": "avatar_url",
  "isVerified": true
}
```

## 用户登出

### 请求

```http
POST /api/auth/logout
Authorization: Bearer jwt_token
```

### 响应

```json
{
  "message": "登出成功"
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

- `INVALID_CREDENTIALS`: 无效的凭据
- `EMAIL_NOT_VERIFIED`: 邮箱未验证
- `USER_NOT_FOUND`: 用户不存在
- `EMAIL_ALREADY_EXISTS`: 邮箱已存在
- `USERNAME_ALREADY_EXISTS`: 用户名已存在
- `INVALID_TOKEN`: 无效的令牌
- `TOKEN_EXPIRED`: 令牌已过期 