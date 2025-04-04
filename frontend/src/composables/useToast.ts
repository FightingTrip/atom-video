// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - 使用 Pinia 进行状态管理

import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const toastState = ref<ToastState>({
  isVisible: false,
  message: '',
  type: 'info',
});

let timeout: number | null = null;

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    toastState.value = {
      isVisible: true,
      message,
      type,
    };

    timeout = window.setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    toastState.value.isVisible = false;
  };

  return {
    toastState,
    showToast,
    hideToast,
  };
}
