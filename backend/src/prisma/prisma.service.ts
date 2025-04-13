/**
 * Prisma服务
 *
 * 提供数据库访问和连接管理
 * @module prisma/prisma.service
 */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  /**
   * 在应用启动时建立数据库连接
   */
  async onModuleInit() {
    this.logger.log('建立Prisma数据库连接...');
    await this.$connect();
    this.logger.log('Prisma数据库连接已建立');

    // 添加日志
    this.$on('query', (e: any) => {
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`查询: ${e.query}`);
        this.logger.debug(`执行时间: ${e.duration}ms`);
      }
    });
  }

  /**
   * 在应用关闭时断开数据库连接
   */
  async onModuleDestroy() {
    this.logger.log('关闭Prisma数据库连接...');
    await this.$disconnect();
    this.logger.log('Prisma数据库连接已关闭');
  }

  // 清除测试数据库（仅用于测试环境）
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('This operation is only allowed in test environment');
    }

    const tables = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tables) {
      if (tablename !== '_prisma_migrations') {
        await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      }
    }
  }
}
