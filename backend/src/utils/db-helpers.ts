import { PrismaClient } from '@prisma/client';
import { DatabaseError } from './app-error';

// 单例Prisma客户端
let prisma: PrismaClient;

/**
 * 获取Prisma客户端实例
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }
  return prisma;
}

/**
 * 包装数据库操作，统一处理错误
 * @param operation 数据库操作函数
 * @returns 包装后的数据库操作结果
 */
export async function withDbClient<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
  const client = getPrismaClient();
  try {
    return await operation(client);
  } catch (error) {
    console.error('Database operation error:', error);
    if (error instanceof Error) {
      throw new DatabaseError(`Database operation failed: ${error.message}`, {
        originalError: error.message,
      });
    }
    throw new DatabaseError('Unknown database error');
  }
}

/**
 * 分页参数处理函数
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 处理后的分页参数
 */
export function getPaginationParams(
  page?: number | string | null,
  pageSize?: number | string | null
): { skip: number; take: number; page: number; pageSize: number } {
  const parsedPage = Math.max(Number.isInteger(Number(page)) ? Number(page) : 1, 1);
  const parsedPageSize = Math.max(
    Math.min(
      Number.isInteger(Number(pageSize)) ? Number(pageSize) : 10,
      100 // 最大页大小限制
    ),
    1
  );

  return {
    skip: (parsedPage - 1) * parsedPageSize,
    take: parsedPageSize,
    page: parsedPage,
    pageSize: parsedPageSize,
  };
}

/**
 * 构建全文搜索条件
 * @param query 搜索关键词
 * @param fields 要搜索的字段
 * @returns Prisma 搜索条件
 */
export function buildSearchCondition(query: string, fields: string[]): any {
  if (!query.trim()) return {};

  const searchTerms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(term => term.toLowerCase());

  if (searchTerms.length === 0) return {};

  const conditions = searchTerms.map(term => {
    const fieldConditions = fields.map(field => {
      const fieldPath = field.split('.');
      if (fieldPath.length === 1) {
        return {
          [field]: {
            contains: term,
            mode: 'insensitive',
          },
        };
      } else {
        // 处理嵌套字段
        let condition: any = {
          contains: term,
          mode: 'insensitive',
        };

        for (let i = fieldPath.length - 1; i >= 0; i--) {
          condition = {
            [fieldPath[i]]: condition,
          };
        }

        return condition;
      }
    });

    return { OR: fieldConditions };
  });

  return { AND: conditions };
}

/**
 * 安全的排序参数处理
 * @param sortBy 排序字段
 * @param direction 排序方向
 * @param allowedFields 允许的排序字段
 * @returns 安全的排序对象
 */
export function getSafeOrderBy(
  sortBy?: string | null,
  direction?: 'asc' | 'desc' | null,
  allowedFields: string[] = []
): Record<string, 'asc' | 'desc'> | undefined {
  if (!sortBy || !allowedFields.includes(sortBy)) {
    return undefined;
  }

  const safeDirection = direction === 'desc' ? 'desc' : 'asc';
  return {
    [sortBy]: safeDirection,
  };
}
