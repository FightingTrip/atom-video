/**
 * 历史记录模块
 *
 * 处理用户观看历史相关功能
 * @module history/history.module
 */

import { Module } from '@nestjs/common';
import { HistoryService } from './services/history.service';
import { HistoryController } from './controllers/history.controller';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * 历史记录模块类
 */
@Module({
  imports: [PrismaModule],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
