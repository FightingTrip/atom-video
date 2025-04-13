/**
 * 订阅模型索引文件
 *
 * 导出订阅模块的所有模型和类型
 * @module subscription/models
 */

/**
 * 订阅者统计信息
 */
export interface SubscriberStats {
  /** 总订阅者数量 */
  total: number;

  /** 最近30天新增订阅者数量 */
  newThisMonth: number;

  /** 订阅者变化率（百分比） */
  growthRate: number;

  /** 开启通知的订阅者百分比 */
  notificationEnabledPercentage: number;
}
