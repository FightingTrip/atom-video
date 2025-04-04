// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

export interface Tag {
  id: string;
  name: string;
  description?: string;
  count: number;
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
  color?: string;
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
