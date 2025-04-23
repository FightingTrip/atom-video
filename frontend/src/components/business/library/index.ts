/**
 * @file components/business/library/index.ts
 * @description 媒体库相关组件的统一导出
 * @author Atom Video Team
 * @date 2025-04-23
 */

import * as playlist from './playlist';
// 可以导入其他媒体库相关模块，如history, subscription等

// 导出各子模块
export { playlist };

// 导出默认对象
export default {
  playlist,
};
