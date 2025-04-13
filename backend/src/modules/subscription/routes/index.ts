/**
 * 订阅路由配置文件
 *
 * 定义订阅模块的路由常量和配置
 * @module subscription/routes
 */

/**
 * 订阅模块路由前缀
 */
export const SUBSCRIPTION_ROUTES = {
  /** 订阅基础路径 */
  BASE: 'subscriptions',

  /** 订阅创作者 */
  SUBSCRIBE: 'subscribe',

  /** 取消订阅 */
  UNSUBSCRIBE: 'unsubscribe/:creatorId',

  /** 获取当前用户订阅列表 */
  MY_SUBSCRIPTIONS: 'my',

  /** 获取指定用户的订阅列表 */
  USER_SUBSCRIPTIONS: 'user/:userId',

  /** 获取创作者的订阅者列表 */
  CREATOR_SUBSCRIBERS: 'creator/:creatorId/subscribers',

  /** 获取创作者的订阅者数量 */
  CREATOR_SUBSCRIBER_COUNT: 'creator/:creatorId/count',

  /** 获取当前用户作为创作者的订阅者列表 */
  MY_SUBSCRIBERS: 'my/subscribers',

  /** 检查订阅状态 */
  CHECK_SUBSCRIPTION: 'check/:creatorId',

  /** 更新订阅通知设置 */
  UPDATE_NOTIFICATION: 'notification/:creatorId',

  /** 批量获取多个创作者的订阅状态 */
  BULK_CHECK: 'bulk-check',
};
