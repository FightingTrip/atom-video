import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../services/userService';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// 创建用户
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: password, // 注意：实际应用中应该对密码进行加密
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

// 获取所有用户
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// 获取单个用户
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('获取用户信息失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 更新用户
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const user = await UserService.updateUser(id, userData);
    res.json(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('更新用户信息失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 删除用户
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('删除用户失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 获取用户订阅列表
export const getUserSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const subscriptions = await UserService.getUserSubscriptions(id);
    res.json(subscriptions);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('获取用户订阅列表失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 获取用户粉丝列表
export const getUserSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const subscribers = await UserService.getUserSubscribers(id);
    res.json(subscribers);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('获取用户粉丝列表失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 订阅/取消订阅用户
export const toggleSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: subscribedToId } = req.params;
    const subscriberId = req.user.id; // 从认证中间件获取当前用户ID
    const isSubscribed = await UserService.toggleSubscription(subscriberId, subscribedToId);
    res.json({ isSubscribed });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('订阅操作失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};
