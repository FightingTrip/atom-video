/**
 * 用户路由模块
 *
 * 管理与用户相关的路由和中间件
 * @module user/routes/user
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
  validateCreateUser,
  validateUpdateUser,
  validateUpdatePassword,
} from '../validation/user.validation';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';

// 创建路由实例
const router = Router();
const userController = new UserController();

/**
 * @route   GET /api/users
 * @desc    获取用户列表
 * @access  公开
 */
router.get('/', userController.getUsers);

/**
 * @route   GET /api/users/me
 * @desc    获取当前登录用户信息
 * @access  私有
 */
router.get('/me', authenticate, userController.getCurrentUser);

/**
 * @route   GET /api/users/:id
 * @desc    获取单个用户详情
 * @access  公开
 */
router.get('/:id', userController.getUserById);

/**
 * @route   GET /api/users/:id/following
 * @desc    获取用户关注的用户列表
 * @access  公开
 */
router.get('/:id/following', userController.getUserFollowing);

/**
 * @route   GET /api/users/:id/followers
 * @desc    获取用户的粉丝列表
 * @access  公开
 */
router.get('/:id/followers', userController.getUserFollowers);

/**
 * @route   POST /api/users
 * @desc    创建新用户（仅管理员可用）
 * @access  私有 (ADMIN)
 */
router.post('/', authenticate, authorize(['ADMIN']), validateCreateUser, userController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    更新用户信息
 * @access  私有
 */
router.put('/:id', authenticate, validateUpdateUser, userController.updateUser);

/**
 * @route   PATCH /api/users/:id/password
 * @desc    更新用户密码
 * @access  私有
 */
router.patch('/:id/password', authenticate, validateUpdatePassword, userController.updatePassword);

/**
 * @route   DELETE /api/users/:id
 * @desc    删除用户
 * @access  私有
 */
router.delete('/:id', authenticate, userController.deleteUser);

/**
 * @route   POST /api/users/:id/follow
 * @desc    关注用户
 * @access  私有
 */
router.post('/:id/follow', authenticate, userController.followUser);

/**
 * @route   DELETE /api/users/:id/follow
 * @desc    取消关注用户
 * @access  私有
 */
router.delete('/:id/follow', authenticate, userController.unfollowUser);

export const userRoutes = router;
