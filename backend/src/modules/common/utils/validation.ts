/**
 * 请求验证模块
 *
 * 提供请求数据验证的工具和验证模式
 * @module common/utils/validation
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from './app-error';
import { ApiResponse } from './api-response';

/**
 * 验证位置类型
 */
type ValidateLocation = 'body' | 'query' | 'params';

/**
 * 请求验证中间件
 * 使用Joi模式验证请求数据
 * @param schema Joi验证模式
 * @param location 要验证的请求部分
 * @returns Express中间件
 */
export const validateRequest = (schema: Joi.Schema, location: ValidateLocation = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[location], {
      abortEarly: false, // 收集所有错误
      stripUnknown: true, // 删除未在schema中定义的字段
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        path: detail.path,
        type: detail.type,
      }));

      return ApiResponse.error(res, '数据验证失败', 400, { errors: errorDetails });
    }

    // 更新经过验证的值
    req[location] = value;
    next();
  };
};

// 常用验证模式 -----------------------------------------------

/**
 * ID验证模式
 * 验证UUID格式
 */
export const idSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'ID必须是有效的UUID格式',
    'any.required': 'ID是必需的',
  }),
});

/**
 * 分页参数验证模式
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': '页码必须是数字',
    'number.integer': '页码必须是整数',
    'number.min': '页码必须大于等于1',
  }),
  pageSize: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': '每页大小必须是数字',
    'number.integer': '每页大小必须是整数',
    'number.min': '每页大小必须大于等于1',
    'number.max': '每页大小不能超过100',
  }),
  sortBy: Joi.string().messages({
    'string.base': '排序字段必须是字符串',
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'string.base': '排序方向必须是字符串',
    'any.only': '排序方向必须是"asc"或"desc"',
  }),
});

/**
 * 用户注册验证模式
 */
export const registerSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .required()
    .messages({
      'string.base': '用户名必须是字符串',
      'string.empty': '用户名不能为空',
      'string.min': '用户名长度不能少于{#limit}个字符',
      'string.max': '用户名长度不能超过{#limit}个字符',
      'string.pattern.base': '用户名只能包含字母、数字、下划线和短横线',
      'any.required': '用户名是必需的',
    }),
  email: Joi.string().trim().email().required().messages({
    'string.base': '邮箱必须是字符串',
    'string.empty': '邮箱不能为空',
    'string.email': '邮箱格式不正确',
    'any.required': '邮箱是必需的',
  }),
  password: Joi.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.base': '密码必须是字符串',
      'string.empty': '密码不能为空',
      'string.min': '密码长度不能少于{#limit}个字符',
      'string.max': '密码长度不能超过{#limit}个字符',
      'string.pattern.base': '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
      'any.required': '密码是必需的',
    }),
  name: Joi.string().trim().min(2).max(50).messages({
    'string.base': '姓名必须是字符串',
    'string.empty': '姓名不能为空',
    'string.min': '姓名长度不能少于{#limit}个字符',
    'string.max': '姓名长度不能超过{#limit}个字符',
  }),
});

/**
 * 用户登录验证模式
 */
export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': '邮箱必须是字符串',
    'string.empty': '邮箱不能为空',
    'string.email': '邮箱格式不正确',
    'any.required': '邮箱是必需的',
  }),
  password: Joi.string().required().messages({
    'string.base': '密码必须是字符串',
    'string.empty': '密码不能为空',
    'any.required': '密码是必需的',
  }),
});

/**
 * 创建视频验证模式
 */
export const createVideoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': '标题必须是字符串',
    'string.empty': '标题不能为空',
    'string.min': '标题长度不能少于{#limit}个字符',
    'string.max': '标题长度不能超过{#limit}个字符',
    'any.required': '标题是必需的',
  }),
  description: Joi.string().trim().max(2000).messages({
    'string.base': '描述必须是字符串',
    'string.max': '描述长度不能超过{#limit}个字符',
  }),
  thumbnailUrl: Joi.string().trim().uri().messages({
    'string.base': '缩略图URL必须是字符串',
    'string.empty': '缩略图URL不能为空',
    'string.uri': '缩略图URL格式不正确',
  }),
  videoUrl: Joi.string().trim().uri().required().messages({
    'string.base': '视频URL必须是字符串',
    'string.empty': '视频URL不能为空',
    'string.uri': '视频URL格式不正确',
    'any.required': '视频URL是必需的',
  }),
  duration: Joi.number().integer().min(0).required().messages({
    'number.base': '时长必须是数字',
    'number.integer': '时长必须是整数',
    'number.min': '时长不能小于0',
    'any.required': '时长是必需的',
  }),
  visibility: Joi.string()
    .valid('PUBLIC', 'UNLISTED', 'PRIVATE', 'MEMBERS_ONLY')
    .default('PUBLIC')
    .messages({
      'string.base': '可见性必须是字符串',
      'any.only': '可见性必须是以下值之一: PUBLIC, UNLISTED, PRIVATE, MEMBERS_ONLY',
    }),
  tags: Joi.array().items(Joi.string().trim()).messages({
    'array.base': '标签必须是数组',
  }),
  difficulty: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT').messages({
    'string.base': '难度必须是字符串',
    'any.only': '难度必须是以下值之一: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT',
  }),
  seriesId: Joi.string().guid({ version: 'uuidv4' }).messages({
    'string.guid': '系列ID必须是有效的UUID格式',
  }),
  seriesOrder: Joi.number().integer().min(0).messages({
    'number.base': '系列顺序必须是数字',
    'number.integer': '系列顺序必须是整数',
    'number.min': '系列顺序不能小于0',
  }),
  programmingLanguageId: Joi.string().guid({ version: 'uuidv4' }).messages({
    'string.guid': '编程语言ID必须是有效的UUID格式',
  }),
  technologies: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .messages({
      'array.base': '技术栈必须是数组',
      'string.guid': '技术栈ID必须是有效的UUID格式',
    }),
});
