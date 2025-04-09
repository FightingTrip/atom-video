/**
 * @file UserProfileComponent.test.ts
 * @description 用户资料组件测试
 * @author Atom Video Team
 * @date 2025-04-08
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import UserProfileComponent from '../UserProfileComponent.vue';
import { useUserStore } from '@/stores/user';
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
const mockUser = {
  id: '1',
  username: '测试用户',
  bio: '这是一个测试用户',
  avatarUrl: 'https://example.com/avatar.jpg',
  videoCount: 10,
  followerCount: 100,
  followingCount: 50,
  isFollowing: false,
  createdAt: '2025-04-06T00:00:00Z',
  updatedAt: '2025-04-06T00:00:00Z',
};

const mockVideos = [
  {
    id: '1',
    title: '测试视频1',
    description: '测试视频描述1',
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
    userId: '1',
    createdAt: '2025-04-06T00:00:00Z',
    updatedAt: '2025-04-06T00:00:00Z',
  },
  {
    id: '2',
    title: '测试视频2',
    description: '测试视频描述2',
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
    userId: '1',
    createdAt: '2025-04-06T00:00:00Z',
    updatedAt: '2025-04-06T00:00:00Z',
  },
];

describe('UserProfileComponent', () => {
  let wrapper: any;

  beforeEach(() => {
    // 创建测试用的 Pinia store
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        user: {
          currentUser: mockUser,
          loading: false,
          error: null,
        },
        video: {
          videos: mockVideos,
          loading: false,
          error: null,
        },
      },
    });

    // 挂载组件
    wrapper = mount(UserProfileComponent, {
      global: {
        plugins: [pinia, i18n],
      },
      props: {
        userId: '1',
      },
    });
  });

  it('应该正确渲染用户信息', () => {
    // 检查头像
    const avatar = wrapper.findComponent({ name: 'Avatar' });
    expect(avatar.exists()).toBe(true);
    expect(avatar.props('src')).toBe(mockUser.avatarUrl);

    // 检查用户名
    const username = wrapper.find('.username');
    expect(username.text()).toBe(mockUser.username);

    // 检查个人简介
    const bio = wrapper.find('.bio');
    expect(bio.text()).toBe(mockUser.bio);

    // 检查统计数据
    const stats = wrapper.findAll('.stat-item');
    expect(stats).toHaveLength(3);
    expect(stats[0].find('.value').text()).toBe(mockUser.videoCount.toString());
    expect(stats[1].find('.value').text()).toBe(mockUser.followerCount.toString());
    expect(stats[2].find('.value').text()).toBe(mockUser.followingCount.toString());
  });

  it('当前用户应该显示编辑资料按钮', async () => {
    const userStore = useUserStore();
    userStore.currentUser = mockUser;
    await wrapper.vm.$nextTick();

    const editButton = wrapper.find('.profile-actions button');
    expect(editButton.text()).toBe('编辑资料');
  });

  it('非当前用户应该显示关注按钮', async () => {
    const userStore = useUserStore();
    userStore.currentUser = { ...mockUser, id: '2' };
    await wrapper.vm.$nextTick();

    const followButton = wrapper.find('.profile-actions button');
    expect(followButton.text()).toBe('关注');
  });

  it('应该显示视频列表', () => {
    const videoGrid = wrapper.findComponent({ name: 'VideoGrid' });
    expect(videoGrid.exists()).toBe(true);
    expect(videoGrid.props('videos')).toEqual(mockVideos);
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
    expect(emptyState.props('message')).toBe('暂无视频');
  });

  it('点击视频卡片应该跳转到视频详情页', async () => {
    const router = {
      push: vi.fn(),
    };
    wrapper.vm.$router = router;

    const videoGrid = wrapper.findComponent({ name: 'VideoGrid' });
    await videoGrid.vm.$emit('video-click', mockVideos[0]);

    expect(router.push).toHaveBeenCalledWith('/video/1');
  });

  it('点击关注按钮应该触发关注操作', async () => {
    const userStore = useUserStore();
    userStore.currentUser = { ...mockUser, id: '2' };
    await wrapper.vm.$nextTick();

    const followButton = wrapper.find('.profile-actions button');
    await followButton.trigger('click');

    expect(userStore.toggleFollow).toHaveBeenCalledWith(mockUser.id);
  });

  it('应该在组件挂载时加载数据', () => {
    const userStore = useUserStore();
    const videoStore = useVideoStore();

    expect(userStore.fetchUserProfile).toHaveBeenCalledWith('1');
    expect(videoStore.fetchUserVideos).toHaveBeenCalledWith({
      userId: '1',
      page: 1,
      pageSize: 12,
    });
  });
});
