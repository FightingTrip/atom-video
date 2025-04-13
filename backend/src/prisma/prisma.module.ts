/**
 * Prisma模块
 *
 * 提供数据库连接服务
 * @module prisma/prisma.module
 */

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
