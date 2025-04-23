/**
 * @file users.ts
 * @description 用户相关的模拟数据和API
 */

import type { User } from '@/types';
import { generateRandomId } from './data';

// 测试账号
const testUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@atomvideo.com',
    password: 'Admin@123',
    nickname: '管理员',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    verified: true,
    bio: '系统管理员账号',
    subscribers: 1200,
    subscribing: 15,
    totalViews: 52000,
    joinedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'creator',
    email: 'creator@atomvideo.com',
    password: 'Password123',
    nickname: '内容创作者',
    avatar: 'https://i.pravatar.cc/150?u=creator',
    verified: true,
    bio: '专业视频创作者，分享各种教程和经验',
    subscribers: 8500,
    subscribing: 32,
    totalViews: 350000,
    joinedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'user',
    email: 'user@atomvideo.com',
    password: 'Password123',
    nickname: '普通用户',
    avatar: 'https://i.pravatar.cc/150?u=user',
    verified: false,
    bio: '喜欢观看各种视频',
    subscribers: 50,
    subscribing: 120,
    totalViews: 0,
    joinedAt: '2024-02-01T00:00:00Z',
  },
];

// 存储已注册的用户
const registeredUsers = [...testUsers];

// 模拟 token 存储
const tokenUserMap = new Map();

/**
 * 模拟登录API
 * @param param0
 * @returns
 */
export async function login({ username, password }: { username: string; password: string }) {
  // 延迟模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 500));

  // 查找匹配的用户
  const user = registeredUsers.find(
    u => (u.username === username || u.email === username) && u.password === password
  );

  if (user) {
    // 创建 token 并关联用户
    const token = `token-${generateRandomId()}`;
    const { password, ...userWithoutPassword } = user;
    tokenUserMap.set(token, userWithoutPassword);

    return {
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    };
  }

  return {
    success: false,
    error: '用户名或密码不正确',
  };
}

/**
 * 模拟注册API
 */
export async function register({
  username,
  password,
  nickname,
  email,
}: {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
}) {
  // 延迟模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 800));

  // 检查是否已存在同名用户
  if (
    registeredUsers.some(u => u.username === username || u.email === email || u.email === username)
  ) {
    return {
      success: false,
      error: '用户名或邮箱已被注册',
    };
  }

  // 创建新用户
  const newUser = {
    id: generateRandomId(),
    username,
    email: email || `${username}@example.com`,
    password,
    nickname: nickname || username,
    avatar: `https://i.pravatar.cc/150?u=${username}`,
    verified: false,
    bio: '',
    subscribers: 0,
    subscribing: 0,
    totalViews: 0,
    joinedAt: new Date().toISOString(),
  };

  // 添加到注册用户列表
  registeredUsers.push(newUser);

  return {
    success: true,
    data: {
      message: '注册成功',
    },
  };
}

/**
 * 通过token获取用户信息
 */
export async function getUserByToken(token: string) {
  // 延迟模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 300));

  const user = tokenUserMap.get(token);

  if (user) {
    return {
      success: true,
      data: user,
    };
  }

  return {
    success: false,
    error: 'token无效或已过期',
  };
}

/**
 * 模拟发送邮箱验证码
 */
export async function sendVerificationCode(email: string) {
  // 延迟模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 生成6位随机验证码
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 在真实应用中，这里会发送邮件
  console.log(`向 ${email} 发送验证码: ${verificationCode}`);

  // 在localStorage中存储验证码，用于验证（仅用于模拟）
  localStorage.setItem(`verify_code_${email}`, verificationCode);

  return {
    success: true,
    data: {
      message: '验证码已发送',
      // 仅用于开发环境
      code: import.meta.env.DEV ? verificationCode : undefined,
    },
  };
}

/**
 * 验证邮箱验证码
 */
export async function verifyEmailCode(email: string, code: string) {
  // 延迟模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 500));

  const storedCode = localStorage.getItem(`verify_code_${email}`);

  if (storedCode === code) {
    localStorage.removeItem(`verify_code_${email}`);
    return {
      success: true,
      data: {
        verified: true,
      },
    };
  }

  return {
    success: false,
    error: '验证码不正确或已过期',
  };
}
