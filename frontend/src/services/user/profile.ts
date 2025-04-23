/**
 * @file profile.ts
 * @description 用户个人资料服务
 */

import axios from 'axios';
import { User, ApiResponse } from '@/types';
import mockDb from '@/mock/mockDb';

// 获取模拟数据库实例
// const mockDb = new MockDb();

/**
 * 获取用户资料
 * @param userId 用户ID
 * @returns 用户信息
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

    // 从模拟数据库获取用户数据
    const user = mockDb.getUserById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return null;
  }
}

/**
 * 更新用户资料
 * @param userId 用户ID
 * @param userData 用户资料数据
 * @returns 更新后的用户信息
 */
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>
): Promise<User | null> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

    // 使用模拟数据库更新用户资料
    const result = mockDb.updateUser(userId, userData);

    if (!result.success) {
      throw new Error(result.error || '更新用户资料失败');
    }

    return result.user || null;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    return null;
  }
}

/**
 * 上传用户头像
 * @param file 头像文件
 * @returns 头像URL
 */
export async function uploadAvatar(file: File): Promise<string> {
  try {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 500));

    // 模拟返回随机头像URL
    const avatarId = Math.floor(Math.random() * 1000);
    return `https://i.pravatar.cc/300?img=${avatarId}`;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
}

/**
 * 上传用户封面图
 * @param file 封面图文件
 * @returns 封面图URL
 */
export async function uploadCoverImage(file: File): Promise<string> {
  try {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 500));

    // 模拟返回随机封面图URL
    const imageId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/1200/300?random=${imageId}`;
  } catch (error) {
    console.error('上传封面图失败:', error);
    throw error;
  }
}

export default {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  uploadCoverImage,
};
