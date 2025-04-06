/**
 * 样式统一导出文件
 * 集中导入所有样式
 */

// 导入全局样式
import '../../style.css';

// 导入其他样式模块
import './variables.css';
import './animations.css';
import './utils.css';

// 导出供JS引用的样式常量
export const COLORS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}; 