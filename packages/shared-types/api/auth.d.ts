/**
 * 认证API类型定义
 */
import { UserRole } from '../models';

/**
 * 用户注册请求
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
}

/**
 * 用户登录请求
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * JWT令牌响应
 */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

/**
 * 认证用户响应
 */
export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isCreator: boolean;
  createdAt: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  tokens: TokenResponse;
  user: AuthUserResponse;
}

/**
 * 注册响应
 */
export interface RegisterResponse {
  message: string;
  user: AuthUserResponse;
}

/**
 * 忘记密码请求
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * 重置密码请求
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/**
 * 刷新令牌请求
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * 邮箱验证请求
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * OAuth认证响应
 */
export interface OAuthResponse {
  tokens: TokenResponse;
  user: AuthUserResponse;
  isNewUser: boolean;
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * 更新个人信息请求
 */
export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string | File;
}

/**
 * 两步验证请求
 */
export interface TwoFactorAuthRequest {
  code: string;
}

/**
 * 两步验证设置请求
 */
export interface SetupTwoFactorAuthResponse {
  qrCodeUrl: string;
  backupCodes: string[];
}
