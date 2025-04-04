import type { User, AuthResponse, ApiResponse } from '@/types';
import { generateId } from '@/utils/format';

// 模拟用户数据
const users: User[] = [
  {
    id: '1',
    username: 'admin',
    nickname: '管理员',
    avatar: '/default-avatar.svg',
    bio: '系统管理员',
    github: 'https://github.com',
    website: 'https://atomvideo.dev',
    location: '北京',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'demo',
    nickname: '演示用户',
    avatar: '/default-avatar.svg',
    bio: '这是一个演示账号',
    location: '上海',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

// 模拟用户数据存储
let mockUsers = [...users];
const tokens = new Map<string, string>();

// 模拟注册
export async function register(data: {
  username: string;
  password: string;
  nickname?: string;
}): Promise<ApiResponse<AuthResponse>> {
  // 检查用户名是否已存在
  if (mockUsers.some(u => u.username === data.username)) {
    return {
      success: false,
      data: null,
      error: '用户名已存在',
    };
  }

  // 创建新用户
  const newUser: User = {
    id: generateId(),
    username: data.username,
    nickname: data.nickname || data.username,
    avatar: '/default-avatar.svg',
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  const token = generateId();
  tokens.set(newUser.id, token);

  return {
    success: true,
    data: {
      token,
      user: newUser,
    },
  };
}

// 模拟登录
export async function login(data: {
  username: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const user = mockUsers.find(u => u.username === data.username);

  if (!user) {
    return {
      success: false,
      data: null,
      error: '用户名或密码错误',
    };
  }

  // 在实际应用中会验证密码
  const token = generateId();
  tokens.set(user.id, token);

  return {
    success: true,
    data: {
      token,
      user,
    },
  };
}

// 模拟获取用户信息
export async function getUserInfo(userId: string): Promise<ApiResponse<User>> {
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return {
      success: false,
      data: null,
      error: '用户不存在',
    };
  }

  return {
    success: true,
    data: user,
  };
}

// 模拟更新用户信息
export async function updateUserInfo(
  userId: string,
  data: Partial<User>
): Promise<ApiResponse<User>> {
  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return {
      success: false,
      data: null,
      error: '用户不存在',
    };
  }

  // 更新用户信息
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...data,
    id: userId, // 防止 id 被修改
    username: mockUsers[userIndex].username, // 防止用户名被修改
  };

  return {
    success: true,
    data: mockUsers[userIndex],
  };
}

// 模拟验证 token
export function validateToken(token: string): boolean {
  return Array.from(tokens.values()).includes(token);
}

// 模拟通过 token 获取用户
export async function getUserByToken(token: string): Promise<ApiResponse<User>> {
  for (const [userId, userToken] of tokens.entries()) {
    if (userToken === token) {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        return {
          success: true,
          data: user,
        };
      }
    }
  }

  return {
    success: false,
    data: null,
    error: '无效的 token',
  };
}
