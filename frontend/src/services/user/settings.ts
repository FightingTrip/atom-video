/**
 * @file settings.ts
 * @description 用户设置服务，包括通知设置、隐私设置等
 */

import { UserNotificationSettings, UserPrivacySettings } from '@/types';
import mockDb from '@/mock/mockDb';

// const mockDb = new MockDb();

/**
 * 获取用户通知设置
 * @param userId 用户ID
 * @returns 用户通知设置
 */
export async function getUserNotificationSettings(
  userId: string
): Promise<UserNotificationSettings> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));

    // 从模拟数据库获取用户
    const user = mockDb.getUserById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 默认设置
    const defaultSettings: UserNotificationSettings = {
      likes: true,
      comments: true,
      replies: true,
      follows: true,
      videoProcessing: true,
      updates: true,
      emailNotification: true,
      browserNotification: true,
    };

    // 如果用户有设置，则使用用户设置，否则使用默认设置
    // 由于mock数据库中的类型与前端接口类型可能不完全匹配，这里直接使用断言
    const userSettings = user.notifications
      ? { ...defaultSettings, ...user.notifications }
      : defaultSettings;

    // 确保返回的对象符合UserNotificationSettings接口
    return {
      likes: userSettings.likes ?? true,
      comments: userSettings.comments ?? true,
      replies: userSettings.replies ?? true,
      follows: userSettings.follows ?? true,
      videoProcessing: userSettings.videoProcessing ?? true,
      updates: userSettings.updates ?? true,
      emailNotification: userSettings.emailNotification ?? true,
      browserNotification: userSettings.browserNotification ?? true,
    };
  } catch (error) {
    console.error('获取通知设置失败:', error);
    // 返回默认设置
    return {
      likes: true,
      comments: true,
      replies: true,
      follows: true,
      videoProcessing: true,
      updates: true,
      emailNotification: true,
      browserNotification: true,
    };
  }
}

/**
 * 更新用户通知设置
 * @param userId 用户ID
 * @param settings 通知设置
 * @returns 更新后的通知设置
 */
export async function updateUserNotificationSettings(
  userId: string,
  settings: UserNotificationSettings
): Promise<UserNotificationSettings> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

    // 使用模拟数据库更新用户资料
    // 为了兼容mock数据库中的User模型，这里使用any类型
    const result = mockDb.updateUser(userId, { notifications: settings as any });

    if (!result.success) {
      throw new Error(result.error || '更新通知设置失败');
    }

    return settings;
  } catch (error) {
    console.error('更新通知设置失败:', error);
    throw error;
  }
}

/**
 * 获取用户隐私设置
 * @param userId 用户ID
 * @returns 用户隐私设置
 */
export async function getUserPrivacySettings(userId: string): Promise<UserPrivacySettings> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));

    // 从模拟数据库获取用户
    const user = mockDb.getUserById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 默认设置
    const defaultSettings: UserPrivacySettings = {
      showWatchHistory: true,
      showFavorites: true,
      showFollowing: true,
      showLikes: true,
      commentPermission: 'everyone',
    };

    // 检查用户是否有privacy属性
    const userPrivacy = (user as any).privacy;

    // 如果用户有设置，则使用用户设置，否则使用默认设置
    const userSettings = userPrivacy ? { ...defaultSettings, ...userPrivacy } : defaultSettings;

    // 确保返回的对象符合UserPrivacySettings接口
    return {
      showWatchHistory: userSettings.showWatchHistory ?? true,
      showFavorites: userSettings.showFavorites ?? true,
      showFollowing: userSettings.showFollowing ?? true,
      showLikes: userSettings.showLikes ?? true,
      commentPermission: userSettings.commentPermission ?? 'everyone',
    };
  } catch (error) {
    console.error('获取隐私设置失败:', error);
    // 返回默认设置
    return {
      showWatchHistory: true,
      showFavorites: true,
      showFollowing: true,
      showLikes: true,
      commentPermission: 'everyone',
    };
  }
}

/**
 * 更新用户隐私设置
 * @param userId 用户ID
 * @param settings 隐私设置
 * @returns 更新后的隐私设置
 */
export async function updateUserPrivacySettings(
  userId: string,
  settings: UserPrivacySettings
): Promise<UserPrivacySettings> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

    // 使用模拟数据库更新用户资料
    // 为了兼容mock数据库中的User模型，这里使用any类型
    const result = mockDb.updateUser(userId, { privacy: settings } as any);

    if (!result.success) {
      throw new Error(result.error || '更新隐私设置失败');
    }

    return settings;
  } catch (error) {
    console.error('更新隐私设置失败:', error);
    throw error;
  }
}

/**
 * 更新用户密码
 * @param userId 用户ID
 * @param currentPassword 当前密码
 * @param newPassword 新密码
 * @returns 是否成功
 */
export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 700) + 300));

    // 使用模拟数据库更新密码
    const result = mockDb.changePassword(userId, currentPassword, newPassword);

    if (!result.success) {
      throw new Error(result.error || '密码更新失败');
    }

    return true;
  } catch (error) {
    console.error('更新密码失败:', error);
    throw error;
  }
}

export default {
  getUserNotificationSettings,
  updateUserNotificationSettings,
  getUserPrivacySettings,
  updateUserPrivacySettings,
  updateUserPassword,
};
