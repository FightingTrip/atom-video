/**
 * @file videoService.ts
 * @description 视频服务模块，提供视频相关的API请求封装
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { apiClient, apiRequest } from '@/services/api/client';
import { Video } from '@/models/Video';
import { PaginatedData, ApiResponse } from '@/services/api/types';
import {
  VideoUploadRequest,
  VideoUpdateRequest,
  VideoQueryParams,
  VideoComment,
  VideoInteraction,
} from './types';

// 缓存生成的视频数据
let cachedVideos: Video[] | null = null;

// 创建视频服务
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  createdAt: string;
  tags: string[];
  user: {
    id: string;
    nickname: string;
    avatar: string;
    verified: boolean;
    followersCount?: number;
    followingCount?: number;
  };
}

// 生成视频数据
const generateMockVideos = (count: number): Video[] => {
  if (cachedVideos) {
    return cachedVideos;
  }

  try {
    const videos = Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement([
        'Vue 3 完整教程 2024',
        'React 实战项目开发',
        'TypeScript 高级特性详解',
        'Node.js 服务端开发实践',
        'Python 数据分析入门',
      ]),
      description: faker.lorem.paragraphs(2),
      thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/480/270`,
      duration: faker.number.int({ min: 300, max: 7200 }),
      views: faker.number.int({ min: 1000, max: 1000000 }),
      likes: faker.number.int({ min: 100, max: 50000 }),
      dislikes: faker.number.int({ min: 0, max: 1000 }),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      tags: faker.helpers.arrayElements(
        ['javascript', 'typescript', 'vue', 'react', 'nodejs'],
        faker.number.int({ min: 1, max: 3 })
      ),
      user: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        verified: faker.datatype.boolean(0.2),
      },
    }));

    cachedVideos = videos;
    return videos;
  } catch (error) {
    console.error('Error generating mock videos:', error);
    return [];
  }
};

// 创建视频服务
export const videoService = {
  // 获取视频列表
  async getVideos(params?: VideoQueryParams): Promise<ApiResponse<PaginatedData<Video>>> {
    return apiRequest(apiClient.get<PaginatedData<Video>>('/videos', { params }));
  },

  // 获取单个视频详情
  async getVideoById(id: string): Promise<ApiResponse<Video>> {
    return apiRequest(apiClient.get<Video>(`/videos/${id}`));
  },

  // 上传视频
  async uploadVideo(data: VideoUploadRequest): Promise<ApiResponse<Video>> {
    const formData = new FormData();

    // 添加视频元数据
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category.toString());

    // 添加标签
    data.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // 添加视频文件
    formData.append('videoFile', data.videoFile);

    // 添加缩略图文件（如果有）
    if (data.thumbnailFile) {
      formData.append('thumbnailFile', data.thumbnailFile);
    }

    // 添加发布状态
    if (data.isPublished !== undefined) {
      formData.append('isPublished', String(data.isPublished));
    }

    return apiRequest(
      apiClient.post<Video>('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  },

  // 更新视频信息
  async updateVideo(id: string, data: VideoUpdateRequest): Promise<ApiResponse<Video>> {
    return apiRequest(apiClient.put<Video>(`/videos/${id}`, data));
  },

  // 删除视频
  async deleteVideo(id: string): Promise<ApiResponse<void>> {
    return apiRequest(apiClient.delete(`/videos/${id}`));
  },

  // 获取相关视频
  async getRelatedVideos(id: string, limit: number = 10): Promise<ApiResponse<Video[]>> {
    return apiRequest(
      apiClient.get<Video[]>(`/videos/${id}/related`, {
        params: { limit },
      })
    );
  },

  // 增加视频观看次数
  async incrementViews(id: string): Promise<ApiResponse<{ views: number }>> {
    return apiRequest(apiClient.post<{ views: number }>(`/videos/${id}/view`));
  },

  // 获取用户上传的视频
  async getUserVideos(
    userId: string,
    params?: VideoQueryParams
  ): Promise<ApiResponse<PaginatedData<Video>>> {
    return apiRequest(
      apiClient.get<PaginatedData<Video>>(`/users/${userId}/videos`, {
        params,
      })
    );
  },

  // 获取视频评论
  async getVideoComments(
    videoId: string,
    params?: { page: number; pageSize: number }
  ): Promise<
    ApiResponse<{
      comments: VideoComment[];
      total: number;
      totalPages: number;
    }>
  > {
    return apiRequest(
      apiClient.get(`/videos/${videoId}/comments`, {
        params,
      })
    );
  },

  // 添加评论
  async addComment(videoId: string, content: string): Promise<ApiResponse<VideoComment>> {
    return apiRequest(
      apiClient.post(`/videos/${videoId}/comments`, {
        content,
      })
    );
  },

  // 回复评论
  async replyToComment(
    videoId: string,
    commentId: string,
    content: string
  ): Promise<ApiResponse<VideoComment>> {
    return apiRequest(
      apiClient.post(`/videos/${videoId}/comments/${commentId}/replies`, {
        content,
      })
    );
  },

  // 视频点赞/取消点赞
  async likeVideo(
    videoId: string,
    action: 'like' | 'unlike'
  ): Promise<ApiResponse<{ likes: number }>> {
    return apiRequest(apiClient.post(`/videos/${videoId}/${action}`));
  },

  // 视频收藏/取消收藏
  async favoriteVideo(
    videoId: string,
    action: 'favorite' | 'unfavorite'
  ): Promise<ApiResponse<{ favorites: number }>> {
    return apiRequest(apiClient.post(`/videos/${videoId}/${action}`));
  },

  // 关注/取消关注作者
  async subscribeAuthor(
    authorId: string,
    action: 'subscribe' | 'unsubscribe'
  ): Promise<ApiResponse<{ followers: number }>> {
    return apiRequest(apiClient.post(`/users/${authorId}/${action}`));
  },

  // 获取视频互动状态
  async getVideoInteraction(videoId: string): Promise<ApiResponse<VideoInteraction>> {
    return apiRequest(apiClient.get(`/videos/${videoId}/interaction`));
  },

  // 点赞评论
  async likeComment(videoId: string, commentId: string): Promise<ApiResponse<{ likes: number }>> {
    return apiRequest(apiClient.post(`/videos/${videoId}/comments/${commentId}/like`));
  },

  // 举报视频
  async reportVideo(
    videoId: string,
    reason: string,
    description?: string
  ): Promise<ApiResponse<void>> {
    return apiRequest(
      apiClient.post(`/videos/${videoId}/report`, {
        reason,
        description,
      })
    );
  },

  // 搜索视频
  async searchVideos(
    query: string,
    params?: VideoQueryParams
  ): Promise<ApiResponse<PaginatedData<Video>>> {
    return apiRequest(
      apiClient.get('/videos/search', {
        params: {
          ...params,
          q: query,
        },
      })
    );
  },

  // 获取推荐视频
  async getRecommendedVideos(limit: number = 20): Promise<ApiResponse<Video[]>> {
    return apiRequest(
      apiClient.get('/videos/recommended', {
        params: { limit },
      })
    );
  },

  // 获取热门视频
  async getTrendingVideos(limit: number = 20): Promise<ApiResponse<Video[]>> {
    return apiRequest(
      apiClient.get('/videos/trending', {
        params: { limit },
      })
    );
  },

  // 获取最新视频
  async getNewVideos(limit: number = 20): Promise<ApiResponse<Video[]>> {
    return apiRequest(
      apiClient.get('/videos/new', {
        params: { limit },
      })
    );
  },
};
