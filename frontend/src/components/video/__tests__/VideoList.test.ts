/**
 * @file VideoList.test.ts
 * @description VideoList 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useVideoStore } from '@/stores/video';
import VideoList from '../VideoList.vue';

// Mock store
vi.mock('@/stores/video', () => ({
  useVideoStore: vi.fn(() => ({
    fetchVideos: vi.fn(),
    videos: [],
    loading: false,
    error: null,
  })),
}));

describe('VideoList', () => {
  let wrapper: any;
  let videoStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    videoStore = useVideoStore(pinia);

    wrapper = mount(VideoList, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('正确渲染视频列表组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.video-list').exists()).toBe(true);
  });

  it('加载视频列表', async () => {
    const mockVideos = [
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

    videoStore.videos = mockVideos;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.video-grid').exists()).toBe(true);
    expect(wrapper.findAll('.video-card')).toHaveLength(1);
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

  it('支持视频分类筛选', async () => {
    await wrapper.find('.category-select').setValue('教育');
    expect(videoStore.fetchVideos).toHaveBeenCalledWith({
      category: '教育',
      page: 1,
      limit: 12,
    });
  });

  it('支持视频排序', async () => {
    await wrapper.find('.sort-select').setValue('views');
    expect(videoStore.fetchVideos).toHaveBeenCalledWith({
      sort: 'views',
      page: 1,
      limit: 12,
    });
  });

  it('支持视频搜索', async () => {
    await wrapper.find('.search-input').setValue('测试视频');
    await wrapper.find('.search-button').trigger('click');
    expect(videoStore.fetchVideos).toHaveBeenCalledWith({
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
