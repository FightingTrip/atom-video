/**
 * 用户验证模块
 *
 * 定义用户相关的请求验证规则
 * @module user/validation/user
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../../common/utils/api-response';

// 创建用户验证规则
const createUserSchema = Joi.object({
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
  name: Joi.string().min(2).max(50).messages({
    'string.base': '名称必须是字符串',
    'string.min': '名称最少需要2个字符',
    'string.max': '名称最多允许50个字符',
  }),
  avatarUrl: Joi.string().uri().messages({
    'string.base': '头像URL必须是字符串',
    'string.uri': '头像URL必须是有效的URL',
  }),
  bio: Joi.string().max(500).messages({
    'string.base': '简介必须是字符串',
    'string.max': '简介最多允许500个字符',
  }),
  role: Joi.string().valid('USER', 'CREATOR', 'ADMIN').default('USER').messages({
    'string.base': '角色必须是字符串',
    'any.only': '角色必须是USER、CREATOR或ADMIN',
  }),
  isVerified: Joi.boolean().default(false).messages({
    'boolean.base': '验证状态必须是布尔值',
  }),
  isCreator: Joi.boolean().default(false).messages({
    'boolean.base': '创作者状态必须是布尔值',
  }),
  githubUrl: Joi.string().uri().messages({
    'string.base': 'GitHub URL必须是字符串',
    'string.uri': 'GitHub URL必须是有效的URL',
  }),
  websiteUrl: Joi.string().uri().messages({
    'string.base': '网站URL必须是字符串',
    'string.uri': '网站URL必须是有效的URL',
  }),
});

// 更新用户验证规则
const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).messages({
    'string.base': '用户名必须是字符串',
    'string.min': '用户名最少需要3个字符',
    'string.max': '用户名最多允许30个字符',
    'string.alphanum': '用户名只能包含字母和数字',
  }),
  name: Joi.string().min(2).max(50).messages({
    'string.base': '名称必须是字符串',
    'string.min': '名称最少需要2个字符',
    'string.max': '名称最多允许50个字符',
  }),
  avatarUrl: Joi.string().uri().messages({
    'string.base': '头像URL必须是字符串',
    'string.uri': '头像URL必须是有效的URL',
  }),
  bio: Joi.string().max(500).messages({
    'string.base': '简介必须是字符串',
    'string.max': '简介最多允许500个字符',
  }),
  role: Joi.string().valid('USER', 'CREATOR', 'ADMIN').messages({
    'string.base': '角色必须是字符串',
    'any.only': '角色必须是USER、CREATOR或ADMIN',
  }),
  isVerified: Joi.boolean().messages({
    'boolean.base': '验证状态必须是布尔值',
  }),
  isCreator: Joi.boolean().messages({
    'boolean.base': '创作者状态必须是布尔值',
  }),
  githubUrl: Joi.string().uri().allow('').messages({
    'string.base': 'GitHub URL必须是字符串',
    'string.uri': 'GitHub URL必须是有效的URL',
  }),
  websiteUrl: Joi.string().uri().allow('').messages({
    'string.base': '网站URL必须是字符串',
    'string.uri': '网站URL必须是有效的URL',
  }),
  channelDescription: Joi.string().max(1000).messages({
    'string.base': '频道描述必须是字符串',
    'string.max': '频道描述最多允许1000个字符',
  }),
  channelBannerUrl: Joi.string().uri().allow('').messages({
    'string.base': '频道横幅URL必须是字符串',
    'string.uri': '频道横幅URL必须是有效的URL',
  }),
  location: Joi.string().max(100).messages({
    'string.base': '位置必须是字符串',
    'string.max': '位置最多允许100个字符',
  }),
  experienceLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT').messages({
    'string.base': '经验级别必须是字符串',
    'any.only': '经验级别必须是BEGINNER、INTERMEDIATE、ADVANCED或EXPERT',
  }),
  company: Joi.string().max(100).messages({
    'string.base': '公司必须是字符串',
    'string.max': '公司最多允许100个字符',
  }),
  favoriteTechnologies: Joi.array().items(Joi.string().uuid()).messages({
    'array.base': '技术栈必须是数组',
    'string.uuid': '技术ID必须是有效的UUID',
  }),
  programmingLanguages: Joi.array().items(Joi.string().uuid()).messages({
    'array.base': '编程语言必须是数组',
    'string.uuid': '编程语言ID必须是有效的UUID',
  }),
})
  .min(1)
  .messages({
    'object.min': '至少需要更新一个字段',
  });

// 更新密码验证规则
const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.base': '当前密码必须是字符串',
    'string.empty': '当前密码不能为空',
    'any.required': '当前密码是必填项',
  }),
  newPassword: Joi.string()
    .min(8)
    .max(50)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.base': '新密码必须是字符串',
      'string.empty': '新密码不能为空',
      'string.min': '新密码最少需要8个字符',
      'string.max': '新密码最多允许50个字符',
      'string.pattern.base': '新密码必须包含至少一个小写字母、一个大写字母和一个数字',
      'any.required': '新密码是必填项',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'string.base': '确认密码必须是字符串',
    'string.empty': '确认密码不能为空',
    'any.only': '确认密码必须与新密码匹配',
    'any.required': '确认密码是必填项',
  }),
});

/**
 * 验证创建用户请求
 */
export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};

/**
 * 验证更新用户请求
 */
export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};

/**
 * 验证更新密码请求
 */
export const validateUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updatePasswordSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return ApiResponse.badRequest(res, errorMessage);
  }

  next();
};
