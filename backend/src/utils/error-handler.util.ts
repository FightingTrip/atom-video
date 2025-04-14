/**
 * 错误处理工具函数
 *
 * 提供安全处理未知类型错误的工具函数
 * @module utils/error-handler
 */

/**
 * 从未知错误中安全提取错误消息
 * @param error 未知类型的错误
 * @returns 提取的错误消息
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return '未知错误';
}

/**
 * 从未知错误中安全提取错误堆栈
 * @param error 未知类型的错误
 * @returns 提取的错误堆栈或undefined
 */
export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * 安全处理未知错误，返回格式化的错误信息和堆栈
 * @param error 未知类型的错误
 * @returns 包含消息和堆栈的对象
 */
export function formatError(error: unknown): { message: string; stack?: string } {
  return {
    message: getErrorMessage(error),
    stack: getErrorStack(error),
  };
}
