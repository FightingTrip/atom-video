import { AxiosError } from 'axios';
import { ApiError } from './types';

// 检查是否应该进入离线模式
export function checkAndEnableOfflineMode(error: unknown): boolean {
  // 检查是否已经在离线模式
  if (localStorage.getItem('offline_mode') === 'true') {
    return true;
  }

  // 检查是否是网络相关错误
  if (error instanceof AxiosError) {
    if (
      !error.response &&
      error.message &&
      (error.message.includes('Network Error') ||
        error.message.includes('timeout') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ECONNABORTED'))
    ) {
      // 设置离线模式标记
      localStorage.setItem('offline_mode', 'true');
      console.warn('[API] 网络连接问题，已切换到离线模式');
      return true;
    }
  }

  return false;
}

// 处理 API 错误
export function handleApiError(error: unknown): never {
  // 检查是否应该进入离线模式
  const isOffline = checkAndEnableOfflineMode(error);

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
      let message = '服务器无响应，请稍后再试';

      // 如果是离线模式，修改消息
      if (isOffline) {
        message = '网络连接问题，应用将以离线模式运行';
      }

      console.error('API Error: No Response', message);

      throw new ApiError(message, 0, 'NO_RESPONSE');
    }
  }

  // 其他错误
  const message = error instanceof Error ? error.message : '发生未知错误';

  console.error('Unknown Error:', message);

  throw new ApiError(message, 0, 'UNKNOWN_ERROR');
}

// 检查当前是否处于离线模式
export function isOfflineMode(): boolean {
  return localStorage.getItem('offline_mode') === 'true';
}

// 尝试自动检测网络连接并刷新
export async function checkNetworkAndReconnect(): Promise<boolean> {
  try {
    // 设置一个短超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('/api/ping', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      // 网络恢复，清除离线模式标志
      localStorage.removeItem('offline_mode');
      return true;
    }
    return false;
  } catch (err) {
    // 网络仍然不可用
    console.warn('网络连接检测失败:', err);
    return false;
  }
}
