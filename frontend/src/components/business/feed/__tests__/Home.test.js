/**
 * @file Home.test.ts
 * @description 首页组件测试
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import Home from '../Home.vue';
import { useVideoStore } from '@/stores/video';
// 创建测试用的 i18n 实例
const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    messages: {
        'zh-CN': {
            common: {
                loading: '加载中...',
                error: '加载失败',
                empty: '暂无数据',
            },
        },
    },
});
// 模拟数据
const mockRecommendedVideos = [
    {
        id: '1',
        title: '推荐视频1',
        description: '推荐视频描述1',
        coverUrl: 'https://example.com/cover1.jpg',
        videoUrl: 'https://example.com/video1.mp4',
        duration: 120,
        views: 1000,
        likes: 100,
        favorites: 50,
        comments: 20,
        status: 'published',
        category: 'entertainment',
        tags: ['test', 'video'],
        userId: 'user1',
        createdAt: '2025-04-06T00:00:00Z',
        updatedAt: '2025-04-06T00:00:00Z',
    },
];
const mockTrendingVideos = [
    {
        id: '2',
        title: '热门视频1',
        description: '热门视频描述1',
        coverUrl: 'https://example.com/cover2.jpg',
        videoUrl: 'https://example.com/video2.mp4',
        duration: 180,
        views: 2000,
        likes: 200,
        favorites: 100,
        comments: 40,
        status: 'published',
        category: 'education',
        tags: ['test', 'video'],
        userId: 'user2',
        createdAt: '2025-04-06T00:00:00Z',
        updatedAt: '2025-04-06T00:00:00Z',
    },
];
const mockLatestVideos = [
    {
        id: '3',
        title: '最新视频1',
        description: '最新视频描述1',
        coverUrl: 'https://example.com/cover3.jpg',
        videoUrl: 'https://example.com/video3.mp4',
        duration: 150,
        views: 500,
        likes: 50,
        favorites: 25,
        comments: 10,
        status: 'published',
        category: 'gaming',
        tags: ['test', 'video'],
        userId: 'user3',
        createdAt: '2025-04-06T00:00:00Z',
        updatedAt: '2025-04-06T00:00:00Z',
    },
];
describe('Home', () => {
    let wrapper;
    beforeEach(() => {
        // 创建测试用的 Pinia store
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            initialState: {
                video: {
                    recommendedVideos: mockRecommendedVideos,
                    trendingVideos: mockTrendingVideos,
                    latestVideos: mockLatestVideos,
                    loading: false,
                    error: null,
                },
            },
        });
        // 挂载组件
        wrapper = mount(Home, {
            global: {
                plugins: [pinia, i18n],
            },
        });
    });
    it('应该正确渲染所有区域', () => {
        // 检查推荐视频区域
        const recommendedSection = wrapper.find('.recommended-section');
        expect(recommendedSection.exists()).toBe(true);
        expect(recommendedSection.find('.section-title').text()).toBe('为你推荐');
        expect(recommendedSection.findComponent({ name: 'VideoGrid' }).props('videos')).toEqual(mockRecommendedVideos);
        // 检查热门视频区域
        const trendingSection = wrapper.find('.trending-section');
        expect(trendingSection.exists()).toBe(true);
        expect(trendingSection.find('.section-title').text()).toBe('热门视频');
        expect(trendingSection.findComponent({ name: 'VideoGrid' }).props('videos')).toEqual(mockTrendingVideos);
        // 检查最新视频区域
        const latestSection = wrapper.find('.latest-section');
        expect(latestSection.exists()).toBe(true);
        expect(latestSection.find('.section-title').text()).toBe('最新视频');
        expect(latestSection.findComponent({ name: 'VideoGrid' }).props('videos')).toEqual(mockLatestVideos);
    });
    it('应该显示加载状态', async () => {
        const videoStore = useVideoStore();
        videoStore.loading = true;
        await wrapper.vm.$nextTick();
        const loadingSpinner = wrapper.findComponent({ name: 'LoadingSpinner' });
        expect(loadingSpinner.exists()).toBe(true);
    });
    it('应该显示错误信息', async () => {
        const videoStore = useVideoStore();
        videoStore.error = '加载失败';
        await wrapper.vm.$nextTick();
        const errorMessage = wrapper.findComponent({ name: 'ErrorMessage' });
        expect(errorMessage.exists()).toBe(true);
        expect(errorMessage.props('message')).toBe('加载失败');
    });
    it('点击视频卡片应该跳转到视频详情页', async () => {
        const router = {
            push: vi.fn(),
        };
        wrapper.vm.$router = router;
        const videoGrid = wrapper.findComponent({ name: 'VideoGrid' });
        await videoGrid.vm.$emit('video-click', mockRecommendedVideos[0]);
        expect(router.push).toHaveBeenCalledWith('/video/1');
    });
    it('应该在组件挂载时加载数据', () => {
        const videoStore = useVideoStore();
        expect(videoStore.fetchRecommendedVideos).toHaveBeenCalled();
        expect(videoStore.fetchTrendingVideos).toHaveBeenCalled();
        expect(videoStore.fetchLatestVideos).toHaveBeenCalled();
    });
});
//# sourceMappingURL=Home.test.js.map