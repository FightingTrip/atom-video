import type { User, AuthResponse, ApiResponse } from '@/types';
import { generateId } from '@/utils/format';
import { faker } from '@faker-js/faker';
import type { Channel, Playlist } from '@/types';

// // 设置中文语言
// faker.setLocale('zh_CN');

// 定义类型
export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  verified: boolean;
  subscribers: number;
  subscribing: number;
  totalViews: number;
  joinedAt: string;
  social: {
    website?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}

export interface Channel {
  id: string;
  userId: string;
  name: string;
  description: string;
  banner: string;
  playlists: Playlist[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
}

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

// 生成模拟用户数据
export const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    nickname: faker.person.fullName(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    verified: faker.datatype.boolean(0.2),
    subscribers: faker.number.int({ min: 100, max: 1000000 }),
    subscribing: faker.number.int({ min: 10, max: 500 }),
    totalViews: faker.number.int({ min: 1000, max: 10000000 }),
    joinedAt: faker.date.past({ years: 3 }).toISOString(),
    social: {
      website: faker.helpers.maybe(() => faker.internet.url()),
      twitter: faker.helpers.maybe(() => faker.internet.username()),
      github: faker.helpers.maybe(() => faker.internet.username()),
      instagram: faker.helpers.maybe(() => faker.internet.username()),
    },
  }));
};

// 生成频道数据
const generateChannels = (userId: string): Channel => ({
  id: faker.string.uuid(),
  userId,
  name: faker.company.name(),
  description: faker.lorem.paragraphs(2),
  banner: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/1920/180`,
  playlists: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    videoCount: faker.number.int({ min: 5, max: 50 }),
    visibility: faker.helpers.arrayElement(['public', 'private', 'unlisted']),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  })),
});

// 生成初始数据
const mockUserList = generateMockUsers(50);
const mockChannelList = mockUserList.map(user => generateChannels(user.id));

// Mock API 函数
export const mockUserApi = {
  // 获取用户信息
  async getUserById(id: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUserList.find(user => user.id === id);
  },

  // 获取用户列表
  async getUsers(page = 1, limit = 20) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      users: mockUserList.slice(start, end),
      total: mockUserList.length,
      hasMore: end < mockUserList.length,
    };
  },

  // 获取频道信息
  async getChannelByUserId(userId: string): Promise<Channel | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChannelList.find(channel => channel.userId === userId);
  },

  // 获取用户播放列表
  async getUserPlaylists(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const channel = mockChannelList.find(channel => channel.userId === userId);
    return channel?.playlists || [];
  },

  // 搜索用户
  async searchUsers(query: string, page = 1, limit = 20) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockUserList.filter(
      user =>
        user.nickname.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      users: filtered.slice(start, end),
      total: filtered.length,
      hasMore: end < filtered.length,
    };
  },
};

// 导出一些测试数据用于开发
export const testUserData = {
  users: mockUserList.slice(0, 5),
  channels: mockChannelList.slice(0, 5),
};

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

// 模拟 API 函数
export const getUserById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers.find(user => user.id === id);
};

export const getChannelByUserId = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockChannelList.find(channel => channel.userId === userId);
};

export const getUserPlaylists = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const channel = mockChannelList.find(channel => channel.userId === userId);
  return channel?.playlists || [];
};
