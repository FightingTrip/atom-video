/**
 * 通知模型索引文件
 *
 * 导出通知模块的所有模型和类型
 * @module notification/models
 */

/**
 * 通知统计数据
 */
export interface NotificationStats {
  /** 未读通知数量 */
  unreadCount: number;

  /** 总通知数量 */
  totalCount: number;

  /** 今日新通知数量 */
  todayCount: number;
}

/**
 * 分页通知响应
 */
export interface PaginatedNotificationsResponse {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
