/**
 * 认证模型模块
 *
 * 定义认证相关的数据结构和DTO
 * @module auth/models/auth
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse as SharedTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from '@atom/shared-types/api/auth';

/**
 * 登录请求DTO
 */
export class LoginDto implements LoginRequest {
  /**
   * 邮箱
   */
  @ApiProperty({
    description: '邮箱',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email!: string;

  /**
   * 密码
   */
  @ApiProperty({
    description: '用户密码',
    example: 'Password123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password!: string;

  /**
   * 记住我
   */
  @ApiProperty({
    description: '记住我',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

/**
 * 注册请求DTO
 */
export class RegisterDto implements RegisterRequest {
  /**
   * 用户名
   */
  @ApiProperty({
    description: '用户名',
    example: 'johndoe',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名最少需要3个字符' })
  username!: string;

  /**
   * 电子邮件
   */
  @ApiProperty({
    description: '电子邮件',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email!: string;

  /**
   * 密码
   */
  @ApiProperty({
    description: '密码',
    example: 'Password123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码最少需要8个字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: '密码必须包含至少一个小写字母、一个大写字母和一个数字',
  })
  password!: string;

  /**
   * 名字（可选）
   */
  @ApiProperty({
    description: '用户名字',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '名称必须是字符串' })
  @MinLength(2, { message: '名称最少需要2个字符' })
  name?: string;
}

/**
 * 重置密码请求DTO
 */
export class ResetPasswordDto implements ResetPasswordRequest {
  /**
   * 重置令牌
   */
  @ApiProperty({
    description: '密码重置令牌',
    example: 'abcdef123456',
  })
  @IsNotEmpty({ message: '令牌不能为空' })
  @IsString({ message: '令牌必须是字符串' })
  token!: string;

  /**
   * 新密码
   */
  @ApiProperty({
    description: '新密码',
    example: 'NewPassword123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码最少需要8个字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: '密码必须包含至少一个小写字母、一个大写字母和一个数字',
  })
  password!: string;
}

/**
 * 请求密码重置DTO
 */
export class RequestPasswordResetDto implements ForgotPasswordRequest {
  /**
   * 邮箱
   */
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email!: string;
}

/**
 * 验证码验证DTO
 */
export class VerifyCodeDto {
  /**
   * 邮箱
   */
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email!: string;

  /**
   * 验证码
   */
  @ApiProperty({
    description: '验证码',
    example: '123456',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  @MinLength(6, { message: '验证码长度必须为6位' })
  @MaxLength(6, { message: '验证码长度必须为6位' })
  code!: string;
}

/**
 * 使用验证码重置密码DTO
 */
export class ResetPasswordWithCodeDto {
  /**
   * 邮箱
   */
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  email!: string;

  /**
   * 验证码
   */
  @ApiProperty({
    description: '验证码',
    example: '123456',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  @MinLength(6, { message: '验证码长度必须为6位' })
  @MaxLength(6, { message: '验证码长度必须为6位' })
  code!: string;

  /**
   * 新密码
   */
  @ApiProperty({
    description: '新密码',
    example: 'NewPassword123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码最少需要8个字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: '密码必须包含至少一个小写字母、一个大写字母和一个数字',
  })
  password!: string;
}

/**
 * 刷新令牌请求DTO
 */
export class RefreshTokenDto implements RefreshTokenRequest {
  /**
   * 刷新令牌
   */
  @ApiProperty({
    description: '刷新令牌',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  @IsString({ message: '刷新令牌必须是字符串' })
  refresh_token!: string;
}

/**
 * 认证令牌响应
 */
export class TokenResponse implements SharedTokenResponse {
  /**
   * 访问令牌
   */
  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  /**
   * 刷新令牌
   */
  @ApiProperty({
    description: '刷新令牌',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  refresh_token?: string;

  /**
   * 令牌类型
   */
  @ApiProperty({
    description: '令牌类型',
    example: 'Bearer',
  })
  token_type!: string;

  /**
   * 过期时间（秒）
   */
  @ApiProperty({
    description: '过期时间（秒）',
    example: 3600,
  })
  expires_in!: number;
}
