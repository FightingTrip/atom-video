import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from './app-error';
import { ApiResponse } from './api-response';

/**
 * 验证请求数据中间件工厂
 * @param schema Joi验证模式
 * @param source 验证来源 ('body', 'query', 'params')
 */
export function validateRequest(schema: Joi.Schema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.reduce(
        (acc, detail) => {
          acc[detail.path.join('.')] = detail.message;
          return acc;
        },
        {} as Record<string, string>
      );

      return ApiResponse.validationError(res, 'Validation error', details);
    }

    req[source] = value;
    next();
  };
}

/**
 * 通用ID验证模式
 */
export const idSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID must be a valid UUID',
    'any.required': 'ID is required',
  }),
});

/**
 * 分页查询验证模式
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  pageSize: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Page size must be a number',
    'number.integer': 'Page size must be an integer',
    'number.min': 'Page size must be at least 1',
    'number.max': 'Page size cannot exceed 100',
  }),
  sort: Joi.string().messages({
    'string.base': 'Sort must be a string',
  }),
  order: Joi.string().valid('asc', 'desc').default('desc').messages({
    'string.base': 'Order must be a string',
    'any.only': 'Order must be either "asc" or "desc"',
  }),
});

/**
 * 用户注册验证模式
 */
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username must be a string',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  name: Joi.string().max(100).messages({
    'string.base': 'Name must be a string',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  isCreator: Joi.boolean().default(false).messages({
    'boolean.base': 'isCreator must be a boolean',
  }),
});

/**
 * 登录验证模式
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
});

/**
 * 视频创建验证模式
 */
export const createVideoSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().max(5000).messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 5000 characters',
  }),
  thumbnailUrl: Joi.string().uri().messages({
    'string.base': 'Thumbnail URL must be a string',
    'string.uri': 'Thumbnail URL must be a valid URL',
  }),
  videoUrl: Joi.string().uri().required().messages({
    'string.base': 'Video URL must be a string',
    'string.uri': 'Video URL must be a valid URL',
    'any.required': 'Video URL is required',
  }),
  duration: Joi.number().integer().min(1).required().messages({
    'number.base': 'Duration must be a number',
    'number.integer': 'Duration must be an integer',
    'number.min': 'Duration must be at least 1 second',
    'any.required': 'Duration is required',
  }),
  visibility: Joi.string()
    .valid('PUBLIC', 'UNLISTED', 'PRIVATE', 'MEMBERS_ONLY')
    .required()
    .messages({
      'string.base': 'Visibility must be a string',
      'any.only': 'Visibility must be one of: PUBLIC, UNLISTED, PRIVATE, MEMBERS_ONLY',
      'any.required': 'Visibility is required',
    }),
  difficultyLevel: Joi.string()
    .valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')
    .required()
    .messages({
      'string.base': 'Difficulty level must be a string',
      'any.only': 'Difficulty level must be one of: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT',
      'any.required': 'Difficulty level is required',
    }),
  videoType: Joi.string()
    .valid(
      'TUTORIAL',
      'CODE_REVIEW',
      'LIVE_CODING',
      'TECH_TALK',
      'INTERVIEW',
      'COURSE_MATERIAL',
      'CONFERENCE_TALK',
      'PRODUCT_DEMO'
    )
    .required()
    .messages({
      'string.base': 'Video type must be a string',
      'any.only': 'Video type must be a valid value',
      'any.required': 'Video type is required',
    }),
  sourceCodeUrl: Joi.string().uri().messages({
    'string.base': 'Source code URL must be a string',
    'string.uri': 'Source code URL must be a valid URL',
  }),
  liveDemo: Joi.string().uri().messages({
    'string.base': 'Live demo URL must be a string',
    'string.uri': 'Live demo URL must be a valid URL',
  }),
  prerequisites: Joi.string().max(1000).messages({
    'string.base': 'Prerequisites must be a string',
    'string.max': 'Prerequisites cannot exceed 1000 characters',
  }),
  learningOutcomes: Joi.string().max(1000).messages({
    'string.base': 'Learning outcomes must be a string',
    'string.max': 'Learning outcomes cannot exceed 1000 characters',
  }),
  seriesId: Joi.string().uuid().messages({
    'string.base': 'Series ID must be a string',
    'string.uuid': 'Series ID must be a valid UUID',
  }),
  seriesOrder: Joi.number().integer().min(0).messages({
    'number.base': 'Series order must be a number',
    'number.integer': 'Series order must be an integer',
    'number.min': 'Series order must be at least 0',
  }),
  languageId: Joi.string().uuid().messages({
    'string.base': 'Language ID must be a string',
    'string.uuid': 'Language ID must be a valid UUID',
  }),
  tags: Joi.array().items(Joi.string()).messages({
    'array.base': 'Tags must be an array',
  }),
  categoryIds: Joi.array().items(Joi.string().uuid()).messages({
    'array.base': 'Category IDs must be an array',
    'string.uuid': 'Each category ID must be a valid UUID',
  }),
});
