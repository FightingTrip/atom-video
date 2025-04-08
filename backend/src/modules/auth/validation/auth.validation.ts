/**
 * 认证验证模块
 *
 * 定义认证相关的请求验证规则
 * @module auth/validation/auth
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../../common/utils/api-response';

// 登录验证规则
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': '用户名必须是字符串',
    'string.empty': '用户名不能为空',
    'any.required': '用户名是必填项',
  }),
  password: Joi.string().required().messages({
    'string.base': '密码必须是字符串',
    'string.empty': '密码不能为空',
    'any.required': '密码是必填项',
  }),
});

// 注册验证规则
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': '用户名必须是字符串',
    'string.empty': '用户名不能为空',
    'string.min': '用户名最少需要3个字符',
    'string.max': '用户名最多允许30个字符',
    'string.alphanum': '用户名只能包含字母和数字',
    'any.required': '用户名是必填项',
  }),
  email: Joi.string().email().required().messages({
    'string.base': '邮箱必须是字符串',
    'string.empty': '邮箱不能为空',
    'string.email': '请提供有效的邮箱地址',
    'any.required': '邮箱是必填项',
  }),
  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.base': '密码必须是字符串',
      'string.empty': '密码不能为空',
      'string.min': '密码最少需要8个字符',
      'string.max': '密码最多允许50个字符',
      'string.pattern.base': '密码必须包含至少一个小写字母、一个大写字母和一个数字',
      'any.required': '密码是必填项',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.base': '确认密码必须是字符串',
    'string.empty': '确认密码不能为空',
    'any.only': '确认密码必须与密码匹配',
    'any.required': '确认密码是必填项',
  }),
  name: Joi.string().min(2).max(50).messages({
    'string.base': '名称必须是字符串',
    'string.min': '名称最少需要2个字符',
    'string.max': '名称最多允许50个字符',
  }),
});

// 刷新令牌验证规则
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': '刷新令牌必须是字符串',
    'string.empty': '刷新令牌不能为空',
    'any.required': '刷新令牌是必填项',
  }),
});

// 请求密码重置验证规则
const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': '邮箱必须是字符串',
    'string.empty': '邮箱不能为空',
    'string.email': '请提供有效的邮箱地址',
    'any.required': '邮箱是必填项',
  }),
});

// 密码重置验证规则
const passwordResetSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': '令牌必须是字符串',
    'string.empty': '令牌不能为空',
    'any.required': '令牌是必填项',
  }),
  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.base': '密码必须是字符串',
      'string.empty': '密码不能为空',
      'string.min': '密码最少需要8个字符',
      'string.max': '密码最多允许50个字符',
      'string.pattern.base': '密码必须包含至少一个小写字母、一个大写字母和一个数字',
      'any.required': '密码是必填项',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.base': '确认密码必须是字符串',
    'string.empty': '确认密码不能为空',
    'any.only': '确认密码必须与密码匹配',
    'any.required': '确认密码是必填项',
  }),
});

/**
 * 验证登录请求
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};

/**
 * 验证注册请求
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};

/**
 * 验证刷新令牌请求
 */
export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const { error } = refreshTokenSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};

/**
 * 验证请求密码重置请求
 */
export const validateRequestPasswordReset = (req: Request, res: Response, next: NextFunction) => {
  const { error } = requestPasswordResetSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};

/**
 * 验证密码重置请求
 */
export const validatePasswordReset = (req: Request, res: Response, next: NextFunction) => {
  const { error } = passwordResetSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};
