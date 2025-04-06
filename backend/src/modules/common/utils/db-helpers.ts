/**
 * 数据库助手工具模块
 *
 * 提供数据库操作的辅助方法，如连接管理、事务处理和分页参数生成
 * @module common/utils/db-helpers
 */

import { PrismaClient } from '@prisma/client';
import { DatabaseError } from './app-error';

// 创建PrismaClient单例
let prismaClient: PrismaClient | null = null;

/**
 * 获取Prisma客户端实例（单例模式）
 * @returns PrismaClient实例
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prismaClient;
}

/**
 * 使用数据库客户端执行操作的包装函数
 * @param callback 操作回调
 * @returns 操作结果
 * @throws DatabaseError 数据库错误
 */
export async function withDbClient<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
  const prisma = getPrismaClient();
  try {
    return await callback(prisma);
  } catch (error) {
    console.error('Database operation error:', error);
    throw new DatabaseError('数据库操作失败', {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * 在事务中执行操作的包装函数
 * @param callback 事务回调
 * @returns 事务执行结果
 * @throws DatabaseError 数据库错误
 */
export async function performTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = getPrismaClient();
  try {
    return await prisma.$transaction(async tx => {
      return await callback(tx as unknown as PrismaClient);
    });
  } catch (error) {
    console.error('Transaction error:', error);
    throw new DatabaseError('事务执行失败', {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * 获取分页参数
 * @param page 页码（从1开始）
 * @param pageSize 每页大小
 * @returns 包含skip和take的分页参数对象
 */
export function getPaginationParams(
  page: number = 1,
  pageSize: number = 10
): { skip: number; take: number } {
  // 确保页码和每页大小是有效值
  const validPage = page < 1 ? 1 : page;
  const validPageSize = pageSize < 1 ? 10 : pageSize > 100 ? 100 : pageSize;

  // 计算偏移量
  const skip = (validPage - 1) * validPageSize;

  return {
    skip,
    take: validPageSize,
  };
}

/**
 * 关闭数据库连接
 * 在应用程序退出时使用
 */
export async function disconnectDatabase(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

/**
 * 构建搜索条件，支持多字段模糊搜索
 * @param query 搜索关键字
 * @param fields 要搜索的字段数组
 * @returns Prisma WHERE条件对象
 */
export function buildSearchCondition(query: string | undefined, fields: string[]) {
  if (!query) return {};

  const conditions = fields.map(field => ({
    [field]: {
      contains: query,
      mode: 'insensitive' as const,
    },
  }));

  return {
    OR: conditions,
  };
}

/**
 * 构建排序参数
 * @param sortBy 排序字段
 * @param sortOrder 排序方向
 * @returns Prisma排序参数对象
 */
export function getSortParams(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
  if (!sortBy) return undefined;

  return {
    [sortBy]: sortOrder,
  };
}
