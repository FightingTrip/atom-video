import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Google OAuth 配置
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 查找用户
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email: profile.emails?.[0].value }],
          },
        });

        if (!user) {
          // 创建新用户
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value || '',
              username: profile.displayName,
              googleId: profile.id,
              avatar: profile.photos?.[0].value,
              isVerified: true,
            },
          });
        } else if (!user.googleId) {
          // 更新现有用户
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
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

// GitHub OAuth 配置
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: `${process.env.API_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 查找用户
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ githubId: profile.id }, { email: profile.emails?.[0].value }],
          },
        });

        if (!user) {
          // 创建新用户
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value || '',
              username: profile.username,
              githubId: profile.id,
              avatar: profile.photos?.[0].value,
              isVerified: true,
            },
          });
        } else if (!user.githubId) {
          // 更新现有用户
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
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

// 序列化用户
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// 反序列化用户
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
