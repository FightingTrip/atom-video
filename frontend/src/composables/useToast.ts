// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - 使用 Pinia 进行状态管理

import { useMessage } from 'naive-ui';

export function useToast() {
  try {
    const message = useMessage();

    return {
      success(content: string | undefined | null) {
        if (content && message && typeof message.success === 'function') {
          message.success(content);
        } else if (content) {
          console.log('Success:', content);
        }
      },
      error(content: string | undefined | null) {
        if (content && message && typeof message.error === 'function') {
          message.error(content);
        } else if (content) {
          console.error('Error:', content);
        } else {
          // 提供默认错误信息，避免undefined错误
          if (message && typeof message.error === 'function') {
            message.error('发生未知错误');
          } else {
            console.error('Error: 发生未知错误');
          }
        }
      },
      warning(content: string | undefined | null) {
        if (content && message && typeof message.warning === 'function') {
          message.warning(content);
        } else if (content) {
          console.warn('Warning:', content);
        }
      },
      info(content: string | undefined | null) {
        if (content && message && typeof message.info === 'function') {
          message.info(content);
        } else if (content) {
          console.info('Info:', content);
        }
      },
    };
  } catch (err) {
    // 提供后备实现，以防useMessage不可用
    console.error('Toast initialization error:', err);
    return {
      success(content: string | undefined | null) {
        if (content) console.log('Success:', content);
      },
      error(content: string | undefined | null) {
        if (content) console.error('Error:', content);
        else console.error('Error: 发生未知错误');
      },
      warning(content: string | undefined | null) {
        if (content) console.warn('Warning:', content);
      },
      info(content: string | undefined | null) {
        if (content) console.info('Info:', content);
      },
    };
  }
}
