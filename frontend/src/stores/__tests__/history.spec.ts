import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHistoryStore } from '../history';
import api from '@/utils/api';

vi.mock('@/utils/api');

describe('History Store', () => {
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
      watchedAt: '2024-01-02T00:00:00Z',
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
      watchedAt: '2024-01-03T00:00:00Z',
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

  const mockSearchHistory = ['测试1', '测试2', '测试3'];

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('获取观看历史', async () => {
    const historyStore = useHistoryStore();
    (api.get as any).mockResolvedValue({ data: mockVideos });

    await historyStore.getWatchHistory();

    expect(api.get).toHaveBeenCalledWith('/history/watch');
    expect(historyStore.watchHistory).toEqual(mockVideos);
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('清除观看历史', async () => {
    const historyStore = useHistoryStore();
    (api.delete as any).mockResolvedValue({});

    await historyStore.clearWatchHistory();

    expect(api.delete).toHaveBeenCalledWith('/history/watch');
    expect(historyStore.watchHistory).toEqual([]);
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('从历史记录中移除视频', async () => {
    const historyStore = useHistoryStore();
    historyStore.watchHistory = [...mockVideos];
    (api.delete as any).mockResolvedValue({});

    await historyStore.removeFromWatchHistory('1');

    expect(api.delete).toHaveBeenCalledWith('/history/watch/1');
    expect(historyStore.watchHistory).toHaveLength(1);
    expect(historyStore.watchHistory[0].id).toBe('2');
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('添加视频到观看历史', async () => {
    const historyStore = useHistoryStore();
    (api.post as any).mockResolvedValue({});

    await historyStore.addToWatchHistory('1');

    expect(api.post).toHaveBeenCalledWith('/history/watch/1');
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('获取搜索历史', async () => {
    const historyStore = useHistoryStore();
    (api.get as any).mockResolvedValue({ data: mockSearchHistory });

    await historyStore.getSearchHistory();

    expect(api.get).toHaveBeenCalledWith('/history/search');
    expect(historyStore.searchHistory).toEqual(mockSearchHistory);
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('清除搜索历史', async () => {
    const historyStore = useHistoryStore();
    (api.delete as any).mockResolvedValue({});

    await historyStore.clearSearchHistory();

    expect(api.delete).toHaveBeenCalledWith('/history/search');
    expect(historyStore.searchHistory).toEqual([]);
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('从搜索历史中移除关键词', async () => {
    const historyStore = useHistoryStore();
    historyStore.searchHistory = [...mockSearchHistory];
    (api.delete as any).mockResolvedValue({});

    await historyStore.removeFromSearchHistory('测试1');

    expect(api.delete).toHaveBeenCalledWith('/history/search/%E6%B5%8B%E8%AF%951');
    expect(historyStore.searchHistory).toHaveLength(2);
    expect(historyStore.searchHistory[0]).toBe('测试2');
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('添加关键词到搜索历史', async () => {
    const historyStore = useHistoryStore();
    (api.post as any).mockResolvedValue({});

    await historyStore.addToSearchHistory('测试');

    expect(api.post).toHaveBeenCalledWith('/history/search/%E6%B5%8B%E8%AF%95');
    expect(historyStore.loading).toBe(false);
    expect(historyStore.error).toBeNull();
  });

  it('处理API错误', async () => {
    const historyStore = useHistoryStore();
    const error = new Error('API错误');
    (api.get as any).mockRejectedValue(error);

    await historyStore.getWatchHistory();

    expect(historyStore.error).toBe('API错误');
    expect(historyStore.loading).toBe(false);
  });
});
