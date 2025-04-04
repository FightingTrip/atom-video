import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import logger from '../utils/logger';

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

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: '用户已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 生成 JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password || '');

    if (!isValidPassword) {
      return res.status(401).json({ message: '密码错误' });
    }

    // 生成 JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败' });
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
