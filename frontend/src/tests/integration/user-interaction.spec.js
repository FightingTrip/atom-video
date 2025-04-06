import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/feed/Home.vue';
import VideoDetail from '@/pages/video/VideoDetail.vue';
import UserProfile from '@/pages/user/Profile.vue';
import { useVideoStore } from '@/stores/video';
import { useUserStore } from '@/stores/user';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/video/:id',
            component: VideoDetail,
        },
        {
            path: '/user/:id',
            component: UserProfile,
        },
    ],
});
describe('用户交互流程集成测试', () => {
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
    const mockVideo = {
        id: '1',
        title: '测试视频',
        description: '这是一个测试视频',
        coverUrl: 'https://example.com/cover.jpg',
        duration: 120,
        views: 1000,
        likes: 100,
        favorites: 50,
        createdAt: '2024-01-01T00:00:00Z',
        author: mockUser,
        tags: ['测试', '视频'],
        category: '测试分类',
        isLiked: false,
        isFavorited: false,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('浏览视频并点赞', async () => {
        const videoStore = useVideoStore();
        vi.spyOn(videoStore, 'getVideoDetail').mockResolvedValue(mockVideo);
        vi.spyOn(videoStore, 'toggleLike').mockResolvedValue();
        const wrapper = mount(VideoDetail, {
            props: {
                id: '1',
            },
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: true,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.vm.$nextTick();
        await wrapper.find('.like-btn').trigger('click');
        expect(videoStore.toggleLike).toHaveBeenCalledWith('1');
    });
    it('关注视频作者', async () => {
        const userStore = useUserStore();
        vi.spyOn(userStore, 'toggleFollow').mockResolvedValue();
        const wrapper = mount(UserProfile, {
            props: {
                id: '1',
            },
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: true,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.vm.$nextTick();
        await wrapper.find('.follow-btn').trigger('click');
        expect(userStore.toggleFollow).toHaveBeenCalledWith('1');
    });
    it('按分类筛选视频', async () => {
        const videoStore = useVideoStore();
        vi.spyOn(videoStore, 'getVideos').mockResolvedValue([mockVideo]);
        const wrapper = mount(Home, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: true,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.vm.$nextTick();
        await wrapper.find('.category-btn').trigger('click');
        expect(videoStore.getVideos).toHaveBeenCalledWith(1, 20, '测试分类');
    });
    it('查看作者视频列表', async () => {
        const userStore = useUserStore();
        vi.spyOn(userStore, 'getUserInfo').mockResolvedValue(mockUser);
        vi.spyOn(userStore, 'getUserVideos').mockResolvedValue([mockVideo]);
        const wrapper = mount(UserProfile, {
            props: {
                id: '1',
            },
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: true,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.vm.$nextTick();
        expect(userStore.getUserInfo).toHaveBeenCalledWith('1');
        expect(userStore.getUserVideos).toHaveBeenCalledWith('1');
        expect(wrapper.findAll('.video-card')).toHaveLength(1);
    });
    it('查看作者统计信息', async () => {
        const userStore = useUserStore();
        const mockStats = {
            totalViews: 10000,
            totalLikes: 500,
            totalFavorites: 200,
            totalComments: 100,
        };
        vi.spyOn(userStore, 'getUserStats').mockResolvedValue(mockStats);
        const wrapper = mount(UserProfile, {
            props: {
                id: '1',
            },
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: true,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.vm.$nextTick();
        expect(userStore.getUserStats).toHaveBeenCalledWith('1');
        expect(wrapper.find('.stats-container').exists()).toBe(true);
    });
    it('未登录用户尝试交互', async () => {
        const wrapper = mount(VideoDetail, {
            props: {
                id: '1',
            },
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: false,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.vm.$nextTick();
        await wrapper.find('.like-btn').trigger('click');
        expect(wrapper.find('.login-prompt').exists()).toBe(true);
    });
});
//# sourceMappingURL=user-interaction.spec.js.map