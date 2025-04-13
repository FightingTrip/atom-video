/**
 * 标签和分类相关类型定义
 */

/**
 * 标签接口
 */
export interface ITag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

/**
 * 分类接口
 */
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}
