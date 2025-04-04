import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticateToken, checkRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 创建用户（注册）- 公开路由
router.post('/', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        role: 'member',
      },
    });

    // 不返回密码哈希
    const { password_hash, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// 获取所有用户 - 仅管理员
router.get('/', authenticateToken, checkRole(['admin']), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar_url: true,
        bio: true,
        last_login: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// 获取单个用户 - 认证用户（自己）或管理员
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // 检查权限：只能查看自己的信息或管理员可以查看所有
    if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
      res.status(403).json({ error: '权限不足' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar_url: true,
        bio: true,
        last_login: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 更新用户 - 认证用户（自己）或管理员
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // 检查权限：只能更新自己的信息或管理员可以更新所有
    if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
      res.status(403).json({ error: '权限不足' });
      return;
    }

    const { username, email, password, bio, avatar_url } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        ...(hashedPassword && { password_hash: hashedPassword }),
        bio,
        avatar_url,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar_url: true,
        bio: true,
        last_login: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 删除用户 - 仅管理员
router.delete('/:id', authenticateToken, checkRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
