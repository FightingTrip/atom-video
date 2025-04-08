/**
 * @file Trending.test.ts
 * @description 热门视频组件测试
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import Trending from '../Trending.vue';
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
const mockVideos = [
  {
    id: '1',
    title: '热门视频1',
    description: '热门视频描述1',
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
  {
    id: '2',
    title: '热门视频2',
    description: '热门视频描述2',
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

describe('Trending', () => {
  let wrapper: any;

  beforeEach(() => {
    // 创建测试用的 Pinia store
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        video: {
          videos: mockVideos,
          loading: false,
          error: null,
        },
      },
    });

    // 挂载组件
    wrapper = mount(Trending, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('应该正确渲染所有区域', () => {
    // 检查时间范围选择器
    const timeRangeSelector = wrapper.findComponent({ name: 'TimeRangeSelector' });
    expect(timeRangeSelector.exists()).toBe(true);
    expect(timeRangeSelector.props('modelValue')).toBe('day');

    // 检查视频列表
    const videoList = wrapper.find('.video-list');
    expect(videoList.exists()).toBe(true);
    const videoCards = wrapper.findAllComponents({ name: 'VideoCard' });
    expect(videoCards).toHaveLength(2);
    expect(videoCards[0].props('rank')).toBe(1);
    expect(videoCards[1].props('rank')).toBe(2);
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

  it('应该显示空状态', async () => {
    const videoStore = useVideoStore();
    videoStore.videos = [];
    await wrapper.vm.$nextTick();

    const emptyState = wrapper.findComponent({ name: 'EmptyState' });
    expect(emptyState.exists()).toBe(true);
    expect(emptyState.props('message')).toBe('暂无热门视频');
  });

  it('切换时间范围时应该更新视频列表', async () => {
    const timeRangeSelector = wrapper.findComponent({ name: 'TimeRangeSelector' });
    await timeRangeSelector.vm.$emit('update:modelValue', 'week');
    await timeRangeSelector.vm.$emit('change');

    const videoStore = useVideoStore();
    expect(videoStore.fetchTrendingVideos).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      timeRange: 'week',
    });
  });

  it('点击加载更多按钮应该加载下一页', async () => {
    const loadMoreButton = wrapper.find('.load-more button');
    await loadMoreButton.trigger('click');

    const videoStore = useVideoStore();
    expect(videoStore.fetchTrendingVideos).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      timeRange: 'day',
    });
  });

  it('点击视频卡片应该跳转到视频详情页', async () => {
    const router = {
      push: vi.fn(),
    };
    wrapper.vm.$router = router;

    const videoCard = wrapper.findComponent({ name: 'VideoCard' });
    await videoCard.trigger('click');

    expect(router.push).toHaveBeenCalledWith('/video/1');
  });

  it('应该在组件挂载时加载数据', () => {
    const videoStore = useVideoStore();
    expect(videoStore.fetchTrendingVideos).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
    });
  });
}); 