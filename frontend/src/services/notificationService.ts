import axios from 'axios';
import { ApiResponse, Notification, NotificationResponse } from '@/types';
import { API_BASE_URL } from '@/config';

const NOTIFICATION_URL = `${API_BASE_URL}/notifications`;

/**
 * 获取用户通知
 * @param page 页码
 * @param pageSize 每页大小
 */
export async function getNotifications(page = 1, pageSize = 10): Promise<NotificationResponse> {
  try {
    const { data } = await axios.get<ApiResponse<NotificationResponse>>(
      `${NOTIFICATION_URL}?page=${page}&pageSize=${pageSize}`
    );
    return data.data || { notifications: [], total: 0, unreadCount: 0 };
  } catch (error) {
    console.error('获取通知失败:', error);
    return { notifications: [], total: 0, unreadCount: 0 };
  }
}

/**
 * 标记通知为已读
 * @param id 通知ID，如果为空则标记所有未读通知为已读
 */
export async function markAsRead(id?: string): Promise<boolean> {
  try {
    const endpoint = id ? `${NOTIFICATION_URL}/${id}/read` : `${NOTIFICATION_URL}/read-all`;

    const { data } = await axios.put<ApiResponse>(endpoint);
    return data.success;
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return false;
  }
}

/**
 * 获取未读通知数量
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const { data } = await axios.get<ApiResponse<{ count: number }>>(
      `${NOTIFICATION_URL}/unread-count`
    );
    return data.data?.count || 0;
  } catch (error) {
    console.error('获取未读通知数量失败:', error);
    return 0;
  }
}

/**
 * 删除通知
 * @param id 通知ID
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const { data } = await axios.delete<ApiResponse>(`${NOTIFICATION_URL}/${id}`);
    return data.success;
  } catch (error) {
    console.error('删除通知失败:', error);
    return false;
  }
}
