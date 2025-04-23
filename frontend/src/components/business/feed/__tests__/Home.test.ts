/**
 * @file HomeVideoList.test.ts
 * @description HomeVideoList组件单元测试
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';
import HomeVideoList from '@/components/business/home/HomeVideoList.vue';
import { createI18n } from 'vue-i18n';
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
    title: '视频1',
    description: '视频描述1',
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
    title: '视频2',
    description: '视频描述2',
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

describe('HomeVideoList', () => {
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
          hasMoreVideos: true,
          selectedCategory: '全部',
        },
      },
    });

    // 挂载组件
    wrapper = mount(HomeVideoList, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          VideoCard: true,
          NSpin: true,
          NEmpty: true,
          NButton: true,
          NSpace: true,
        },
      },
    });
  });

  it('应该正确渲染视频列表', () => {
    const videoStore = useVideoStore();
    videoStore.videos = mockVideos;

    const videosGrid = wrapper.find('.videos-grid');
    expect(videosGrid.exists()).toBe(true);

    const videoCards = wrapper.findAllComponents({ name: 'VideoCard' });
    expect(videoCards.length).toBe(mockVideos.length);
  });

  it('应该显示加载状态', async () => {
    const videoStore = useVideoStore();
    videoStore.loading = true;
    await wrapper.vm.$nextTick();

    const loadingContainer = wrapper.find('.loading-container');
    expect(loadingContainer.exists()).toBe(true);
  });

  it('应该在组件挂载时加载视频和类别', () => {
    const videoStore = useVideoStore();
    expect(videoStore.fetchVideos).toHaveBeenCalled();
  });

  it('点击分类按钮应该筛选视频', async () => {
    const categoryButtons = wrapper.findAll('.category-btn');
    if (categoryButtons.length > 1) {
      await categoryButtons[1].trigger('click');
      expect(wrapper.vm.selectCategory).toHaveBeenCalled();
    }
  });

  it('点击加载更多按钮应该加载更多视频', async () => {
    const videoStore = useVideoStore();
    videoStore.hasMoreVideos = true;
    await wrapper.vm.$nextTick();

    const loadMoreButton = wrapper.find('.load-more button');
    if (loadMoreButton.exists()) {
      await loadMoreButton.trigger('click');
      expect(wrapper.vm.loadMoreVideos).toHaveBeenCalled();
    }
  });
});
