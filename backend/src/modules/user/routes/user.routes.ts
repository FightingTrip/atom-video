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
import {
  authenticate,
  allowGuest,
  authorizeRoles,
  authorizePermissions,
  UserRole,
} from '../../common/middleware/auth.middleware';

// 创建路由实例
const router = Router();
const userController = new UserController();

/**
 * @route   GET /api/users
 * @desc    获取用户列表
 * @access  公开 (所有角色)
 */
router.get('/', allowGuest, userController.getUsers);

/**
 * @route   GET /api/users/me
 * @desc    获取当前登录用户信息
 * @access  私有 (所有已登录用户)
 */
router.get('/me', authenticate, userController.getCurrentUser);

/**
 * @route   GET /api/users/:id
 * @desc    获取单个用户详情
 * @access  公开 (所有角色)
 */
router.get('/:id', allowGuest, userController.getUserById);

/**
 * @route   GET /api/users/:id/following
 * @desc    获取用户关注的用户列表
 * @access  公开 (所有角色)
 */
router.get('/:id/following', allowGuest, userController.getUserFollowing);

/**
 * @route   GET /api/users/:id/followers
 * @desc    获取用户的粉丝列表
 * @access  公开 (所有角色)
 */
router.get('/:id/followers', allowGuest, userController.getUserFollowers);

/**
 * @route   POST /api/users
 * @desc    创建新用户（仅管理员可用）
 * @access  私有 (ADMIN)
 */
router.post(
  '/',
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  authorizePermissions(['user:create']),
  validateCreateUser,
  userController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    更新用户信息
 * @access  私有 (仅限本人或管理员)
 */
router.put('/:id', authenticate, validateUpdateUser, userController.updateUser);

/**
 * @route   PATCH /api/users/:id/password
 * @desc    更新用户密码
 * @access  私有 (仅限本人或管理员)
 */
router.patch('/:id/password', authenticate, validateUpdatePassword, userController.updatePassword);

/**
 * @route   DELETE /api/users/:id
 * @desc    删除用户
 * @access  私有 (仅管理员和本人)
 */
router.delete('/:id', authenticate, userController.deleteUser);

/**
 * @route   POST /api/users/:id/follow
 * @desc    关注用户
 * @access  私有 (普通用户和创作者)
 */
router.post(
  '/:id/follow',
  authenticate,
  authorizeRoles([UserRole.USER, UserRole.CREATOR, UserRole.ADMIN]),
  userController.followUser
);

/**
 * @route   DELETE /api/users/:id/follow
 * @desc    取消关注用户
 * @access  私有 (普通用户和创作者)
 */
router.delete(
  '/:id/follow',
  authenticate,
  authorizeRoles([UserRole.USER, UserRole.CREATOR, UserRole.ADMIN]),
  userController.unfollowUser
);

/**
 * @route   POST /api/users/creator/apply
 * @desc    申请成为创作者
 * @access  私有 (普通用户)
 */
router.post(
  '/creator/apply',
  authenticate,
  authorizeRoles([UserRole.USER]),
  userController.applyForCreator
);

/**
 * @route   POST /api/users/:id/verify-creator
 * @desc    审核创作者申请
 * @access  私有 (管理员)
 */
router.post(
  '/:id/verify-creator',
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  authorizePermissions(['creator:approve']),
  userController.verifyCreator
);

export const userRoutes = router;
