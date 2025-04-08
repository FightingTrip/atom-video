/**
 * 标签路由模块
 *
 * 定义标签相关的API路由
 * @module tag/routes/tag
 */

import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { UserRole } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/utils/validation';
import Joi from 'joi';

const router = Router();
const tagController = new TagController();

// 标签创建校验规则
const createTagSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).message({
    'string.empty': '标签名不能为空',
    'string.min': '标签名至少需要2个字符',
    'string.max': '标签名不能超过50个字符',
    'any.required': '标签名是必填项'
  }),
  slug: Joi.string().min(2).max(50).pattern(/^[a-z0-9-]+$/).message({
    'string.min': 'Slug至少需要2个字符',
    'string.max': 'Slug不能超过50个字符',
    'string.pattern.base': 'Slug只能包含小写字母、数字和连字符'
  })
});

// 标签更新校验规则
const updateTagSchema = Joi.object({
  name: Joi.string().min(2).max(50).message({
    'string.empty': '标签名不能为空',
    'string.min': '标签名至少需要2个字符',
    'string.max': '标签名不能超过50个字符'
  }),
  slug: Joi.string().min(2).max(50).pattern(/^[a-z0-9-]+$/).message({
    'string.min': 'Slug至少需要2个字符',
    'string.max': 'Slug不能超过50个字符',
    'string.pattern.base': 'Slug只能包含小写字母、数字和连字符'
  })
}).min(1).message('至少需要提供一个更新字段');

// ID校验规则
const idSchema = Joi.object({
  id: Joi.string().required().uuid().message({
    'string.empty': 'ID不能为空',
    'string.guid': 'ID必须是有效的UUID格式',
    'any.required': 'ID是必填项'
  })
});

// 查询参数校验规则
const querySchema = Joi.object({
  search: Joi.string(),
  sort: Joi.string().valid('name', 'createdAt', 'count'),
  order: Joi.string().valid('asc', 'desc'),
  limit: Joi.number().integer().min(1).max(100),
  offset: Joi.number().integer().min(0)
});

// 公开路由 - 不需要认证
// 获取标签列表
router.get('/', validateRequest({ query: querySchema }), tagController.getTags.bind(tagController));

// 获取热门标签
router.get('/popular', tagController.getPopularTags.bind(tagController));

// 根据ID获取标签
router.get(
  '/:id',
  validateRequest({ params: idSchema }),
  tagController.getTagById.bind(tagController)
);

// 根据slug获取标签
router.get('/by-slug/:slug', tagController.getTagBySlug.bind(tagController));

// 获取视频的标签
router.get('/video/:videoId', tagController.getTagsByVideoId.bind(tagController));

// 需要认证的路由
// 创建标签
router.post(
  '/',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest({ body: createTagSchema }),
  tagController.createTag.bind(tagController)
);

// 更新标签
router.put(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest({ params: idSchema, body: updateTagSchema }),
  tagController.updateTag.bind(tagController)
);

// 删除标签
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest({ params: idSchema }),
  tagController.deleteTag.bind(tagController)
);

export const tagRoutes = router; 