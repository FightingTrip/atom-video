// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - 使用 Pinia 进行状态管理

import { useMessage } from 'naive-ui';

// 提供全局单例备份以支持非组件上下文
let globalMessage: ReturnType<typeof useMessage> | null = null;

// 全局设置消息实例
export function setGlobalMessage(message: ReturnType<typeof useMessage>) {
  globalMessage = message;
}

/**
 * Toast消息通知组合式函数
 * 提供一个简单、一致的方式来显示消息通知
 * 自动处理组件外部使用的情况
 */
export function useToast() {
  // 尝试获取消息实例
  let message: ReturnType<typeof useMessage> | null = null;

  try {
    // 尝试从当前组件上下文获取
    message = useMessage();
  } catch (error) {
    // 在组件外部使用时可能会抛出错误
    console.debug('useToast: 不在组件上下文中，使用全局消息备份');
  }

  // 如果组件上下文中没有获取到，使用全局备份
  const messageInstance = message || globalMessage;

  return {
    success(content: string) {
      try {
        if (messageInstance?.success) {
          messageInstance.success(content);
        } else {
          console.log(`[Toast success]: ${content}`);
        }
      } catch (error) {
        console.error('显示success消息时出错:', error);
        console.log(`[Toast success降级]: ${content}`);
      }
    },

    error(content: string) {
      try {
        if (messageInstance?.error) {
          messageInstance.error(content);
        } else {
          console.error(`[Toast error]: ${content}`);
        }
      } catch (error) {
        console.error('显示error消息时出错:', error);
        console.error(`[Toast error降级]: ${content}`);
      }
    },

    warning(content: string) {
      try {
        if (messageInstance?.warning) {
          messageInstance.warning(content);
        } else {
          console.warn(`[Toast warning]: ${content}`);
        }
      } catch (error) {
        console.error('显示warning消息时出错:', error);
        console.warn(`[Toast warning降级]: ${content}`);
      }
    },

    info(content: string) {
      try {
        if (messageInstance?.info) {
          messageInstance.info(content);
        } else {
          console.info(`[Toast info]: ${content}`);
        }
      } catch (error) {
        console.error('显示info消息时出错:', error);
        console.info(`[Toast info降级]: ${content}`);
      }
    },
  };
}
