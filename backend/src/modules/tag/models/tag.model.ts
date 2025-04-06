/**
 * 标签模型模块
 *
 * 定义标签相关的数据模型和DTO接口
 * @module tag/models/tag
 */

/**
 * 标签DTO
 */
export interface TagDto {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt?: Date;
  count?: number; // 使用该标签的视频数量
}

/**
 * 创建标签DTO
 */
export interface CreateTagDto {
  name: string;
  slug?: string; // 如果不提供，将由服务端根据name生成
}

/**
 * 更新标签DTO
 */
export interface UpdateTagDto {
  name?: string;
  slug?: string;
}

/**
 * 标签查询参数
 */
export interface TagQueryParams {
  search?: string;
  sort?: 'name' | 'createdAt' | 'count';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * 批量标签操作DTO
 */
export interface BulkTagsDto {
  tagIds: string[];
} 