import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import logger from '../utils/logger';
import crypto from 'crypto';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/email';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 配置 Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value || '',
              username: profile.displayName,
              googleId: profile.id,
              avatar: profile.photos?.[0].value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// 配置 GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: '/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value || '',
              username: profile.username,
              githubId: profile.id,
              avatar: profile.photos?.[0].value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// 生成验证令牌
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 生成重置令牌
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 注册
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return res.status(400).json({ message: '该用户名已被使用' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 生成验证令牌
    const verificationToken = generateVerificationToken();

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        verificationToken,
        isVerified: false,
      },
    });

    // 发送验证邮件
    await sendVerificationEmail(email, verificationToken);

    // 生成 JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: '注册成功，请查收验证邮件',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败，请重试' });
  }
};

// 登录
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 检查邮箱是否已验证
    if (!user.isVerified) {
      return res.status(403).json({ message: '请先验证邮箱' });
    }

    // 生成 JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败，请重试' });
  }
};

// 验证邮箱
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // 查找用户
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: '无效的验证令牌' });
    }

    // 更新用户验证状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.json({ message: '邮箱验证成功' });
  } catch (error) {
    console.error('验证邮箱错误:', error);
    res.status(500).json({ message: '验证失败，请重试' });
  }
};

// 重新发送验证邮件
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: '邮箱已验证' });
    }

    // 生成新的验证令牌
    const verificationToken = generateVerificationToken();

    // 更新用户验证令牌
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // 发送验证邮件
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: '验证邮件已发送' });
  } catch (error) {
    console.error('重新发送验证邮件错误:', error);
    res.status(500).json({ message: '发送失败，请重试' });
  }
};

// 登出
export const logout = (req: Request, res: Response) => {
  res.json({ message: '登出成功' });
};

// 获取当前用户信息
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
};

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleCallback = passport.authenticate(
  'google',
  {
    failureRedirect: '/auth/login',
    session: false,
  },
  (req, res) => {
    const token = jwt.sign({ userId: req.user?.id }, JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`/auth/callback?token=${token}`);
  }
);

export const githubAuth = passport.authenticate('github', {
  scope: ['user:email'],
});

export const githubCallback = passport.authenticate(
  'github',
  {
    failureRedirect: '/auth/login',
    session: false,
  },
  (req, res) => {
    const token = jwt.sign({ userId: req.user?.id }, JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`/auth/callback?token=${token}`);
  }
);

// 忘记密码
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 生成重置令牌
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1小时后过期

    // 更新用户重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // 发送重置密码邮件
    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: '重置密码的链接已发送到您的邮箱' });
  } catch (error) {
    console.error('忘记密码错误:', error);
    res.status(500).json({ message: '发送失败，请重试' });
  }
};

// 重置密码
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: '无效或过期的重置令牌' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 更新用户密码并清除重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.json({ message: '密码重置成功' });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({ message: '重置失败，请重试' });
  }
};
