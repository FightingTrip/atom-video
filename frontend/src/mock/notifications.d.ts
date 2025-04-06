import type { Notification } from '@/types';
export declare const mockNotificationApi: {
    getNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: Notification[];
        total: number;
        hasMore: boolean;
        unreadCount: number;
    }>;
    markAsRead(notificationId: string): Promise<{
        success: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
};
