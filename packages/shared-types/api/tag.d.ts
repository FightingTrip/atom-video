/**
 * 标签API类型定义
 */
import { PaginationParams, PaginationResult } from './index';

/**
 * 标签项目
 */
export interface TagItem {
  id: string;
  name: string;
  slug: string;
  videoCount?: number;
  createdAt: string;
}

/**
 * 获取标签列表请求
 */
export interface GetTagsRequest extends PaginationParams {
  query?: string;
  sort?: 'popular' | 'name' | 'recent';
}

/**
 * 获取标签列表响应
 */
export interface GetTagsResponse extends PaginationResult<TagItem> {}

/**
 * 创建标签请求
 */
export interface CreateTagRequest {
  name: string;
}

/**
 * 创建标签响应
 */
export interface CreateTagResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

/**
 * 根据标签获取视频请求
 */
export interface GetVideosByTagRequest extends PaginationParams {
  tagId: string;
  sort?: 'newest' | 'popular' | 'trending';
}

/**
 * 分类项目
 */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  childrenCount?: number;
  videoCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取分类列表请求
 */
export interface GetCategoriesRequest extends PaginationParams {
  parentId?: string;
  includeChildren?: boolean;
}

/**
 * 获取分类列表响应
 */
export interface GetCategoriesResponse extends PaginationResult<CategoryItem> {}

/**
 * 创建分类请求
 */
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

/**
 * 更新分类请求
 */
export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  parentId?: string;
}

/**
 * 根据分类获取视频请求
 */
export interface GetVideosByCategoryRequest extends PaginationParams {
  categoryId: string;
  includeSubcategories?: boolean;
  sort?: 'newest' | 'popular' | 'trending';
}

/**
 * 热门标签响应
 */
export interface GetTrendingTagsResponse {
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    videoCount: number;
    trend: number; // 增长百分比
  }>;
  period: '24h' | '7d' | '30d';
}
