import { AxiosInstance, AxiosRequestConfig } from 'axios';
export declare const createApiClient: (config?: AxiosRequestConfig) => AxiosInstance;
export declare const apiClient: AxiosInstance;
export declare const apiRequest: <T>(request: Promise<T>) => Promise<T>;
