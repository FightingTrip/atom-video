/**
 * @file admin/index.ts
 * @description 管理后台服务导出入口
 */

import adminService, {
  DashboardStats,
  Activity,
  AdminVideo,
  AdminUser,
  AdminComment,
  AdminReport,
  PaginatedResult,
} from './adminService';

// 导出所有类型
export {
  DashboardStats,
  Activity,
  AdminVideo,
  AdminUser,
  AdminComment,
  AdminReport,
  PaginatedResult,
};

// 导出管理员服务
export default adminService;
