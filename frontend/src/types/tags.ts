// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagStats {
  totalTags: number;
  popularTags: Tag[];
  recentTags: Tag[];
  tagCloud: TagCloudItem[];
}

export interface TagCloudItem extends Tag {
  weight: number;
}

export interface TagFilter {
  selectedTags: string[];
  sortBy: 'name' | 'count' | 'recent';
  order: 'asc' | 'desc';
}

export interface TagSearchResult {
  tags: Tag[];
  total: number;
  page: number;
  pageSize: number;
}

// 标签分类
export interface TagCategory {
  id: string;
  name: string;
  description?: string;
  tags: Tag[];
}

// 标签搜索参数
export interface TagSearchParams {
  keyword?: string;
  category?: string;
  sort?: 'name' | 'count' | 'created';
  page?: number;
  limit?: number;
}

// 标签列表响应
export interface TagListResponse {
  tags: Tag[];
  total: number;
  hasMore: boolean;
}

// 标签分类列表响应
export interface TagCategoryListResponse {
  categories: TagCategory[];
  total: number;
}
