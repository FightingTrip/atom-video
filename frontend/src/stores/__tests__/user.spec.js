import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '../user';
import api from '@/utils/api';
vi.mock('@/utils/api');
describe('User Store', () => {
    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
        nickname: '测试用户',
        bio: '这是一个测试用户',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        isFollowing: false,
        followersCount: 100,
        followingCount: 50,
        videosCount: 20,
    };
    const mockUserStats = {
        totalViews: 10000,
        totalLikes: 500,
        totalFavorites: 200,
        totalComments: 100,
    };
    const mockFollowers = [
        {
            id: '2',
            username: 'follower1',
            avatar: 'https://example.com/avatar1.jpg',
            nickname: '关注者1',
            isFollowing: true,
        },
        {
            id: '3',
            username: 'follower2',
            avatar: 'https://example.com/avatar2.jpg',
            nickname: '关注者2',
            isFollowing: false,
        },
    ];
    const mockSubscriptions = [
        {
            id: '4',
            username: 'following1',
            avatar: 'https://example.com/avatar3.jpg',
            nickname: '关注1',
            isFollowing: true,
        },
        {
            id: '5',
            username: 'following2',
            avatar: 'https://example.com/avatar4.jpg',
            nickname: '关注2',
            isFollowing: true,
        },
    ];
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });
    it('获取用户信息', async () => {
        const userStore = useUserStore();
        api.get.mockResolvedValue({ data: mockUser });
        await userStore.getUserInfo('1');
        expect(api.get).toHaveBeenCalledWith('/users/1');
        expect(userStore.userInfo).toEqual(mockUser);
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('更新用户信息', async () => {
        const userStore = useUserStore();
        const updateData = {
            nickname: '新昵称',
            bio: '新简介',
        };
        api.put.mockResolvedValue({ data: { ...mockUser, ...updateData } });
        await userStore.updateUserInfo('1', updateData);
        expect(api.put).toHaveBeenCalledWith('/users/1', updateData);
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('更新用户设置', async () => {
        const userStore = useUserStore();
        const settings = {
            emailNotifications: true,
            privacyLevel: 'public',
        };
        api.put.mockResolvedValue({ data: settings });
        await userStore.updateUserSettings('1', settings);
        expect(api.put).toHaveBeenCalledWith('/users/1/settings', settings);
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('获取用户统计信息', async () => {
        const userStore = useUserStore();
        api.get.mockResolvedValue({ data: mockUserStats });
        await userStore.getUserStats('1');
        expect(api.get).toHaveBeenCalledWith('/users/1/stats');
        expect(userStore.userStats).toEqual(mockUserStats);
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('切换关注状态', async () => {
        const userStore = useUserStore();
        api.post.mockResolvedValue({ data: { isFollowing: true } });
        await userStore.toggleFollow('1');
        expect(api.post).toHaveBeenCalledWith('/users/1/follow');
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('获取关注列表', async () => {
        const userStore = useUserStore();
        api.get.mockResolvedValue({ data: mockSubscriptions });
        await userStore.getSubscriptions();
        expect(api.get).toHaveBeenCalledWith('/users/subscriptions', {
            params: {
                page: 1,
                limit: 20,
            },
        });
        expect(userStore.subscriptions).toEqual(mockSubscriptions);
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('获取粉丝列表', async () => {
        const userStore = useUserStore();
        api.get.mockResolvedValue({ data: mockFollowers });
        await userStore.getFollowers('1');
        expect(api.get).toHaveBeenCalledWith('/users/1/followers', {
            params: {
                page: 1,
                limit: 20,
            },
        });
        expect(userStore.followers).toEqual(mockFollowers);
        expect(userStore.loading).toBe(false);
        expect(userStore.error).toBeNull();
    });
    it('处理API错误', async () => {
        const userStore = useUserStore();
        const error = new Error('API错误');
        api.get.mockRejectedValue(error);
        await userStore.getUserInfo('1');
        expect(userStore.error).toBe('API错误');
        expect(userStore.loading).toBe(false);
    });
});
//# sourceMappingURL=user.spec.js.map