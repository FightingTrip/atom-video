import type { ApiResponse } from '@/types';
declare const api: import("axios").AxiosInstance;
export declare const apiClient: {
    get<T>(url: string, params?: object): Promise<ApiResponse<T>>;
    post<T>(url: string, data?: object): Promise<ApiResponse<T>>;
    put<T>(url: string, data?: object): Promise<ApiResponse<T>>;
    delete<T>(url: string): Promise<ApiResponse<T>>;
};
export default api;
