/**
 * @file useToast.ts
 * @description Toast通知组合式函数
 */

import { useMessage } from 'naive-ui';
import { getCurrentInstance } from 'vue';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  duration?: number;
  closable?: boolean;
}

// 提供全局单例备份以支持非组件上下文
let globalMessage: ReturnType<typeof useMessage> | null = null;

// 全局设置消息实例
export function setGlobalMessage(message: ReturnType<typeof useMessage>) {
  globalMessage = message;
}

/**
 * Toast通知组合式函数
 * 提供简洁的方式来显示各种类型的通知消息
 */
export function useToast() {
  // 尝试获取Naive UI的message实例
  let message: ReturnType<typeof useMessage> | null = null;

  try {
    // 在组件中使用
    message = useMessage();
  } catch (e) {
    // 如果不在组件中或未提供useMessage的上下文中，忽略错误
    console.warn('useToast: 未在正确的Naive UI上下文中使用，通知功能可能无法正常工作');
  }

  /**
   * 显示toast通知
   * @param content 通知内容
   * @param type 通知类型
   * @param options 附加选项
   */
  const showToast = (content: string, type: ToastType = 'info', options: ToastOptions = {}) => {
    if (!message) {
      // 如果没有message实例，将通知降级为console输出
      console.log(`[Toast ${type}]: ${content}`);
      return;
    }

    const { duration = 3000, closable = false } = options;

    switch (type) {
      case 'success':
        return message.success(content, { duration, closable });
      case 'info':
        return message.info(content, { duration, closable });
      case 'warning':
        return message.warning(content, { duration, closable });
      case 'error':
        return message.error(content, { duration, closable });
      default:
        return message.info(content, { duration, closable });
    }
  };

  /**
   * 显示成功通知
   */
  const showSuccess = (content: string, options?: ToastOptions) => {
    return showToast(content, 'success', options);
  };

  /**
   * 显示信息通知
   */
  const showInfo = (content: string, options?: ToastOptions) => {
    return showToast(content, 'info', options);
  };

  /**
   * 显示警告通知
   */
  const showWarning = (content: string, options?: ToastOptions) => {
    return showToast(content, 'warning', options);
  };

  /**
   * 显示错误通知
   */
  const showError = (content: string, options?: ToastOptions) => {
    return showToast(content, 'error', options);
  };

  /**
   * 显示加载中通知
   * @returns 关闭loading的函数
   */
  const showLoading = (content: string = '加载中...') => {
    if (!message) {
      console.log(`[Toast loading]: ${content}`);
      return () => {};
    }

    return message.loading(content, { duration: 0 });
  };

  return {
    showToast,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showLoading,
  };
}

export default useToast;
