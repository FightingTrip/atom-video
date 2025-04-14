# 认证API文档

本文档描述了Atom Video平台的认证相关API，包括用户注册、登录、密码重置等功能。

## 基本信息

- 基础URL: `/api/auth`
- 所有请求和响应均使用JSON格式
- 认证请求头格式: `Authorization: Bearer {token}`

## 认证API

### 用户注册

创建新用户账号。

**请求**

```
POST /api/auth/register
```

**请求体**

```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "name": "John Doe" // 可选
}
```

**响应 (201 Created)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "550e8400-e29b-41d4-a716-446655440000",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**错误响应**

- 400 Bad Request - 请求数据无效
- 409 Conflict - 用户名或邮箱已存在

### 用户登录

使用邮箱和密码登录系统。

**请求**

```
POST /api/auth/login
```

**请求体**

```json
{
  "email": "john.doe@example.com",
  "password": "Password123",
  "rememberMe": true // 可选
}
```

**响应 (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "550e8400-e29b-41d4-a716-446655440000",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**错误响应**

- 401 Unauthorized - 登录失败，凭据无效

### 刷新令牌

使用刷新令牌获取新的访问令牌。

**请求**

```
POST /api/auth/refresh
```

**请求体**

```json
{
  "refresh_token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**响应 (200 OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "661f9500-f39c-51e5-b827-557766551111",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**错误响应**

- 401 Unauthorized - 刷新令牌无效或已过期

### 退出登录

使当前设备的令牌失效。

**请求**

```
POST /api/auth/logout
```

**请求头**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**请求体**

```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**响应 (200 OK)**

```json
{
  "message": "退出登录成功"
}
```

**错误响应**

- 401 Unauthorized - 未授权，访问令牌无效
- 400 Bad Request - 请求失败，缺少刷新令牌

### 从所有设备退出登录

使所有设备的令牌失效。

**请求**

```
POST /api/auth/logout-all
```

**请求头**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应 (200 OK)**

```json
{
  "message": "已从所有设备退出登录"
}
```

**错误响应**

- 401 Unauthorized - 未授权，访问令牌无效

## 密码重置API

### 请求密码重置

发送验证码到用户邮箱。

**请求**

```
POST /api/auth/forgot-password
```

**请求体**

```json
{
  "email": "john.doe@example.com"
}
```

**响应 (200 OK)**

```json
{
  "message": "验证码已发送到您的邮箱，请查收"
}
```

**错误响应**

- 404 Not Found - 邮箱未找到
- 400 Bad Request - 请求密码重置失败

### 验证重置密码验证码

验证用户提供的验证码是否有效。

**请求**

```
POST /api/auth/verify-code
```

**请求体**

```json
{
  "email": "john.doe@example.com",
  "code": "123456"
}
```

**响应 (200 OK)**

```json
{
  "valid": true
}
```

**错误响应**

- 400 Bad Request - 验证码无效或已过期

### 使用验证码重置密码

通过验证码重置用户密码。

**请求**

```
POST /api/auth/reset-password
```

**请求体**

```json
{
  "email": "john.doe@example.com",
  "code": "123456",
  "password": "NewPassword123"
}
```

**响应 (200 OK)**

```json
{
  "message": "密码重置成功"
}
```

**错误响应**

- 400 Bad Request - 密码重置失败，验证码无效或已过期
- 404 Not Found - 用户不存在

## OAuth认证API

### GitHub登录

通过GitHub进行OAuth登录。

**请求**

```
GET /auth/github
```

**响应**

重定向到GitHub授权页面。

### GitHub回调

GitHub授权完成后的回调。

**请求**

```
GET /auth/github/callback
```

**响应**

重定向到前端页面，带上token参数。
成功: `{FRONTEND_URL}/auth/oauth-success?token={token}`
失败: `{FRONTEND_URL}/auth/oauth-error`

### Google登录

通过Google进行OAuth登录。

**请求**

```
GET /auth/google
```

**响应**

重定向到Google授权页面。

### Google回调

Google授权完成后的回调。

**请求**

```
GET /auth/google/callback
```

**响应**

重定向到前端页面，带上token参数。
成功: `{FRONTEND_URL}/auth/oauth-success?token={token}`
失败: `{FRONTEND_URL}/auth/oauth-error` 