import { Router } from 'express';
import passport from '../config/oauth';
import {
  login,
  register,
  verifyEmail,
  resendVerificationEmail,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = Router();

// 本地认证路由
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

// Google OAuth 路由
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // 生成 JWT
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d',
    });

    // 重定向到前端，携带 token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// GitHub OAuth 路由
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // 生成 JWT
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d',
    });

    // 重定向到前端，携带 token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

export default router;
