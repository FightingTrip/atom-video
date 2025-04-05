/**
 * @file History.test.ts
 * @description History 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useVideoStore } from '@/stores/video';
import { useUserStore } from '@/stores/user';
import History from '../History.vue';

// Mock stores
vi.mock('@/stores/video', () => ({
  useVideoStore: vi.fn(() => ({
    fetchWatchHistory: vi.fn(),
    watchHistory: [],
    loading: false,
    error: null,
  })),
}));

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    user: {
      id: '1',
      username: 'test',
      email: 'test@example.com',
    },
  })),
}));

describe('History', () => {
  let wrapper: any;
  let videoStore: any;
  let userStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    videoStore = useVideoStore(pinia);
    userStore = useUserStore(pinia);

    wrapper = mount(History, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('正确渲染观看历史页面', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.history-container').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('观看历史');
  });

  it('加载历史记录', async () => {
    const mockHistory = [
      {
        id: '1',
        title: '测试视频1',
        description: '测试描述1',
        coverUrl: 'http://example.com/cover1.jpg',
        duration: 120,
        views: 1000,
        likes: 100,
        favorites: 50,
        comments: 20,
        createdAt: '2025-04-06T00:00:00Z',
        watchedAt: '2025-04-06T10:00:00Z',
        author: {
          id: '1',
          username: 'test',
          avatar: 'http://example.com/avatar.jpg',
        },
        tags: ['测试', '视频'],
        sources: [],
        subtitles: [],
      },
    ];

    videoStore.watchHistory = mockHistory;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.history-list').exists()).toBe(true);
    expect(wrapper.findAll('.history-item')).toHaveLength(1);
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

  it('支持时间范围筛选', async () => {
    await wrapper.find('.date-range-select').setValue('week');
    expect(videoStore.fetchWatchHistory).toHaveBeenCalledWith({
      timeRange: 'week',
      page: 1,
      limit: 12,
    });
  });

  it('支持历史记录排序', async () => {
    await wrapper.find('.sort-select').setValue('watchedAt');
    expect(videoStore.fetchWatchHistory).toHaveBeenCalledWith({
      sort: 'watchedAt',
      page: 1,
      limit: 12,
    });
  });

  it('支持历史记录搜索', async () => {
    await wrapper.find('.search-input').setValue('测试视频');
    await wrapper.find('.search-button').trigger('click');
    expect(videoStore.fetchWatchHistory).toHaveBeenCalledWith({
      search: '测试视频',
      page: 1,
      limit: 12,
    });
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
