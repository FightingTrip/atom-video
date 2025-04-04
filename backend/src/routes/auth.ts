import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
} from '../controllers/authController';

const router = Router();

// 邮箱注册
router.post('/register', register);

// 邮箱登录
router.post('/login', login);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// GitHub OAuth
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

export default router;
