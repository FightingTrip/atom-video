/**
 * @file ExploreCategoryComponent.test.ts
 * @description 探索类别组件单元测试
 * @author Atom Video Team
 * @date 2025-04-09
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ExploreCategoryComponent from '../ExploreCategoryComponent.vue';
import { createI18n } from 'vue-i18n';

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
const mockCategories = [
  { id: 'tech', name: '科技', videoCount: 120 },
  { id: 'music', name: '音乐', videoCount: 350 },
  { id: 'gaming', name: '游戏', videoCount: 280 },
  { id: 'education', name: '教育', videoCount: 150 },
];

const mockVideos = [
  {
    id: '1',
    title: '视频1',
    coverUrl: 'https://example.com/cover1.jpg',
    views: 1000,
    createdAt: '2025-04-06T00:00:00Z',
    duration: 120,
    author: { id: 'user1', name: '用户1', avatar: 'https://example.com/avatar1.jpg' },
    category: 'tech',
  },
  {
    id: '2',
    title: '视频2',
    coverUrl: 'https://example.com/cover2.jpg',
    views: 2000,
    createdAt: '2025-04-05T00:00:00Z',
    duration: 180,
    author: { id: 'user2', name: '用户2', avatar: 'https://example.com/avatar2.jpg' },
    category: 'music',
  },
];

describe('ExploreCategoryComponent', () => {
  let wrapper: any;

  beforeEach(() => {
    // 创建测试用的 Pinia store
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        category: {
          categories: mockCategories,
          loading: false,
        },
        video: {
          categoryVideos: mockVideos,
          loading: false,
        },
      },
    });

    // 挂载组件
    wrapper = mount(ExploreCategoryComponent, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          VideoCard: true,
          NSpin: true,
          NEmpty: true,
          NCategorySelector: true,
        },
      },
    });
  });

  it('应该正确渲染类别列表', () => {
    const categorySelector = wrapper.findComponent({ name: 'NCategorySelector' });
    expect(categorySelector.exists()).toBe(true);
    expect(categorySelector.props('categories')).toEqual(mockCategories);
  });

  it('应该正确渲染视频列表', () => {
    const videosGrid = wrapper.find('.explore-videos-grid');
    expect(videosGrid.exists()).toBe(true);

    const videoCards = wrapper.findAllComponents({ name: 'VideoCard' });
    expect(videoCards.length).toBe(mockVideos.length);
  });

  it('应该在组件挂载时加载类别和视频', () => {
    const categoryStore = wrapper.vm.categoryStore;
    const videoStore = wrapper.vm.videoStore;

    expect(categoryStore.fetchCategories).toHaveBeenCalled();
    expect(videoStore.fetchCategoryVideos).toHaveBeenCalled();
  });

  it('应该显示加载状态', async () => {
    const videoStore = wrapper.vm.videoStore;
    videoStore.loading = true;
    await wrapper.vm.$nextTick();

    const loadingSpinner = wrapper.find('.loading-state');
    expect(loadingSpinner.exists()).toBe(true);
  });

  it('选择类别时应该加载对应类别的视频', async () => {
    const categorySelector = wrapper.findComponent({ name: 'NCategorySelector' });
    await categorySelector.vm.$emit('select', 'music');

    const videoStore = wrapper.vm.videoStore;
    expect(videoStore.fetchCategoryVideos).toHaveBeenCalledWith('music');
  });
});
