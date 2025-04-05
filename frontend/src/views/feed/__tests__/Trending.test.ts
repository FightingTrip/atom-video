/**
 * @file Trending.test.ts
 * @description Trending 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useVideoStore } from '@/stores/video';
import Trending from '../Trending.vue';

// Mock store
vi.mock('@/stores/video', () => ({
  useVideoStore: vi.fn(() => ({
    trendingVideos: [],
    fetchTrendingVideos: vi.fn(),
    loading: false,
    error: null,
  })),
}));

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      feed: {
        trending: '趋势',
        today: '今日',
        week: '本周',
        month: '本月',
        all: '全部',
      },
    },
    'en-US': {
      feed: {
        trending: 'Trending',
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        all: 'All',
      },
    },
  },
});

describe('Trending', () => {
  let wrapper: any;
  let videoStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    videoStore = useVideoStore(pinia);

    wrapper = mount(Trending, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染趋势页面组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.trending-container').exists()).toBe(true);
  });

  it('加载趋势视频列表', async () => {
    const mockVideos = [
      {
        id: '1',
        title: '趋势视频1',
        description: '趋势描述1',
        coverUrl: 'http://example.com/cover1.jpg',
        duration: 120,
        views: 1000,
        likes: 100,
        favorites: 50,
        comments: 20,
        createdAt: '2025-04-06T00:00:00Z',
      },
    ];

    videoStore.trendingVideos = mockVideos;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.video-grid').exists()).toBe(true);
    expect(wrapper.findAll('.video-card')).toHaveLength(1);
  });

  it('切换时间范围', async () => {
    await wrapper.find('.time-range-select').setValue('week');
    await wrapper.vm.$nextTick();

    expect(videoStore.fetchTrendingVideos).toHaveBeenCalledWith({
      timeRange: 'week',
    });
  });

  it('切换分类筛选', async () => {
    await wrapper.find('.category-select').setValue('gaming');
    await wrapper.vm.$nextTick();

    expect(videoStore.fetchTrendingVideos).toHaveBeenCalledWith({
      category: 'gaming',
    });
  });

  it('切换地区筛选', async () => {
    await wrapper.find('.region-select').setValue('CN');
    await wrapper.vm.$nextTick();

    expect(videoStore.fetchTrendingVideos).toHaveBeenCalledWith({
      region: 'CN',
    });
  });

  it('显示加载状态', async () => {
    videoStore.loading = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('显示错误信息', async () => {
    videoStore.error = '加载失败';
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toBe('加载失败');
  });

  it('响应式布局调整', async () => {
    // 模拟移动端屏幕
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.mobile-layout').exists()).toBe(true);
  });

  it('应用主题样式', async () => {
    // 模拟暗色主题
    document.documentElement.classList.add('dark');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.dark-theme').exists()).toBe(true);
  });
});
