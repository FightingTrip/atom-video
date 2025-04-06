/**
 * @file TagDetail.test.ts
 * @description TagDetail 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useVideoStore } from '@/stores/video';
import { useTagStore } from '@/stores/tag';
import TagDetail from '../TagDetail.vue';

// Mock stores
vi.mock('@/stores/video', () => ({
  useVideoStore: vi.fn(() => ({
    tagVideos: [],
    fetchTagVideos: vi.fn(),
    loading: false,
    error: null,
  })),
}));

vi.mock('@/stores/tag', () => ({
  useTagStore: vi.fn(() => ({
    currentTag: null,
    fetchTagDetails: vi.fn(),
    fetchRelatedTags: vi.fn(),
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
      tag: {
        title: '标签详情',
        description: '标签描述',
        usageCount: '使用次数',
        videos: '相关视频',
        relatedTags: '相关标签',
      },
    },
    'en-US': {
      tag: {
        title: 'Tag Details',
        description: 'Tag Description',
        usageCount: 'Usage Count',
        videos: 'Related Videos',
        relatedTags: 'Related Tags',
      },
    },
  },
});

describe('TagDetail', () => {
  let wrapper: any;
  let videoStore: any;
  let tagStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    videoStore = useVideoStore(pinia);
    tagStore = useTagStore(pinia);

    wrapper = mount(TagDetail, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染标签详情页面', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.tag-detail').exists()).toBe(true);
  });

  it('加载标签基本信息', async () => {
    const mockTag = {
      id: '1',
      name: '测试标签',
      description: '这是一个测试标签',
      usageCount: 100,
      createdAt: '2025-04-06T00:00:00Z',
    };

    tagStore.currentTag = mockTag;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.tag-name').text()).toBe('测试标签');
    expect(wrapper.find('.tag-description').text()).toBe('这是一个测试标签');
    expect(wrapper.find('.usage-count').text()).toBe('100');
  });

  it('加载标签相关视频', async () => {
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
      },
    ];

    videoStore.tagVideos = mockVideos;
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

  it('加载相关标签', async () => {
    const mockRelatedTags = [
      {
        id: '2',
        name: '相关标签1',
        usageCount: 50,
      },
      {
        id: '3',
        name: '相关标签2',
        usageCount: 30,
      },
    ];

    tagStore.relatedTags = mockRelatedTags;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.related-tags').exists()).toBe(true);
    expect(wrapper.findAll('.related-tag')).toHaveLength(2);
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
