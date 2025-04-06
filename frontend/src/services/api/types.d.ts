export interface ApiResponse<T> {
    data: T;
    message: string;
    code: string;
    success: boolean;
}
export interface PaginatedData<T> {
    items: T[];
    pagination: Pagination;
}
export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface FilterParams {
    keyword?: string;
    [key: string]: any;
}
export type QueryParams = PaginationParams & FilterParams;
export declare class ApiError extends Error {
    status: number;
    code: string;
    data: any;
    constructor(message: string, status: number, code?: string, data?: any);
}
