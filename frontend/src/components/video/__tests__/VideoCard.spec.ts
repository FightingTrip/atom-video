import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VideoCard from '../VideoCard.vue';
import { createTestingPinia } from '@pinia/testing';

describe('VideoCard', () => {
  const mockVideo = {
    id: '1',
    title: '测试视频',
    description: '这是一个测试视频',
    coverUrl: 'https://example.com/cover.jpg',
    duration: 120,
    views: 1000,
    likes: 100,
    favorites: 50,
    createdAt: '2024-01-01T00:00:00Z',
    author: {
      id: '1',
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg',
      nickname: '测试用户',
    },
    tags: ['测试', '视频'],
    category: '测试分类',
    isLiked: false,
    isFavorited: false,
  };

  it('渲染视频卡片', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.find('.video-card').exists()).toBe(true);
    expect(wrapper.find('.video-title').text()).toBe(mockVideo.title);
    expect(wrapper.find('.video-author').text()).toBe(mockVideo.author.nickname);
    expect(wrapper.find('.video-stats').text()).toContain(mockVideo.views.toString());
  });

  it('点击视频卡片跳转到视频详情页', async () => {
    const router = {
      push: vi.fn(),
    };

    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          router,
        },
      },
    });

    await wrapper.find('.video-card').trigger('click');
    expect(router.push).toHaveBeenCalledWith(`/video/${mockVideo.id}`);
  });

  it('点击作者头像跳转到作者主页', async () => {
    const router = {
      push: vi.fn(),
    };

    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
      global: {
        plugins: [createTestingPinia()],
        mocks: {
          router,
        },
      },
    });

    await wrapper.find('.author-avatar').trigger('click');
    expect(router.push).toHaveBeenCalledWith(`/user/${mockVideo.author.id}`);
  });

  it('显示视频时长', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.find('.video-duration').text()).toBe('02:00');
  });

  it('显示视频标签', () => {
    const wrapper = mount(VideoCard, {
      props: {
        video: mockVideo,
      },
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const tags = wrapper.findAll('.video-tag');
    expect(tags).toHaveLength(mockVideo.tags.length);
    expect(tags[0].text()).toBe(mockVideo.tags[0]);
  });
});
