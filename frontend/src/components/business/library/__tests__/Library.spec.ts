import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Library from '../Library.vue';
import { createTestingPinia } from '@pinia/testing';
import { useVideoStore } from '@/stores/video';
import { useAuthStore } from '@/stores/auth';

describe('Library', () => {
  const mockVideos = [
    {
      id: '1',
      title: '测试视频1',
      description: '这是一个测试视频',
      coverUrl: 'https://example.com/cover1.jpg',
      duration: 120,
      views: 1000,
      likes: 100,
      favorites: 50,
      createdAt: '2024-01-01T00:00:00Z',
      author: {
        id: '1',
        username: 'testuser1',
        avatar: 'https://example.com/avatar1.jpg',
        nickname: '测试用户1',
      },
      tags: ['测试', '视频'],
      category: '测试分类',
      isLiked: false,
      isFavorited: true,
    },
    {
      id: '2',
      title: '测试视频2',
      description: '这是另一个测试视频',
      coverUrl: 'https://example.com/cover2.jpg',
      duration: 180,
      views: 2000,
      likes: 200,
      favorites: 100,
      createdAt: '2024-01-02T00:00:00Z',
      author: {
        id: '2',
        username: 'testuser2',
        avatar: 'https://example.com/avatar2.jpg',
        nickname: '测试用户2',
      },
      tags: ['测试', '视频'],
      category: '测试分类',
      isLiked: false,
      isFavorited: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未登录时显示登录提示', () => {
    const wrapper = mount(Library, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: false,
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.find('.login-prompt').exists()).toBe(true);
  });

  it('已登录时获取收藏视频', async () => {
    const videoStore = useVideoStore();
    vi.spyOn(videoStore, 'getLibraryVideos').mockResolvedValue(mockVideos);

    const wrapper = mount(Library, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
              },
            },
          }),
        ],
      },
    });

    await wrapper.vm.$nextTick();
    expect(videoStore.getLibraryVideos).toHaveBeenCalled();
  });

  it('切换收藏状态', async () => {
    const videoStore = useVideoStore();
    vi.spyOn(videoStore, 'toggleFavorite').mockResolvedValue();

    const wrapper = mount(Library, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
              },
            },
          }),
        ],
      },
    });

    await wrapper.find('.favorite-btn').trigger('click');
    expect(videoStore.toggleFavorite).toHaveBeenCalledWith(mockVideos[0].id);
  });

  it('切换标签页', async () => {
    const wrapper = mount(Library, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
              },
            },
          }),
        ],
      },
    });

    await wrapper.find('.playlists-tab').trigger('click');
    expect(wrapper.find('.playlists-content').exists()).toBe(true);
  });

  it('搜索视频', async () => {
    const wrapper = mount(Library, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
              },
            },
          }),
        ],
      },
    });

    await wrapper.find('.search-input').setValue('测试');
    await wrapper.find('.search-btn').trigger('click');
    expect(wrapper.find('.search-results').exists()).toBe(true);
  });
});
