/**
 * @file mockDbMigration.ts
 * @description 模拟数据库迁移工具，用于处理数据结构变更
 */

import mockDb from '../mock/mockDb';
import { mockDelay } from './mockInitializer';
import type { User } from '../mock/models';

/**
 * 迁移版本号
 */
export const CURRENT_MIGRATION_VERSION = 1;

/**
 * 检查是否需要迁移
 * @returns 如果需要迁移返回true，否则返回false
 */
export function checkNeedsMigration(): boolean {
  const version = localStorage.getItem('mock_db_version');
  return version === null || parseInt(version) < CURRENT_MIGRATION_VERSION;
}

/**
 * 执行数据库迁移
 * @returns 迁移是否成功
 */
export async function runMigrations(): Promise<boolean> {
  console.log('[Migration] 开始数据库迁移检查...');

  const version = localStorage.getItem('mock_db_version');
  const currentVersion = version ? parseInt(version) : 0;

  if (currentVersion >= CURRENT_MIGRATION_VERSION) {
    console.log('[Migration] 数据库已是最新版本，无需迁移');
    return true;
  }

  try {
    // 模拟请求延迟
    await mockDelay(500, 1000);

    // 执行各版本的迁移
    if (currentVersion < 1) {
      await migrateToVersion1();
    }

    // 更新数据库版本号
    localStorage.setItem('mock_db_version', CURRENT_MIGRATION_VERSION.toString());
    console.log(`[Migration] 数据库已成功迁移到版本 ${CURRENT_MIGRATION_VERSION}`);

    return true;
  } catch (error) {
    console.error('[Migration] 数据库迁移失败:', error);
    return false;
  }
}

/**
 * 迁移到版本1：将用户location属性迁移到social.location
 */
async function migrateToVersion1(): Promise<void> {
  console.log('[Migration] 执行迁移到版本1：User.location -> User.social.location');

  try {
    // 获取所有用户数据
    const users = await mockDb.getAllUsers();

    let migratedCount = 0;

    // 遍历所有用户，将location属性迁移到social.location
    for (const user of users) {
      if (user.location && !user.social?.location) {
        // 创建更新对象
        const updateData: Partial<User> = {
          social: {
            ...user.social,
            location: user.location,
          },
        };

        // 更新用户数据
        const result = await mockDb.updateUser(user.id, updateData);

        if (result.success) {
          migratedCount++;
        }
      }
    }

    console.log(`[Migration] 成功迁移 ${migratedCount} 个用户的location数据`);
  } catch (error) {
    console.error('[Migration] User.location迁移失败:', error);
    throw error;
  }
}

/**
 * 重置数据库迁移状态
 * 此函数用于开发测试，生产环境不应使用
 */
export function resetMigrationStatus(): void {
  localStorage.removeItem('mock_db_version');
  console.log('[Migration] 已重置数据库迁移状态');
}

export default {
  checkNeedsMigration,
  runMigrations,
  resetMigrationStatus,
  CURRENT_MIGRATION_VERSION,
};
