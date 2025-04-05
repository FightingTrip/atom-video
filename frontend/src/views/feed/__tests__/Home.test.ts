/**
 * @file Home.test.ts
 * @description Home 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useVideoStore } from '@/stores/video';
import { useUserStore } from '@/stores/user';
import Home from '../Home.vue';

// Mock stores
vi.mock('@/stores/video', () => ({
  useVideoStore: vi.fn(() => ({
    followingVideos: [],
    fetchFollowingVideos: vi.fn(),
    loading: false,
    error: null,
  })),
}));

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    isAuthenticated: true,
    currentUser: {
      id: '1',
      username: 'testuser',
    },
  })),
}));

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      feed: {
        home: '首页',
        following: '关注',
        trending: '热门',
        explore: '发现',
      },
    },
    'en-US': {
      feed: {
        home: 'Home',
        following: 'Following',
        trending: 'Trending',
        explore: 'Explore',
      },
    },
  },
});

describe('Home', () => {
  let wrapper: any;
  let videoStore: any;
  let userStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    videoStore = useVideoStore(pinia);
    userStore = useUserStore(pinia);

    wrapper = mount(Home, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染首页组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.home-container').exists()).toBe(true);
  });

  it('加载关注视频列表', async () => {
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

    videoStore.followingVideos = mockVideos;
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

  it('未登录时显示提示信息', async () => {
    userStore.isAuthenticated = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.login-prompt').exists()).toBe(true);
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
