// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - 使用 Pinia 进行状态管理

import { ref } from 'vue';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastState {
  isVisible: boolean;
  type: ToastOptions['type'];
  message: string;
}

const toastState = ref<ToastState>({
  isVisible: false,
  type: 'info',
  message: '',
});

let timeoutId: number | null = null;

export const useToast = () => {
  const showToast = (options: ToastOptions) => {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 设置新的状态
    toastState.value = {
      isVisible: true,
      type: options.type,
      message: options.message,
    };

    // 设置自动隐藏
    timeoutId = window.setTimeout(() => {
      toastState.value.isVisible = false;
      timeoutId = null;
    }, options.duration || 3000);
  };

  const hideToast = () => {
    toastState.value.isVisible = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const success = (message: string, duration?: number) => {
    showToast({ type: 'success', message, duration });
  };

  const error = (message: string, duration?: number) => {
    showToast({ type: 'error', message, duration });
  };

  const info = (message: string, duration?: number) => {
    showToast({ type: 'info', message, duration });
  };

  const warning = (message: string, duration?: number) => {
    showToast({ type: 'warning', message, duration });
  };

  return {
    toastState,
    success,
    error,
    info,
    warning,
    hideToast,
  };
};
