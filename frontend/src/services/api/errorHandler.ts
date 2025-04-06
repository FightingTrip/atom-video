import { AxiosError } from 'axios';
import { ApiError } from './types';

// 处理 API 错误
export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const { response } = error;

    if (response) {
      // 服务器返回的错误
      const { status, data } = response;
      const message = data?.message || error.message || '请求失败';
      const errorCode = data?.code || '';

      // 显示错误信息
      console.error(`API Error (${status}): ${message}`);

      throw new ApiError(message, status, errorCode, data);
    } else if (error.request) {
      // 请求发送成功但没有收到响应
      const message = '服务器无响应，请稍后再试';

      console.error('API Error: No Response', message);

      throw new ApiError(message, 0, 'NO_RESPONSE');
    }
  }

  // 其他错误
  const message = error instanceof Error ? error.message : '发生未知错误';

  console.error('Unknown Error:', message);

  throw new ApiError(message, 0, 'UNKNOWN_ERROR');
}
