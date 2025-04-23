/**
 * 图标工具函数
 */
import { h } from 'vue';
import { NIcon } from 'naive-ui';
import type { Component } from 'vue';

/**
 * 渲染图标
 * @param icon 图标组件
 * @param props 图标属性
 * @returns 渲染后的图标组件
 */
export function renderIcon(icon: Component, props = {}) {
  return () => h(NIcon, props, { default: () => h(icon) });
}

/**
 * 根据文件类型获取对应的图标名称
 * @param fileType 文件类型或扩展名
 * @returns 图标组件名称
 */
export function getFileIcon(fileType: string): string {
  const type = fileType.toLowerCase();

  // 图片文件
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type)) {
    return 'FileImageOutlined';
  }

  // 文档文件
  if (['doc', 'docx', 'txt', 'pdf', 'odt', 'md', 'markdown'].includes(type)) {
    return 'FileTextOutlined';
  }

  // 表格文件
  if (['xls', 'xlsx', 'csv'].includes(type)) {
    return 'FileExcelOutlined';
  }

  // 压缩文件
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type)) {
    return 'FileZipOutlined';
  }

  // 音频文件
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(type)) {
    return 'FileAudioOutlined';
  }

  // 视频文件
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(type)) {
    return 'FileVideoOutlined';
  }

  // 代码文件
  if (
    [
      'js',
      'ts',
      'jsx',
      'tsx',
      'html',
      'css',
      'scss',
      'less',
      'json',
      'xml',
      'py',
      'java',
      'c',
      'cpp',
    ].includes(type)
  ) {
    return 'FileCodeOutlined';
  }

  // 默认文件图标
  return 'FileOutlined';
}

/**
 * 根据状态获取对应的图标和颜色
 * @param status 状态字符串
 * @returns 包含图标和颜色的对象
 */
export function getStatusIconAndColor(status: string): { icon: string; color: string } {
  const statusMap: Record<string, { icon: string; color: string }> = {
    active: { icon: 'CheckCircleOutlined', color: '#52c41a' },
    pending: { icon: 'ClockCircleOutlined', color: '#faad14' },
    disabled: { icon: 'CloseCircleOutlined', color: '#ff4d4f' },
    published: { icon: 'CheckCircleOutlined', color: '#52c41a' },
    draft: { icon: 'EditOutlined', color: '#1890ff' },
    rejected: { icon: 'CloseCircleOutlined', color: '#ff4d4f' },
    processing: { icon: 'SyncOutlined', color: '#1890ff' },
    warning: { icon: 'WarningOutlined', color: '#faad14' },
    error: { icon: 'CloseCircleOutlined', color: '#ff4d4f' },
    success: { icon: 'CheckCircleOutlined', color: '#52c41a' },
    info: { icon: 'InfoCircleOutlined', color: '#1890ff' },
  };

  return statusMap[status] || { icon: 'QuestionCircleOutlined', color: '#d9d9d9' };
}
