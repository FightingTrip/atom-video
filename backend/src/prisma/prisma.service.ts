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

    // SQLite模式下不支持query事件，所以在这里移除
    // 如果使用PostgreSQL则可以取消下面注释
    /*
    this.$on('query', (e: any) => {
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`查询: ${e.query}`);
        this.logger.debug(`执行时间: ${e.duration}ms`);
      }
    });
    */
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

    // SQLite模式下使用不同的清库方法
    if (process.env.DATABASE_URL?.includes('sqlite')) {
      // 对于SQLite，使用不同的清理方法
      const tables = await this.$queryRaw<Array<{ name: string }>>`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations'
      `;

      for (const { name } of tables) {
        await this.$executeRawUnsafe(`DELETE FROM "${name}"`);
      }
    } else {
      // PostgreSQL清理方法
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
}
