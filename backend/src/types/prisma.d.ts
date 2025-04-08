/**
 * Prisma类型声明
 */

import { PrismaClient } from '@prisma/client';

declare global {
  // 添加Prisma命名空间
  namespace Prisma {
    // User模型筛选条件
    interface UserWhereInput {
      id?: string | { equals?: string; in?: string[] };
      email?: string | { contains?: string; equals?: string };
      username?: string | { contains?: string; equals?: string };
      role?: string | { equals?: string; in?: string[] };
      isVerified?: boolean | { equals?: boolean };
      isCreator?: boolean | { equals?: boolean };
      createdAt?: Date | { gte?: Date; lte?: Date };
      updatedAt?: Date | { gte?: Date; lte?: Date };
      AND?: UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput[];
      [key: string]: any;
    }

    // Video模型筛选条件
    interface VideoWhereInput {
      id?: string | { equals?: string; in?: string[] };
      title?: string | { contains?: string; equals?: string };
      userId?: string | { equals?: string; in?: string[] };
      seriesId?: string | { equals?: string; in?: string[] };
      isPublished?: boolean | { equals?: boolean };
      createdAt?: Date | { gte?: Date; lte?: Date };
      updatedAt?: Date | { gte?: Date; lte?: Date };
      AND?: VideoWhereInput[];
      OR?: VideoWhereInput[];
      NOT?: VideoWhereInput[];
      [key: string]: any;
    }
  }
}

// 扩展PrismaClient类型
export interface ExtendedPrismaClient extends PrismaClient {
  // 如果有扩展的方法可以在这里添加
}
