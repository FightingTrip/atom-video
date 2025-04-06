/**
 * 数据库辅助工具模块
 *
 * 提供Prisma客户端的管理和数据库操作辅助功能
 * @module common/utils/db-helpers
 */

import { PrismaClient } from '@prisma/client';
import { DatabaseError } from './app-error';

// 声明全局变量用于存储Prisma实例
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * 获取Prisma客户端实例
 * 在开发环境下实现热重载不重复创建连接
 * @returns PrismaClient实例
 */
export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    return global.prisma;
  }
}

/**
 * 使用提供的Prisma客户端执行数据库操作
 * @param callback 接受Prisma客户端的回调函数
 * @returns 回调函数的返回值
 * @throws DatabaseError 数据库操作失败时抛出
 */
export async function withDbClient<T>(callback: (client: PrismaClient) => Promise<T>): Promise<T> {
  const prisma = getPrismaClient();
  try {
    return await callback(prisma);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    // 记录详细错误信息，但在响应中提供友好消息
    console.error('数据库操作错误:', error);
    throw new DatabaseError('数据库操作失败');
  }
}

/**
 * 构建分页参数
 * @param page 页码
 * @param pageSize 每页大小
 * @returns Prisma分页参数对象
 */
export function getPaginationParams(page: number = 1, pageSize: number = 10) {
  // 确保页码和页大小为正整数
  const validPage = Math.max(1, Math.floor(page));
  const validPageSize = Math.max(1, Math.min(100, Math.floor(pageSize))); // 限制最大为100

  return {
    skip: (validPage - 1) * validPageSize,
    take: validPageSize,
  };
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

/**
 * 执行事务
 * @param operations 事务中的操作数组
 * @returns 返回事务操作结果
 */
export async function performTransaction<T>(
  operations: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = getPrismaClient();
  try {
    return await prisma.$transaction(async tx => {
      return await operations(tx as unknown as PrismaClient);
    });
  } catch (error) {
    console.error('事务执行错误:', error);
    throw new DatabaseError('事务执行失败');
  }
}
