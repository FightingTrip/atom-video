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
export interface TagCategory {
    id: string;
    name: string;
    description?: string;
    tags: Tag[];
}
export interface TagSearchParams {
    keyword?: string;
    category?: string;
    sort?: 'name' | 'count' | 'created';
    page?: number;
    limit?: number;
}
export interface TagListResponse {
    tags: Tag[];
    total: number;
    hasMore: boolean;
}
export interface TagCategoryListResponse {
    categories: TagCategory[];
    total: number;
}
