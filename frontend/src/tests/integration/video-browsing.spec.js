import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/feed/Home.vue';
import VideoDetail from '@/pages/video/VideoDetail.vue';
import Library from '@/pages/library/Library.vue';
import History from '@/pages/library/History.vue';
import { useVideoStore } from '@/stores/video';
import { useHistoryStore } from '@/stores/history';
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
            path: '/library',
            component: Library,
        },
        {
            path: '/history',
            component: History,
        },
    ],
});
describe('视频浏览流程集成测试', () => {
    const mockVideos = [
        {
            id: '1',
            title: '测试视频1',
            description: '这是一个测试视频',
            coverUrl: 'https://example.com/cover1.jpg',
            duration: 120,
            views: 1000,
            likes: 100,
            favorites: 50,
            createdAt: '2024-01-01T00:00:00Z',
            author: {
                id: '1',
                username: 'testuser1',
                avatar: 'https://example.com/avatar1.jpg',
                nickname: '测试用户1',
            },
            tags: ['测试', '视频'],
            category: '测试分类',
            isLiked: false,
            isFavorited: false,
        },
        {
            id: '2',
            title: '测试视频2',
            description: '这是另一个测试视频',
            coverUrl: 'https://example.com/cover2.jpg',
            duration: 180,
            views: 2000,
            likes: 200,
            favorites: 100,
            createdAt: '2024-01-02T00:00:00Z',
            author: {
                id: '2',
                username: 'testuser2',
                avatar: 'https://example.com/avatar2.jpg',
                nickname: '测试用户2',
            },
            tags: ['测试', '视频'],
            category: '测试分类',
            isLiked: false,
            isFavorited: false,
        },
    ];
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('浏览首页视频列表', async () => {
        const videoStore = useVideoStore();
        vi.spyOn(videoStore, 'getVideos').mockResolvedValue(mockVideos);
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
        expect(videoStore.getVideos).toHaveBeenCalled();
        expect(wrapper.findAll('.video-card')).toHaveLength(mockVideos.length);
    });
    it('查看视频详情并添加到历史记录', async () => {
        const videoStore = useVideoStore();
        const historyStore = useHistoryStore();
        vi.spyOn(videoStore, 'getVideoDetail').mockResolvedValue(mockVideos[0]);
        vi.spyOn(historyStore, 'addToWatchHistory').mockResolvedValue();
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
        expect(videoStore.getVideoDetail).toHaveBeenCalledWith('1');
        expect(historyStore.addToWatchHistory).toHaveBeenCalledWith('1');
    });
    it('收藏视频并在收藏夹中查看', async () => {
        const videoStore = useVideoStore();
        vi.spyOn(videoStore, 'toggleFavorite').mockResolvedValue();
        vi.spyOn(videoStore, 'getLibraryVideos').mockResolvedValue([mockVideos[0]]);
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
        await wrapper.find('.favorite-btn').trigger('click');
        expect(videoStore.toggleFavorite).toHaveBeenCalledWith('1');
        const libraryWrapper = mount(Library, {
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
        await libraryWrapper.vm.$nextTick();
        expect(videoStore.getLibraryVideos).toHaveBeenCalled();
        expect(libraryWrapper.findAll('.video-card')).toHaveLength(1);
    });
    it('查看观看历史', async () => {
        const historyStore = useHistoryStore();
        vi.spyOn(historyStore, 'getWatchHistory').mockResolvedValue(mockVideos);
        const wrapper = mount(History, {
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
        expect(historyStore.getWatchHistory).toHaveBeenCalled();
        expect(wrapper.findAll('.video-card')).toHaveLength(mockVideos.length);
    });
    it('从历史记录中移除视频', async () => {
        const historyStore = useHistoryStore();
        vi.spyOn(historyStore, 'removeFromWatchHistory').mockResolvedValue();
        const wrapper = mount(History, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            auth: {
                                isAuthenticated: true,
                            },
                            history: {
                                watchHistory: mockVideos,
                            },
                        },
                    }),
                    router,
                ],
            },
        });
        await wrapper.find('.remove-video-btn').trigger('click');
        expect(historyStore.removeFromWatchHistory).toHaveBeenCalledWith(mockVideos[0].id);
    });
});
//# sourceMappingURL=video-browsing.spec.js.map