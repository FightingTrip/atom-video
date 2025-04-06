/**
 * 认证模型模块
 *
 * 定义认证相关的数据结构和DTO
 * @module auth/models/auth
 */

/**
 * 登录请求DTO
 */
export interface LoginDto {
  /**
   * 用户名或邮箱
   */
  username: string;

  /**
   * 密码
   */
  password: string;
}

/**
 * 注册请求DTO
 */
export interface RegisterDto {
  /**
   * 用户名
   */
  username: string;

  /**
   * 电子邮件
   */
  email: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 确认密码
   */
  confirmPassword: string;

  /**
   * 名字（可选）
   */
  name?: string;
}

/**
 * 重置密码请求DTO
 */
export interface ResetPasswordDto {
  /**
   * 重置令牌
   */
  token: string;

  /**
   * 新密码
   */
  password: string;

  /**
   * 确认密码
   */
  confirmPassword: string;
}

/**
 * 请求重置密码DTO
 */
export interface RequestPasswordResetDto {
  /**
   * 电子邮件
   */
  email: string;
}

/**
 * 刷新令牌请求DTO
 */
export interface RefreshTokenDto {
  /**
   * 刷新令牌
   */
  refreshToken: string;
}

/**
 * 认证会话（存储在Redis中）
 */
export interface AuthSession {
  /**
   * 用户ID
   */
  userId: string;

  /**
   * 角色
   */
  role: string;

  /**
   * 是否被撤销
   */
  isRevoked: boolean;

  /**
   * 创建时间
   */
  createdAt: number;

  /**
   * 到期时间
   */
  expiresAt: number;
}

/**
 * 认证令牌响应
 */
export interface TokenResponse {
  /**
   * 访问令牌
   */
  accessToken: string;

  /**
   * 刷新令牌
   */
  refreshToken: string;

  /**
   * 令牌类型
   */
  tokenType: string;

  /**
   * 过期时间（秒）
   */
  expiresIn: number;
}
