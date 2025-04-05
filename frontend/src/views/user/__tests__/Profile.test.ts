/**
 * @file Profile.test.ts
 * @description Profile 组件的测试用例
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import { useVideoStore } from '@/stores/video';
import Profile from '../Profile.vue';

// Mock stores
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    user: null,
    fetchUserProfile: vi.fn(),
    updateUserProfile: vi.fn(),
  })),
}));

vi.mock('@/stores/video', () => ({
  useVideoStore: vi.fn(() => ({
    userVideos: [],
    fetchUserVideos: vi.fn(),
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
      profile: {
        title: '个人资料',
        basicInfo: '基本信息',
        statistics: '统计数据',
        videos: '我的视频',
      },
    },
    'en-US': {
      profile: {
        title: 'Profile',
        basicInfo: 'Basic Information',
        statistics: 'Statistics',
        videos: 'My Videos',
      },
    },
  },
});

describe('Profile', () => {
  let wrapper: any;
  let userStore: any;
  let videoStore: any;

  beforeEach(() => {
    const pinia = createTestingPinia();
    userStore = useUserStore(pinia);
    videoStore = useVideoStore(pinia);

    wrapper = mount(Profile, {
      global: {
        plugins: [pinia, i18n],
      },
    });
  });

  it('正确渲染个人资料页面', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.profile-page').exists()).toBe(true);
  });

  it('加载用户基本信息', async () => {
    const mockUser = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      avatar: 'http://example.com/avatar.jpg',
      bio: '测试用户简介',
    };

    userStore.user = mockUser;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.username').text()).toBe('test');
    expect(wrapper.find('.email').text()).toBe('test@example.com');
    expect(wrapper.find('.bio').text()).toBe('测试用户简介');
  });

  it('显示用户统计数据', async () => {
    const mockStats = {
      videoCount: 10,
      followerCount: 100,
      followingCount: 50,
    };

    userStore.user = {
      ...userStore.user,
      ...mockStats,
    };
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.video-count').text()).toBe('10');
    expect(wrapper.find('.follower-count').text()).toBe('100');
    expect(wrapper.find('.following-count').text()).toBe('50');
  });

  it('加载用户视频列表', async () => {
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

    videoStore.userVideos = mockVideos;
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
