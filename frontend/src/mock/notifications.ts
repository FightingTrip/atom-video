import { faker } from '@faker-js/faker/locale/zh_CN';
import type { Notification } from '@/types';

// Mock API 函数
export const mockNotificationApi = {
  // 获取通知列表
  async getNotifications(userId: string, page = 1, limit = 20) {
    await new Promise(resolve => setTimeout(resolve, 600));

    const notifications = Array.from(
      { length: 50 },
      (): Notification => ({
        id: faker.string.uuid(),
        userId,
        type: faker.helpers.arrayElement([
          'video_upload',
          'comment',
          'reply',
          'like',
          'subscribe',
          'mention',
        ]),
        title: faker.helpers.arrayElement([
          '新视频发布通知',
          '收到新评论',
          '收到回复',
          '获得点赞',
          '新增订阅者',
          '被提及',
        ]),
        content: faker.lorem.sentence(),
        isRead: faker.datatype.boolean(),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        relatedUserId: faker.string.uuid(),
        relatedVideoId: faker.string.uuid(),
      })
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      notifications: notifications.slice(start, end),
      total: notifications.length,
      hasMore: end < notifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length,
    };
  },

  // 标记通知为已读
  async markAsRead(notificationId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  // 标记所有通知为已读
  async markAllAsRead(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
};
