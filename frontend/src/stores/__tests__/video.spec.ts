import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useVideoStore } from '../video';
import api from '@/utils/api';

vi.mock('@/utils/api');

describe('Video Store', () => {
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
      isFavorited: false,
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
      isFavorited: false,
    },
  ];

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('获取视频列表', async () => {
    const videoStore = useVideoStore();
    const mockResponse = {
      data: mockVideos,
      hasMore: true,
    };
    (api.get as any).mockResolvedValue(mockResponse);

    await videoStore.getVideos();

    expect(api.get).toHaveBeenCalledWith('/videos', {
      params: {
        page: 1,
        limit: 20,
        category: undefined,
      },
    });
    expect(videoStore.videos).toEqual(mockVideos);
    expect(videoStore.loading).toBe(false);
    expect(videoStore.error).toBeNull();
  });

  it('获取热门视频', async () => {
    const videoStore = useVideoStore();
    (api.get as any).mockResolvedValue({ data: mockVideos });

    await videoStore.getTrendingVideos();

    expect(api.get).toHaveBeenCalledWith('/videos/trending');
    expect(videoStore.videos).toEqual(mockVideos);
    expect(videoStore.loading).toBe(false);
    expect(videoStore.error).toBeNull();
  });

  it('获取推荐视频', async () => {
    const videoStore = useVideoStore();
    const mockResponse = {
      data: mockVideos,
      hasMore: true,
    };
    (api.get as any).mockResolvedValue(mockResponse);

    await videoStore.getRecommendedVideos();

    expect(api.get).toHaveBeenCalledWith('/videos/recommended', {
      params: {
        page: 1,
        limit: 20,
      },
    });
    expect(videoStore.videos).toEqual(mockVideos);
    expect(videoStore.loading).toBe(false);
    expect(videoStore.error).toBeNull();
  });

  it('获取收藏视频', async () => {
    const videoStore = useVideoStore();
    (api.get as any).mockResolvedValue({ data: mockVideos });

    await videoStore.getLibraryVideos();

    expect(api.get).toHaveBeenCalledWith('/videos/library');
    expect(videoStore.videos).toEqual(mockVideos);
    expect(videoStore.loading).toBe(false);
    expect(videoStore.error).toBeNull();
  });

  it('切换收藏状态', async () => {
    const videoStore = useVideoStore();
    (api.post as any).mockResolvedValue({ data: { isFavorited: true } });

    await videoStore.toggleFavorite('1');

    expect(api.post).toHaveBeenCalledWith('/videos/1/favorite');
    expect(videoStore.loading).toBe(false);
    expect(videoStore.error).toBeNull();
  });

  it('切换点赞状态', async () => {
    const videoStore = useVideoStore();
    (api.post as any).mockResolvedValue({ data: { isLiked: true } });

    await videoStore.toggleLike('1');

    expect(api.post).toHaveBeenCalledWith('/videos/1/like');
    expect(videoStore.loading).toBe(false);
    expect(videoStore.error).toBeNull();
  });

  it('处理API错误', async () => {
    const videoStore = useVideoStore();
    const error = new Error('API错误');
    (api.get as any).mockRejectedValue(error);

    await videoStore.getVideos();

    expect(videoStore.error).toBe('API错误');
    expect(videoStore.loading).toBe(false);
  });
});
