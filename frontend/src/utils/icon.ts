import { h } from 'vue';
import * as antIcons from '@ant-design/icons-vue';

/**
 * 渲染图标
 * @param icon 图标名称或组件
 * @returns 渲染函数
 */
export function renderIcon(icon: string) {
  return () => h('i', { class: icon });
}

/**
 * 解析图标组件
 * @param iconName 图标名称（可以是Ant Design图标名）
 * @returns 图标组件
 */
export function resolveIconComponent(iconName: string) {
  // 处理Ant Design图标
  if (
    iconName.endsWith('Outlined') ||
    iconName.endsWith('Filled') ||
    iconName.endsWith('TwoTone')
  ) {
    // @ts-ignore - 动态访问图标
    return antIcons[iconName];
  }

  // 处理自定义图标类 (例如: 'icon-user')
  if (iconName.startsWith('icon-')) {
    return h('i', { class: iconName });
  }

  // 其他图标处理，可以根据需要扩展
  return h('i', { class: iconName });
}
