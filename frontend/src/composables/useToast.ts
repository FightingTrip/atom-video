// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - 使用 Pinia 进行状态管理

import { useMessage } from 'naive-ui';

export function useToast() {
  const message = useMessage();

  return {
    success(content: string) {
      message.success(content);
    },
    error(content: string) {
      message.error(content);
    },
    warning(content: string) {
      message.warning(content);
    },
    info(content: string) {
      message.info(content);
    },
  };
}
