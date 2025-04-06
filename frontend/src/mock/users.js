import { generateId } from '@/utils/format';
import { faker } from '@faker-js/faker';
// 模拟用户数据
export const mockUsers = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        isVerified: true,
    },
    {
        id: '2',
        username: 'demo',
        email: 'demo@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        isVerified: true,
    },
    {
        id: '3',
        username: 'test',
        email: 'test@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
        isVerified: true,
    },
];
// 模拟的用户密码映射 (在实际应用中密码会加密保存)
const userPasswords = {
    'admin@example.com': 'admin123',
    'demo@example.com': 'demo123',
    'test@example.com': 'test123',
};
// 模拟token存储
export const tokens = new Map();
// 生成唯一ID
export function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
// 模拟登录
export async function login(data) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查是否是邮箱登录
    const isEmail = data.username.includes('@');
    let user;
    if (isEmail) {
        // 通过邮箱查找用户
        user = mockUsers.find(u => u.email === data.username);
        // 验证密码
        if (user && userPasswords[data.username] !== data.password) {
            user = null;
        }
    }
    else {
        // 通过用户名查找用户
        user = mockUsers.find(u => u.username === data.username);
        // 验证密码
        if (user && userPasswords[user.email] !== data.password) {
            user = null;
        }
    }
    if (!user) {
        return {
            success: false,
            data: null,
            error: '用户名或密码错误',
        };
    }
    // 生成token
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
// 模拟注册
export async function register(data) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查用户名是否已存在
    if (mockUsers.some(u => u.username === data.username)) {
        return {
            success: false,
            data: null,
            error: '用户名已存在',
        };
    }
    // 创建新用户
    const newUser = {
        id: (mockUsers.length + 1).toString(),
        username: data.username,
        email: `${data.username}@example.com`,
        avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 1}`,
        isVerified: false,
    };
    // 添加到模拟数据
    mockUsers.push(newUser);
    // 添加密码映射
    userPasswords[newUser.email] = data.password;
    return {
        success: true,
        data: newUser,
    };
}
// 通过token获取用户
export async function getUserByToken(token) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    // 查找token对应的用户
    const userId = [...tokens.entries()].find(([, t]) => t === token)?.[0];
    if (!userId) {
        return {
            success: false,
            data: null,
            error: '无效的token',
        };
    }
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
// 模拟验证码发送
export async function sendVerificationCode(email) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 模拟成功响应
    return {
        success: true,
        data: '验证码已发送到您的邮箱',
    };
}
// 模拟验证token
export function validateToken(token) {
    return Array.from(tokens.values()).includes(token);
}
// 生成模拟用户数据
export const generateMockUsers = (count) => {
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
const generateChannels = (userId) => ({
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
    async getUserById(id) {
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
    async getChannelByUserId(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockChannelList.find(channel => channel.userId === userId);
    },
    // 获取用户播放列表
    async getUserPlaylists(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const channel = mockChannelList.find(channel => channel.userId === userId);
        return channel?.playlists || [];
    },
    // 搜索用户
    async searchUsers(query, page = 1, limit = 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const filtered = mockUserList.filter(user => user.nickname.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()));
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
// 模拟获取用户信息
export async function getUserInfo(userId) {
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
export async function updateUserInfo(userId, data) {
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
// 模拟 API 函数
export const getUserById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.find(user => user.id === id);
};
export const getChannelByUserId = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChannelList.find(channel => channel.userId === userId);
};
export const getUserPlaylists = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const channel = mockChannelList.find(channel => channel.userId === userId);
    return channel?.playlists || [];
};
//# sourceMappingURL=users.js.map