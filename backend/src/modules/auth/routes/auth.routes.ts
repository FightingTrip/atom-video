/**
 * 认证路由模块
 *
 * 管理与认证相关的路由和中间件
 * @module auth/routes/auth
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  validateLogin,
  validateRegister,
  validateRefreshToken,
  validatePasswordReset,
  validateRequestPasswordReset,
} from '../validation/auth.validation';
import { authenticate } from '../../common/middleware/auth.middleware';

// 创建路由实例
const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  公开
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  公开
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新访问令牌
 * @access  公开
 */
router.post('/refresh', validateRefreshToken, authController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    用户退出登录
 * @access  私有
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/logout-all
 * @desc    从所有设备退出登录
 * @access  私有
 */
router.post('/logout-all', authenticate, authController.logoutAll);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    请求密码重置
 * @access  公开
 */
router.post('/forgot-password', validateRequestPasswordReset, authController.requestPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    重置密码
 * @access  公开
 */
router.post('/reset-password', validatePasswordReset, authController.resetPassword);

export const authRoutes = router;
